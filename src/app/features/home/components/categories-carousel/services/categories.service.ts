import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take, shareReplay } from 'rxjs';
import { environment } from '@env/environment';
import { CountryFacade } from '../../../../../core/store/country/country.facade';
import { TranslateService } from '@ngx-translate/core';

export interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

export interface CategoriesResponse {
  status: string;
  data: {
    id: number;
    web_name_en: string;
    web_name_ar: string;
    image: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private countryFacade = inject(CountryFacade);
  private translateService = inject(TranslateService);
  private apiUrl = `${environment.apiUrl}/gc-categories`;

  // Cache for API responses
  private categoriesCache: { [key: string]: Observable<Category[]> } = {};

  /**
   * Get main categories from the API using the selected country code
   * @returns An Observable of Category array
   */
  getCategories(): Observable<Category[]> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';

    // Get the selected country code from the store
    return this.countryFacade.selectedCountryCode$.pipe(
      take(1),
      switchMap((countryCode) => {
        const cacheKey = `${countryCode || 'default'}_${lang}`;

        // Check if we have a cached response
        if (this.categoriesCache[cacheKey]) {
          return this.categoriesCache[cacheKey];
        }

        // If no country code, use default
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          this.categoriesCache[cacheKey] = this.fetchCategories('', lang).pipe(
            shareReplay(1)
          );
          return this.categoriesCache[cacheKey];
        }

        // Fetch and cache the response
        this.categoriesCache[cacheKey] = this.fetchCategories(
          countryCode,
          lang
        ).pipe(shareReplay(1));
        return this.categoriesCache[cacheKey];
      })
    );
  }

  /**
   * Clear the cache when needed (e.g., after a certain time period or when forced)
   */
  clearCache(): void {
    this.categoriesCache = {};
  }

  /**
   * Fetch categories from API with specific country code and language
   * @param countryCode Country code
   * @param lang Language code
   * @returns Observable of categories
   */
  private fetchCategories(
    countryCode: string,
    lang: string
  ): Observable<Category[]> {
    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      country_code: countryCode,
      parent_id: 16,
    };

    return new Observable<Category[]>((observer) => {
      this.http
        .post<CategoriesResponse>(this.apiUrl, body, { headers })
        .subscribe({
          next: (response) => {
            if (response.status === 'Success' && response.data) {
              // Transform API response to Category format
              const categories = response.data.map((category) => ({
                id: category.id,
                name:
                  lang === 'ar' ? category.web_name_ar : category.web_name_en,
                image: category.image,
                link: `/categories/${category.id}`,
              }));
              observer.next(categories);
              observer.complete();
            } else {
              observer.error('Invalid response format');
            }
          },
          error: (error) => {
            console.error('Error fetching categories:', error);
            observer.error(error);
          },
        });
    });
  }
}
