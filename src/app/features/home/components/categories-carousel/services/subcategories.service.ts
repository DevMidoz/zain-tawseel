import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface Subcategory {
  id: number;
  image: string;
  web_name_en: string;
  web_name_ar: string;
  web_desc_ar: string | null;
  web_desc_en: string | null;
  level: number;
  children_Count: number;
}

export interface SubcategoriesResponse {
  status: string;
  data: Subcategory[];
}

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dev.zaintawseel.com/api/v1/gc-subcategories';

  /**
   * Get subcategories for a specific parent category
   * @param parentId The ID of the parent category
   * @param countryCode The country code (e.g., 'KWT', 'SAU', 'UAE')
   * @param lang The language code (e.g., 'en', 'ar')
   * @returns An Observable of Subcategory array
   */
  getSubcategories(parentId: number, countryCode: string, lang: string): Observable<Subcategory[]> {
    const headers = new HttpHeaders({
      'lang': lang
    });

    const body = {
      parent_id: parentId,
      country_code: countryCode
    };

    return new Observable<Subcategory[]>(observer => {
      this.http.post<SubcategoriesResponse>(this.apiUrl, body, { headers }).subscribe({
        next: (response) => {
          if (response.status === 'Success' && response.data) {
            observer.next(response.data);
            observer.complete();
          } else {
            observer.error('Invalid response format');
          }
        },
        error: (error) => {
          console.error(`Error fetching subcategories for parent ID ${parentId}:`, error);
          observer.error(error);
        }
      });
    });
  }
}
