import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import ar from '@angular/common/locales/ar';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HttpClientModule,
  withInterceptors,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './core/services/translation-loader.factory';
import { HttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import {
  countryReducer,
  countryFeatureKey,
} from './core/store/country/country.reducer';
import { CountryEffects } from './core/store/country/country.effects';
import { countryCodeInterceptor } from './core/interceptors/country-code.interceptor';

// Register locale data
registerLocaleData(en);
registerLocaleData(ar);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideNzI18n(en_US),
    provideHttpClient(
      withInterceptors([countryCodeInterceptor]),
      withInterceptorsFromDi()
    ),
    provideAnimationsAsync(),
    // NgRx setup
    provideStore({
      [countryFeatureKey]: countryReducer,
    }),
    provideEffects([CountryEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    importProvidersFrom(
      FormsModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
