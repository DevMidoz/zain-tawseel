import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';

export interface ProductDetails {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  currency: string;
  currencySymbol: string;
  countryName: string;
  countryCode: string;
  discount: number;
  isBestSeller: boolean;
  categoryId: number;
}

export interface ProductDetailsResponse {
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
export class ProductDetailsService {
  private http = inject(HttpClient);
  private translateService = inject(TranslateService);
  private apiUrl = `${environment.apiUrl}/gc-product`;

  /**
   * Get product details from the API
   * @param productId - The ID of the product to fetch
   * @param countryCode - The country code to fetch product details for
   * @returns An Observable of ProductDetails
   */
  getProductDetails(
    productId: string,
    countryCode: string = 'KWT'
  ): Observable<ProductDetails | null> {
    // Get current language
    const lang = this.translateService.currentLang || 'en';

    const headers = new HttpHeaders({
      lang: lang,
    });

    const body = {
      product_id: productId,
      country_code: countryCode,
    };

    return this.http
      .post<ProductDetailsResponse>(this.apiUrl, body, { headers })
      .pipe(
        map((response) => {
          if (
            response.status === 'Success' &&
            response.data &&
            response.data.length > 0
          ) {
            const productData = response.data[0];

            // Transform API response to ProductDetails format
            return {
              id: productData.id,
              title:
                lang === 'ar'
                  ? productData.web_name_ar
                  : productData.web_name_en,
              image: productData.image,
              price: productData.product_price,
              originalPrice:
                productData.product_price_before || productData.product_price,
              currency: productData.currencyname,
              currencySymbol: productData.symbol,
              countryName: productData.countryname,
              countryCode: productData.country_code,
              discount: productData.offer,
              isBestSeller: productData.best_seller === 1,
              categoryId: productData.category_id,
            };
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error fetching product details:', error);
          return of(null);
        })
      );
  }
}
