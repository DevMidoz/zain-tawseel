import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';

export interface Product {
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

export interface ProductsResponse {
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
export class ProductsService {
  private http = inject(HttpClient);
  private translateService = inject(TranslateService);
  private apiUrl = `${environment.apiUrl}/gc-products`;

  /**
   * Get products by category ID from the API
   * @param categoryId - The ID of the category to fetch products for
   * @param countryCode - The country code to fetch products for
   * @returns An Observable of Product array
   */
  getProductsByCategory(
    categoryId: string,
    countryCode: string = 'KWT'
  ): Observable<Product[]> {
    const lang = this.translateService.currentLang || 'en';
    const headers = new HttpHeaders({ lang });
    const body = { category_id: categoryId, country_code: countryCode };

    return this.http
      .post<ProductsResponse>(this.apiUrl, body, { headers })
      .pipe(
        map((response) => {
          if (
            response.status === 'Success' &&
            response.data &&
            response.data.length > 0
          ) {
            return response.data.map((productData) =>
              this.transformProductData(productData, lang)
            );
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error fetching products by category:', error);
          return of([]);
        })
      );
  }

  /**
   * Transform API response data to Product format
   * @param productData Raw product data from API
   * @param lang Current language
   * @returns Formatted Product object
   */
  private transformProductData(productData: any, lang: string): Product {
    return {
      id: productData.id,
      title: lang === 'ar' ? productData.web_name_ar : productData.web_name_en,
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
}
