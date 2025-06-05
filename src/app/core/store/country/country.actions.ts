import { createAction, props } from '@ngrx/store';
import { Country } from '../../services/country.service';

export const setSelectedCountry = createAction(
  '[Country] Set Selected Country',
  props<{ country: Country }>()
);

export const loadCountries = createAction('[Country] Load Countries');

export const loadCountriesSuccess = createAction(
  '[Country] Load Countries Success',
  props<{ countries: Country[] }>()
);

export const loadCountriesFailure = createAction(
  '[Country] Load Countries Failure',
  props<{ error: any }>()
);

// Initialization actions
export const initCountryState = createAction(
  '[Country] Initialize Country State'
);

export const loadSavedCountry = createAction(
  '[Country] Load Saved Country',
  props<{ savedCountry: Country | null }>()
);
