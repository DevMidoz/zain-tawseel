import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryFacade } from '../store/country/country.facade';
import { switchMap, take } from 'rxjs/operators';

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

  // Get the current country code from the store
  return countryFacade.selectedCountryCode$.pipe(
    take(1),
    switchMap((countryCode) => {
      // If we have a country code, add it to the request headers
      if (countryCode) {
        const modifiedRequest = request.clone({
          setHeaders: {
            'country-code': countryCode,
          },
        });
        return next(modifiedRequest);
      }

      // Otherwise, proceed with the original request
      return next(request);
    })
  );
};

/**
 * Check if the request is targeting the API
 * @param url Request URL
 * @returns true if it's an API request
 */
function isApiRequest(url: string): boolean {
  // Add all your API URL patterns here
  const apiPatterns = ['https://dev.zaintawseel.com/api', '/api/v1/'];

  return apiPatterns.some((pattern) => url.includes(pattern));
}
