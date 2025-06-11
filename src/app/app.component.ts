import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '@shared/layout/layout.component';
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { CountryFacade } from '@core/store/country/country.facade';
import { initCountryState } from '@core/store/country/country.actions';
import { Country } from '@core/services/country.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private countryFacade = inject(CountryFacade);

  title = 'Zain Tawseel';

  constructor() {
    console.log('AppComponent: constructor');
    // LanguageService already handles setting the HTML lang attribute
  }

  ngOnInit(): void {
    console.log('AppComponent: ngOnInit');

    // Initialize translation service
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang('en');

    // Apply saved language if available
    const savedLang = localStorage.getItem('language');
    console.log('AppComponent: Saved language from localStorage:', savedLang);
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.languageService.setLanguage(savedLang);
    } else {
      // Default to English
      this.languageService.setLanguage('en');
    }

    // Apply saved theme if available
    const savedTheme = localStorage.getItem('theme');
    console.log('AppComponent: Saved theme from localStorage:', savedTheme);
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.themeService.setTheme(savedTheme);
    } else {
      // Default to light theme
      this.themeService.setTheme('light');
    }

    // Initialize country state from localStorage
    console.log('AppComponent: Initializing country state');
    this.countryFacade.loadCountries();
    this.countryFacade.initializeState();

    // Set a default country if none is selected
    setTimeout(() => {
      this.countryFacade.selectedCountry$.subscribe((country) => {
        if (!country) {
          console.log(
            'AppComponent: No country selected, setting default country (Kuwait)'
          );
          // Set default country (Kuwait)
          const defaultCountry: Country = {
            country_code: 'KWT',
            name_en: 'Kuwait',
            name_ar: 'الكويت',
            flag_picture: '',
          };
          this.countryFacade.setSelectedCountry(defaultCountry);
        }
      });
    }, 500);
  }

  // No need for setHtmlLangAttribute as LanguageService already handles this
}
