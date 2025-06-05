import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  /**
   * Get list of countries from the API
   * @param lang Language code (default: 'ar')
   * @returns Observable of countries array
   */
  getCountries(lang: string = 'ar'): Observable<Country[]> {
    return this.http
      .post<CountryResponse>(this.apiUrl, '', {
        headers: {
          lang: lang,
        },
      })
      .pipe(map((response) => response.data || []));
  }
}
