import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CountryService } from '../../services/country.service';
import * as CountryActions from './country.actions';
import { Country } from '../../services/country.service';

@Injectable()
export class CountryEffects {
  private readonly COUNTRY_STORAGE_KEY = 'selected_country';

  // Use inject to properly initialize dependencies
  private actions$ = inject(Actions);
  private countryService = inject(CountryService);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) =>
            CountryActions.loadCountriesSuccess({ countries })
          ),
          catchError((error) =>
            of(CountryActions.loadCountriesFailure({ error }))
          )
        )
      )
    )
  );

  // Save selected country to localStorage when it changes
  saveCountry$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CountryActions.setSelectedCountry),
        tap(({ country }) => {
          try {
            localStorage.setItem(
              this.COUNTRY_STORAGE_KEY,
              JSON.stringify(country)
            );
          } catch (error) {
            console.error('Error saving country to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );

  // Initialize country state from localStorage on app startup
  initCountryState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.initCountryState),
      map(() => {
        try {
          const savedCountryJson = localStorage.getItem(
            this.COUNTRY_STORAGE_KEY
          );
          const savedCountry = savedCountryJson
            ? (JSON.parse(savedCountryJson) as Country)
            : null;
          return CountryActions.loadSavedCountry({ savedCountry });
        } catch (error) {
          console.error('Error loading country from storage:', error);
          return CountryActions.loadSavedCountry({ savedCountry: null });
        }
      })
    )
  );
}
