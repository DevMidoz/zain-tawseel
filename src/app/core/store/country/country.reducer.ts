import { createReducer, on } from '@ngrx/store';
import { Country } from '../../services/country.service';
import * as CountryActions from './country.actions';

export const countryFeatureKey = 'country';

export interface CountryState {
  selectedCountry: Country | null;
  countries: Country[];
  loading: boolean;
  error: any;
}

export const initialState: CountryState = {
  selectedCountry: null,
  countries: [],
  loading: false,
  error: null,
};

export const countryReducer = createReducer(
  initialState,

  on(CountryActions.setSelectedCountry, (state, { country }) => ({
    ...state,
    selectedCountry: country,
  })),

  on(CountryActions.loadCountries, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CountryActions.loadCountriesSuccess, (state, { countries }) => ({
    ...state,
    countries,
    loading: false,
  })),

  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(CountryActions.loadSavedCountry, (state, { savedCountry }) => ({
    ...state,
    selectedCountry: savedCountry,
  }))
);
 