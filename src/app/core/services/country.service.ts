import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Country {
  flag_picture: string;
  name_en: string;
  name_ar: string;
  country_code: string;
}

export interface CountryResponse {
  status: string;
  data: Country[];
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'https://dev.zaintawseel.com/api/v1/gc-countries';

  // Cache for API responses
  private countriesCache: { [key: string]: Observable<Country[]> } = {};

  constructor(private http: HttpClient) {}

  /**
   * Get list of countries from the API
   * @param lang Language code (default: 'ar')
   * @returns Observable of countries array
   */
  getCountries(lang: string = 'ar'): Observable<Country[]> {
    // Check if we have a cached response
    if (this.countriesCache[lang]) {
      return this.countriesCache[lang];
    }

    // Fetch and cache the response
    this.countriesCache[lang] = this.http
      .post<CountryResponse>(this.apiUrl, '', {
        headers: {
          lang: lang,
        },
      })
      .pipe(
        map((response) => response.data || []),
        shareReplay(1)
      );

    return this.countriesCache[lang];
  }

  /**
   * Clear the cache when needed
   */
  clearCache(): void {
    this.countriesCache = {};
  }
}
