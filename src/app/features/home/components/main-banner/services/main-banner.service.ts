import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface MainBanner {
  img: string;
  name: string;
}

interface MainBannerResponse {
  status: string;
  data: MainBanner[];
}

@Injectable({
  providedIn: 'root'
})
export class MainBannerService {
  private apiUrl = `${environment.apiUrl}/gc-mainbanner`;

  constructor(private http: HttpClient) { }

  /**
   * Get main banner data
   * @param countryCode Country code (e.g., 'KWT')
   * @param lang Language code (e.g., 'en', 'ar')
   * @returns Observable with the first banner from the response
   */
  getMainBanner(countryCode: string, lang: string): Observable<MainBanner | null> {
    return this.http.post<MainBannerResponse>(
      this.apiUrl,
      { country_code: countryCode },
      { headers: { lang } }
    ).pipe(
      map(response => {
        // Return the first banner or null if no banners
        return response.data && response.data.length > 0 ? response.data[0] : null;
      })
    );
  }
}
