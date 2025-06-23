import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryFacade } from '../store/country/country.facade';
import { filter, switchMap, take } from 'rxjs/operators';
import { environment } from '@env/environment';

/**
 * Interceptor that automatically adds the country code to API requests
 */
export const countryCodeInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const countryFacade = inject(CountryFacade);

  // Skip interceptor for non-API requests
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  // Skip interceptor for country API requests to avoid circular dependency
  if (isCountryApiRequest(request.url)) {
    return next(request);
  }

  // Wait for a valid country code before proceeding with the request
  return countryFacade.selectedCountryCode$.pipe(
    filter((countryCode) => countryCode !== null && countryCode !== ''),
    take(1),
    switchMap((countryCode) => {
      const modifiedRequest = request.clone({
        setHeaders: {
          'country-code': countryCode as string,
        },
      });
      return next(modifiedRequest);
    })
  );
};

/**
 * Check if the request is targeting the API
 * @param url Request URL
 * @returns true if it's an API request
 */
function isApiRequest(url: string): boolean {
  // Extract base URL from environment
  const baseApiUrl = environment.apiUrl.replace(/\/api\/v1$/, '/api');

  // Add all your API URL patterns here
  const apiPatterns = [baseApiUrl, '/api/v1/'];

  return apiPatterns.some((pattern) => url.includes(pattern));
}

/**
 * Check if the request is for the countries API endpoint
 * @param url Request URL
 * @returns true if it's a countries API request
 */
function isCountryApiRequest(url: string): boolean {
  return url.includes('/gc-countries');
}
