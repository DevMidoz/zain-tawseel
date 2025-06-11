import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take, shareReplay, of } from 'rxjs';
import { environment } from '@env/environment';
import { CountryFacade } from '../../../../../core/store/country/country.facade';
import { TranslateService } from '@ngx-translate/core';

export interface Offer {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  currency: string;
  discount: number;
  flag: string;
  isBestSeller?: boolean;
}

export interface OffersResponse {
  status: string;
  data: {
    image: string;
    product_price: number;
    countryname: string;
    country_code: string;
    data_destination_id: number;
    currencyname: string;
    symbol: string;
    offer: number;
    best_seller: number;
    product_price_before: number;
    web_name_ar: string;
    web_name_en: string;
    site_id: number;
    category_id: number;
    id: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private http = inject(HttpClient);
  private countryFacade = inject(CountryFacade);
  private translateService = inject(TranslateService);
  private apiUrl = `${environment.apiUrl}/gc-offer`;
  private bestSellerApiUrl = `${environment.apiUrl}/gc-bestseller`;

  // Cache for API responses
  private offersCache: { [key: string]: Observable<Offer[]> } = {};

  /**
   * Get offers from the API using the selected country code
   * @returns An Observable of Offer array
   */
  getOffers(): Observable<Offer[]> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';
    console.log('OffersService: getOffers called with language', lang);

    // Get the selected country code from the store
    return this.countryFacade.selectedCountryCode$.pipe(
      take(1),
      switchMap((countryCode) => {
        console.log('OffersService: Got country code', countryCode);
        const cacheKey = `${countryCode || 'default'}_${lang}`;

        // Check if we have a cached response
        if (this.offersCache[cacheKey]) {
          console.log('OffersService: Returning cached response for', cacheKey);
          return this.offersCache[cacheKey];
        }

        // If no country code, use default
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          console.log(
            'OffersService: Creating new cache entry for default_' + lang
          );
          this.offersCache[cacheKey] = this.fetchOffers('', lang).pipe(
            shareReplay(1)
          );
          return this.offersCache[cacheKey];
        }

        // Fetch and cache the response
        console.log('OffersService: Creating new cache entry for', cacheKey);
        this.offersCache[cacheKey] = this.fetchOffers(countryCode, lang).pipe(
          shareReplay(1)
        );
        return this.offersCache[cacheKey];
      })
    );
  }

  /**
   * Clear the cache when needed (e.g., after a certain time period or when forced)
   */
  clearCache(): void {
    this.offersCache = {};
  }

  /**
   * Fetch offers from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of offers
   */
  private fetchOffers(countryCode: string, lang: string): Observable<Offer[]> {
    console.log('OffersService: fetchOffers called with', countryCode, lang);
    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      country_code: countryCode,
    };

    console.log(
      'OffersService: Making API call to',
      this.apiUrl,
      'with body',
      body
    );

    return new Observable<Offer[]>((observer) => {
      this.http.post<OffersResponse>(this.apiUrl, body, { headers }).subscribe({
        next: (response) => {
          console.log(
            'OffersService: API response received',
            response.status,
            response.data?.length || 0
          );
          if (
            response.status === 'Success' &&
            response.data &&
            response.data.length > 0
          ) {
            // Transform API response to Offer format
            const offers = this.transformOffersData(response.data, lang, false);
            observer.next(offers);
            observer.complete();
          } else {
            // If no offers data, fetch bestsellers instead
            console.log('No offers data, fetching bestsellers instead');
            this.fetchBestSellers(countryCode, lang).subscribe({
              next: (bestSellers) => {
                observer.next(bestSellers);
                observer.complete();
              },
              error: (error) => {
                console.error('Error fetching bestsellers:', error);
                observer.error(error);
              },
            });
          }
        },
        error: (error) => {
          console.error('Error fetching offers:', error);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Fetch bestsellers from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of bestseller offers
   */
  private fetchBestSellers(
    countryCode: string,
    lang: string
  ): Observable<Offer[]> {
    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      country_code: countryCode,
    };

    return new Observable<Offer[]>((observer) => {
      this.http
        .post<OffersResponse>(this.bestSellerApiUrl, body, { headers })
        .subscribe({
          next: (response) => {
            if (response.status === 'Success' && response.data) {
              // Transform API response to Offer format
              const bestSellers = this.transformOffersData(
                response.data,
                lang,
                true
              );
              observer.next(bestSellers);
              observer.complete();
            } else {
              // Return empty array if no bestsellers
              observer.next([]);
              observer.complete();
            }
          },
          error: (error) => {
            console.error('Error fetching bestsellers:', error);
            observer.error(error);
          },
        });
    });
  }

  /**
   * Transform API data to Offer objects
   * @param data API response data
   * @param lang Language code
   * @param isBestSeller Whether these are bestseller items
   * @returns Array of Offer objects
   */
  private transformOffersData(
    data: any[],
    lang: string,
    isBestSeller: boolean
  ): Offer[] {
    return data.map((offer) => {
      // Calculate discount percentage if product_price_before is available
      let discountPercentage = 0;
      if (
        offer.product_price_before > 0 &&
        offer.product_price < offer.product_price_before
      ) {
        discountPercentage = Math.round(
          ((offer.product_price_before - offer.product_price) /
            offer.product_price_before) *
            100
        );
      } else if (offer.offer === 1) {
        // If offer flag is set but no price_before, use a default discount
        discountPercentage = 5;
      }

      // Get country flag code (lowercase)
      const flagCode = offer.country_code.substring(0, 2).toLowerCase();

      // Special case for Saudi Arabia: change currency symbol to Riyal.svg from assets
      let currencySymbol = offer.symbol;
      if (offer.country_code === 'SAU') {
        currencySymbol = 'assets/svgs/Riyal.svg';
      }

      return {
        id: offer.id,
        title: lang === 'ar' ? offer.web_name_ar : offer.web_name_en,
        image: offer.image,
        price: offer.product_price,
        originalPrice:
          offer.product_price_before > 0
            ? offer.product_price_before
            : offer.product_price,
        currency: currencySymbol,
        discount: discountPercentage,
        flag: flagCode,
        isBestSeller,
      };
    });
  }
}
