import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take, shareReplay } from 'rxjs';
import { environment } from '@env/environment';
import { CountryFacade } from '../../../../../core/store/country/country.facade';
import { TranslateService } from '@ngx-translate/core';

export interface BestSeller {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  currency: string;
  discount: number;
  flag: string;
}

export interface BestSellersResponse {
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
export class BestSellersService {
  private http = inject(HttpClient);
  private countryFacade = inject(CountryFacade);
  private translateService = inject(TranslateService);
  private bestSellerApiUrl = `${environment.apiUrl}/gc-bestseller`;

  // Cache for API responses
  private bestSellersCache: { [key: string]: Observable<BestSeller[]> } = {};

  /**
   * Get best sellers from the API using the selected country code
   * @returns An Observable of BestSeller array
   */
  getBestSellers(): Observable<BestSeller[]> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';
    console.log(
      'BestSellersService: getBestSellers called with language',
      lang
    );

    // Get the selected country code from the store
    return this.countryFacade.selectedCountryCode$.pipe(
      take(1),
      switchMap((countryCode) => {
        console.log('BestSellersService: Got country code', countryCode);
        const cacheKey = `${countryCode || 'default'}_${lang}`;

        // Check if we have a cached response
        if (this.bestSellersCache[cacheKey]) {
          console.log(
            'BestSellersService: Returning cached response for',
            cacheKey
          );
          return this.bestSellersCache[cacheKey];
        }

        // If no country code, use default
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          console.log(
            'BestSellersService: Creating new cache entry for default_' + lang
          );
          this.bestSellersCache[cacheKey] = this.fetchBestSellers(
            '',
            lang
          ).pipe(shareReplay(1));
          return this.bestSellersCache[cacheKey];
        }

        // Fetch and cache the response
        console.log(
          'BestSellersService: Creating new cache entry for',
          cacheKey
        );
        this.bestSellersCache[cacheKey] = this.fetchBestSellers(
          countryCode,
          lang
        ).pipe(shareReplay(1));
        return this.bestSellersCache[cacheKey];
      })
    );
  }

  /**
   * Clear the cache when needed (e.g., after a certain time period or when forced)
   */
  clearCache(): void {
    this.bestSellersCache = {};
  }

  /**
   * Fetch best sellers from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of best sellers
   */
  private fetchBestSellers(
    countryCode: string,
    lang: string
  ): Observable<BestSeller[]> {
    console.log(
      'BestSellersService: fetchBestSellers called with',
      countryCode,
      lang
    );
    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      country_code: countryCode,
    };

    console.log(
      'BestSellersService: Making API call to',
      this.bestSellerApiUrl,
      'with body',
      body
    );

    return new Observable<BestSeller[]>((observer) => {
      this.http
        .post<BestSellersResponse>(this.bestSellerApiUrl, body, { headers })
        .subscribe({
          next: (response) => {
            if (response.status === 'Success' && response.data) {
              // Transform API response to BestSeller format
              const bestSellers = this.transformBestSellersData(
                response.data,
                lang
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
   * Transform API data to BestSeller objects
   * @param data API response data
   * @param lang Language code
   * @returns Array of BestSeller objects
   */
  private transformBestSellersData(data: any[], lang: string): BestSeller[] {
    return data.map((item) => {
      // Calculate discount percentage if product_price_before is available
      let discountPercentage = 0;
      if (
        item.product_price_before > 0 &&
        item.product_price < item.product_price_before
      ) {
        discountPercentage = Math.round(
          ((item.product_price_before - item.product_price) /
            item.product_price_before) *
            100
        );
      } else if (item.offer === 1) {
        // If offer flag is set but no price_before, use a default discount
        discountPercentage = 5;
      }

      // Get country flag code (lowercase)
      const flagCode = item.country_code.substring(0, 2).toLowerCase();

      // Special case for Saudi Arabia: change currency symbol to Riyal.svg from assets
      let currencySymbol = item.symbol;
      if (item.country_code === 'SAU') {
        currencySymbol = 'assets/svgs/Riyal.svg';
      }

      return {
        id: item.id,
        title: lang === 'ar' ? item.web_name_ar : item.web_name_en,
        image: item.image,
        price: item.product_price,
        originalPrice:
          item.product_price_before > 0
            ? item.product_price_before
            : item.product_price,
        currency: currencySymbol,
        discount: discountPercentage,
        flag: flagCode,
      };
    });
  }
}
