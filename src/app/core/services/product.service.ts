import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  // Other product properties
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiService = inject(ApiService);

  /**
   * Get all products
   * Country code will be automatically added by the interceptor
   */
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.apiService.get<ApiResponse<Product[]>>('products');
  }

  /**
   * Get product by ID
   * Country code will be automatically added by the interceptor
   */
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.apiService.get<ApiResponse<Product>>(`products/${id}`);
  }

  /**
   * Search products
   * Country code will be automatically added by the interceptor
   */
  searchProducts(query: string): Observable<ApiResponse<Product[]>> {
    return this.apiService.get<ApiResponse<Product[]>>('products/search', {
      query,
    });
  }

  /**
   * Create a new product
   * Country code will be automatically added by the interceptor
   */
  createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.apiService.post<ApiResponse<Product>>('products', product);
  }

  /**
   * Update an existing product
   * Country code will be automatically added by the interceptor
   */
  updateProduct(
    id: string,
    product: Partial<Product>
  ): Observable<ApiResponse<Product>> {
    return this.apiService.put<ApiResponse<Product>>(`products/${id}`, product);
  }

  /**
   * Delete a product
   * Country code will be automatically added by the interceptor
   */
  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`products/${id}`);
  }
}
