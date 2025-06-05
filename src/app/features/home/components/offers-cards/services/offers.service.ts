import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
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

  /**
   * Get offers from the API using the selected country code
   * @returns An Observable of Offer array
   */
  getOffers(): Observable<Offer[]> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';

    // Get the selected country code from the store
    return this.countryFacade.selectedCountryCode$.pipe(
      take(1),
      switchMap((countryCode) => {
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          return this.fetchOffers('', lang);
        }

        return this.fetchOffers(countryCode, lang);
      })
    );
  }

  /**
   * Fetch offers from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of offers
   */
  private fetchOffers(countryCode: string, lang: string): Observable<Offer[]> {
    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      country_code: countryCode,
    };

    return new Observable<Offer[]>((observer) => {
      this.http.post<OffersResponse>(this.apiUrl, body, { headers }).subscribe({
        next: (response) => {
          if (response.status === 'Success' && response.data) {
            // Transform API response to Offer format
            const offers = response.data.map((offer) => {
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

              return {
                id: offer.id,
                title: lang === 'ar' ? offer.web_name_ar : offer.web_name_en,
                image: offer.image,
                price: offer.product_price,
                originalPrice:
                  offer.product_price_before > 0
                    ? offer.product_price_before
                    : offer.product_price,
                currency: offer.symbol,
                discount: discountPercentage,
                flag: flagCode,
              };
            });
            observer.next(offers);
            observer.complete();
          } else {
            observer.error('Invalid response format');
          }
        },
        error: (error) => {
          console.error('Error fetching offers:', error);
          observer.error(error);
        },
      });
    });
  }
}
