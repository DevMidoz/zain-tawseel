import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import ar from '@angular/common/locales/ar';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
  withJsonpSupport,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './core/services/translation-loader.factory';
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
    provideClientHydration(),
    provideAnimations(),
    { provide: NZ_I18N, useValue: en_US },
    provideHttpClient(
      withInterceptors([countryCodeInterceptor]),
      withInterceptorsFromDi(),
      withFetch(),
      withJsonpSupport()
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
