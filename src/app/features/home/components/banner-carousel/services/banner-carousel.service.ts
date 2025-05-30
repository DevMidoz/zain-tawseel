import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


export interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  title: string;
  link: string;
}

export interface BannerCarouselResponse {
  status: string;
  data: {
    img: string;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class BannerCarouselService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gc-mainslider`;

  /**
   * Get banner carousel slides from the API
   * @param countryCode The country code (e.g., 'KWT', 'SAU', 'UAE')
   * @param lang The language code (e.g., 'en', 'ar')
   * @returns An Observable of BannerSlide array
   */
  getBannerSlides(countryCode: string, lang: string): Observable<BannerSlide[]> {
    const headers = new HttpHeaders({
      'lang': lang
    });

    const body = {
      country_code: countryCode
    };

    return new Observable<BannerSlide[]>(observer => {
      this.http.post<BannerCarouselResponse>(this.apiUrl, body, { headers }).subscribe({
        next: (response) => {
          if (response.status === 'Success' && response.data) {
            // Transform API response to BannerSlide format
            // response.data is directly the array of slides
            const slides = response.data.map((slider, index) => ({
              id: index + 1, // Generate ID from index since it's not in the response
              image: slider.img, // Use img property from response
              alt: slider.name, // Use name property from response
              title: slider.name, // Use name property from response
              link: '#' // Default link since it's not in the response
            }));
            observer.next(slides);
            observer.complete();
          } else {
            observer.error('Invalid response format');
          }
        },
        error: (error) => {
          console.error('Error fetching banner slides:', error);
          observer.error(error);
        }
      });
    });
  }
}
