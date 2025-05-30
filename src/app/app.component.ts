import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '@shared/layout/layout.component';
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  
  title = 'Zain Tawseel';
  
  constructor() {
    // LanguageService already handles setting the HTML lang attribute
  }
  
  ngOnInit(): void {
    // Initialize translation service
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang('en');
    
    // Apply saved language if available
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.languageService.setLanguage(savedLang);
    } else {
      // Default to English
      this.languageService.setLanguage('en');
    }
    
    // Apply saved theme if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.themeService.setTheme(savedTheme);
    } else {
      // Default to light theme
      this.themeService.setTheme('light');
    }
  }
  
  // No need for setHtmlLangAttribute as LanguageService already handles this
}
