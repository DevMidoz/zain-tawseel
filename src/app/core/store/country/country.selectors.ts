import { createFeatureSelector, createSelector } from '@ngrx/store';
import { countryFeatureKey, CountryState } from './country.reducer';

export const selectCountryState =
  createFeatureSelector<CountryState>(countryFeatureKey);

export const selectAllCountries = createSelector(
  selectCountryState,
  (state: CountryState) => state.countries
);

export const selectSelectedCountry = createSelector(
  selectCountryState,
  (state: CountryState) => state.selectedCountry
);

export const selectSelectedCountryCode = createSelector(
  selectSelectedCountry,
  (country) => country?.country_code ?? null
);

export const selectCountriesLoading = createSelector(
  selectCountryState,
  (state: CountryState) => state.loading
);

export const selectCountriesError = createSelector(
  selectCountryState,
  (state: CountryState) => state.error
);
