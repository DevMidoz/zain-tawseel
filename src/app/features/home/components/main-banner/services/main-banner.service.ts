import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  switchMap,
  take,
  shareReplay,
  BehaviorSubject,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CountryFacade } from '../../../../../core/store/country/country.facade';
import { TranslateService } from '@ngx-translate/core';

// Define product interface to expose it for use in the product-info page
export interface BannerProduct {
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
}

// Keep the public interface simple like before
export interface MainBanner {
  img: string;
  name: string;
  clickable?: number; // Optional for backward compatibility
  products_list?: BannerProduct[]; // Optional for backward compatibility
}

export interface MainBannerResponse {
  status: string;
  data: MainBanner[];
}

@Injectable({
  providedIn: 'root',
})
export class MainBannerService {
  private apiUrl = `${environment.apiUrl}/gc-mainbanner`;
  private http = inject(HttpClient);
  private countryFacade = inject(CountryFacade);
  private translateService = inject(TranslateService);

  // Store the current banner for navigation
  private currentBannerSubject = new BehaviorSubject<MainBanner | null>(null);
  currentBanner$ = this.currentBannerSubject.asObservable();

  // Cache for API responses
  private bannerCache: { [key: string]: Observable<MainBanner | null> } = {};

  /**
   * Get main banner data using the selected country code
   * @returns Observable with the first banner from the response
   */
  getMainBanner(): Observable<MainBanner | null> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';

    // Get the selected country code from the store
    return this.countryFacade.selectedCountryCode$.pipe(
      take(1),
      switchMap((countryCode) => {
        const cacheKey = `${countryCode || 'default'}_${lang}`;

        // Check if we have a cached response
        if (this.bannerCache[cacheKey]) {
          return this.bannerCache[cacheKey];
        }

        // If no country code, use default
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          this.bannerCache[cacheKey] = this.fetchMainBanner('', lang).pipe(
            shareReplay(1)
          );
          return this.bannerCache[cacheKey];
        }

        // Fetch and cache the response
        this.bannerCache[cacheKey] = this.fetchMainBanner(
          countryCode,
          lang
        ).pipe(shareReplay(1));
        return this.bannerCache[cacheKey];
      })
    );
  }

  /**
   * Set current banner for use in product-info page
   */
  setCurrentBanner(banner: MainBanner): void {
    this.currentBannerSubject.next(banner);
  }

  /**
   * Get the currently selected banner
   */
  getCurrentBanner(): Observable<MainBanner | null> {
    return this.currentBanner$;
  }

  /**
   * Clear the cache when needed (e.g., after a certain time period or when forced)
   */
  clearCache(): void {
    this.bannerCache = {};
  }

  /**
   * Fetch main banner from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of main banner
   */
  private fetchMainBanner(
    countryCode: string,
    lang: string
  ): Observable<MainBanner | null> {
    return this.http
      .post<MainBannerResponse>(
        this.apiUrl,
        { country_code: countryCode },
        { headers: { lang } }
      )
      .pipe(
        map((response) => {
          // Return the first banner or null if no banners
          return response.data && response.data.length > 0
            ? response.data[0]
            : null;
        })
      );
  }
}
