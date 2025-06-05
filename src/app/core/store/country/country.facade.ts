import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Country } from '../../services/country.service';
import * as CountryActions from './country.actions';
import * as CountrySelectors from './country.selectors';

@Injectable({
  providedIn: 'root',
})
export class CountryFacade {
  private store = inject(Store);

  // Selectors as observables
  countries$: Observable<Country[]> = this.store.select(
    CountrySelectors.selectAllCountries
  );
  selectedCountry$: Observable<Country | null> = this.store.select(
    CountrySelectors.selectSelectedCountry
  );
  selectedCountryCode$: Observable<string | null> = this.store.select(
    CountrySelectors.selectSelectedCountryCode
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
    this.store.dispatch(CountryActions.loadCountries());
  }

  /**
   * Set the selected country
   * @param country The country to select
   */
  setSelectedCountry(country: Country): void {
    this.store.dispatch(CountryActions.setSelectedCountry({ country }));
  }

  /**
   * Initialize country state from localStorage
   */
  initializeState(): void {
    this.store.dispatch(CountryActions.initCountryState());
  }
}
