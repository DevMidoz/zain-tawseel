import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Country } from '../../../core/services/country.service';
import { CountryFacade } from '../../../core/store/country/country.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  tap,
  distinctUntilChanged,
  skip,
  filter,
  pairwise,
} from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [
    TranslateModule,
    NzDropDownModule,
    NzIconModule,
    NzMenuModule,
    NzButtonModule,
  ],
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Track countries and selected country from store
  countries: Country[] = [];
  selectedCountry: Country | null = null;

  // Flag to track if this is the initial country selection
  private isInitialSelection = true;

  // Loading state
  loading = false;

  constructor(
    private countryFacade: CountryFacade,
    private translateService: TranslateService
  ) {
    // Subscribe to countries from the store
    this.countryFacade.countries$
      .pipe(
        takeUntilDestroyed(),
        tap((countries) => {
          this.countries = countries;
          // If we have countries but no selected country, set the first one
          if (countries.length > 0 && !this.selectedCountry) {
            // Set the first country without triggering a reload
            this.isInitialSelection = true;
            this.setCountry(countries[0]);
          }
        })
      )
      .subscribe();

    // Subscribe to selected country from the store
    this.countryFacade.selectedCountry$
      .pipe(
        takeUntilDestroyed(),
        distinctUntilChanged(
          (prev, curr) => prev?.country_code === curr?.country_code
        )
      )
      .subscribe((country) => {
        const previousCountry = this.selectedCountry;
        this.selectedCountry = country;

        // If this is not the initial selection and we have a valid country that's different,
        // reload the window
        if (
          !this.isInitialSelection &&
          country &&
          previousCountry &&
          country.country_code !== previousCountry.country_code
        ) {
          this.reloadWindow();
        }

        // After first assignment, any future change is not initial
        this.isInitialSelection = false;
      });

    // Subscribe to loading state
    this.countryFacade.loading$
      .pipe(takeUntilDestroyed())
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  ngOnInit(): void {
    // Load countries on component initialization
    this.countryFacade.loadCountries();
  }

  // Set selected country - updates the global state
  setCountry(country: Country): void {
    // Only update if it's a different country
    if (
      !this.selectedCountry ||
      this.selectedCountry.country_code !== country.country_code
    ) {
      this.countryFacade.setSelectedCountry(country);
    }
  }

  // Get country name based on current language
  getCountryName(country: Country): string {
    return this.translateService.currentLang === 'ar'
      ? country.name_ar
      : country.name_en;
  }

  /**
   * Reload the window to refresh all data with the new country code
   */
  private reloadWindow(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Country changed - reloading window');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }
}
