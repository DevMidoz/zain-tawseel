import { Component, OnInit, inject, HostListener } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LayoutComponent } from '@shared/layout/layout.component';
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { CountryFacade } from '@core/store/country/country.facade';
import { initCountryState } from '@core/store/country/country.actions';
import { Country } from '@core/services/country.service';
import { take, filter } from 'rxjs/operators';
import { OrientationService } from '@core/services/orientation.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private countryFacade = inject(CountryFacade);
  private orientationService = inject(OrientationService);

  title = 'Zain Tawseel';

  constructor() {
    console.log('AppComponent: constructor');
    // LanguageService already handles setting the HTML lang attribute
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: Event) {
    this.checkOrientation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkOrientation();
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

    // Lock screen orientation to portrait on mobile devices
    if (this.isMobileDevice()) {
      this.orientationService.lockToPortrait();
      this.checkOrientation();
    }

    // Initialize country state - first load from localStorage, then fetch countries
    console.log('AppComponent: Initializing country state');
    this.initializeCountry();
  }

  /**
   * Check and handle device orientation
   */
  private checkOrientation(): void {
    // Only show rotation message for mobile devices in landscape orientation
    if (this.isMobileDevice() && this.isLandscape()) {
      document.body.classList.add('force-portrait');
      const landscapeMessage = document.getElementById('landscape-message');
      if (landscapeMessage) {
        landscapeMessage.style.display = 'flex';
      }
    } else {
      document.body.classList.remove('force-portrait');
      const landscapeMessage = document.getElementById('landscape-message');
      if (landscapeMessage) {
        landscapeMessage.style.display = 'none';
      }
    }
  }

  /**
   * Check if the device is in landscape orientation
   */
  private isLandscape(): boolean {
    return window.innerHeight < window.innerWidth;
  }

  /**
   * Check if the current device is a mobile device
   */
  private isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) && window.innerWidth <= 825
    );
  }

  /**
   * Initialize country selection with proper sequence to avoid race conditions
   */
  private initializeCountry(): void {
    // First initialize from localStorage
    this.countryFacade.initializeState();

    // Then load countries list
    this.countryFacade.loadCountries();

    // Check if we have a country selected after loading from localStorage
    this.countryFacade.selectedCountry$.pipe(take(1)).subscribe((country) => {
      if (!country) {
        // No country in localStorage, set default country
        console.log(
          'AppComponent: No country in localStorage, setting default country (Kuwait)'
        );
        this.setDefaultCountry();
      } else {
        console.log(
          'AppComponent: Country loaded from localStorage:',
          country.country_code
        );
      }
    });
  }

  /**
   * Set Kuwait as the default country
   */
  private setDefaultCountry(): void {
    // Extract the base API URL without the /api/v1 part
    const baseUrl = environment.apiUrl.replace(/\/api\/v1$/, '');

    const defaultCountry: Country = {
      country_code: 'KWT',
      name_en: 'Kuwait',
      name_ar: 'الكويت',
      flag_picture: `${baseUrl}/api/file-path/images/uploads/2024/12/10/1733822427_7184737.jpg`,
    };
    this.countryFacade.setSelectedCountry(defaultCountry);
  }

  // No need for setHtmlLangAttribute as LanguageService already handles this
}
