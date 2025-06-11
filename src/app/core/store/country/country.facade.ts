import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { Country } from '../../services/country.service';
import * as CountryActions from './country.actions';
import * as CountrySelectors from './country.selectors';

@Injectable({
  providedIn: 'root',
})
export class CountryFacade {
  private store = inject(Store);

  // Selectors as observables
  countries$: Observable<Country[]> = this.store
    .select(CountrySelectors.selectAllCountries)
    .pipe(
      tap((countries) =>
        console.log('CountryFacade: countries$ emitted', countries?.length || 0)
      )
    );

  selectedCountry$: Observable<Country | null> = this.store
    .select(CountrySelectors.selectSelectedCountry)
    .pipe(
      tap((country) =>
        console.log(
          'CountryFacade: selectedCountry$ emitted',
          country?.country_code || 'null'
        )
      )
    );

  selectedCountryCode$: Observable<string | null> = this.store
    .select(CountrySelectors.selectSelectedCountryCode)
    .pipe(
      tap((code) =>
        console.log(
          'CountryFacade: selectedCountryCode$ emitted',
          code || 'null'
        )
      )
    );

  loading$: Observable<boolean> = this.store.select(
    CountrySelectors.selectCountriesLoading
  );

  error$: Observable<any> = this.store.select(
    CountrySelectors.selectCountriesError
  );

  /**
   * Load all countries
   */
  loadCountries(): void {
    console.log('CountryFacade: loadCountries dispatched');
    this.store.dispatch(CountryActions.loadCountries());
  }

  /**
   * Set the selected country
   * @param country The country to select
   */
  setSelectedCountry(country: Country): void {
    console.log(
      'CountryFacade: setSelectedCountry dispatched',
      country.country_code
    );
    this.store.dispatch(CountryActions.setSelectedCountry({ country }));
  }

  /**
   * Initialize country state from localStorage
   */
  initializeState(): void {
    console.log('CountryFacade: initializeState dispatched');
    this.store.dispatch(CountryActions.initCountryState());
  }
}
