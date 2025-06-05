import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Generic GET request
   * @param endpoint API endpoint path
   * @param params Optional query parameters
   * @param options Additional HTTP options
   * @returns Observable of response
   */
  get<T>(endpoint: string, params?: any, options?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildParams(params);
    const httpOptions = { ...this.buildOptions(options), params: httpParams };

    return this.http.get<T>(url, httpOptions);
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint path
   * @param body Request body
   * @param options Additional HTTP options
   * @returns Observable of response
   */
  post<T>(endpoint: string, body: any = {}, options?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildOptions(options);

    return this.http.post<T>(url, body, httpOptions);
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint path
   * @param body Request body
   * @param options Additional HTTP options
   * @returns Observable of response
   */
  put<T>(endpoint: string, body: any = {}, options?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildOptions(options);

    return this.http.put<T>(url, body, httpOptions);
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint path
   * @param options Additional HTTP options
   * @returns Observable of response
   */
  delete<T>(endpoint: string, options?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildOptions(options);

    return this.http.delete<T>(url, httpOptions);
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substring(1);
    }

    return `${this.baseUrl}/${endpoint}`;
  }

  /**
   * Build HTTP parameters
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return httpParams;
  }

  /**
   * Build HTTP options object
   */
  private buildOptions(options?: any): { headers: HttpHeaders } {
    const defaultOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    if (!options) {
      return defaultOptions;
    }

    // Merge headers if provided
    if (options.headers) {
      const mergedHeaders = new HttpHeaders({
        ...defaultOptions.headers,
        ...options.headers,
      });

      return {
        ...options,
        headers: mergedHeaders,
      };
    }

    // Otherwise just add the default headers
    return {
      ...options,
      headers: defaultOptions.headers,
    };
  }
}
