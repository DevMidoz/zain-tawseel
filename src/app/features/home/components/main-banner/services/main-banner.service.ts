import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CountryFacade } from '../../../../../core/store/country/country.facade';
import { TranslateService } from '@ngx-translate/core';

export interface MainBanner {
  img: string;
  name: string;
}

interface MainBannerResponse {
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
        if (!countryCode) {
          console.warn('No country code selected, using default API call');
          return this.fetchMainBanner('', lang);
        }

        return this.fetchMainBanner(countryCode, lang);
      })
    );
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
