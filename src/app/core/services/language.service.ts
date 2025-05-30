import { Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LanguageType = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private document = inject(DOCUMENT);
  
  // Using Angular Signals for state management
  private languageSignal = signal<LanguageType>('en');
  
  // Expose a readonly signal for components to subscribe to
  public readonly language = this.languageSignal.asReadonly();
  
  constructor(private translateService: TranslateService) {
    // Initialize language from localStorage if available
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    } else {
      // Default to English
      this.setLanguage('en');
    }
  }
  
  /**
   * Set the current language
   * @param lang The language to set ('en' or 'ar')
   */
  setLanguage(lang: LanguageType): void {
    this.languageSignal.set(lang);
    localStorage.setItem('language', lang);
    this.translateService.use(lang);
    
    // Set RTL direction for Arabic
    if (lang === 'ar') {
      this.document.documentElement.setAttribute('dir', 'rtl');
      this.document.documentElement.setAttribute('lang', 'ar');
    } else {
      this.document.documentElement.setAttribute('dir', 'ltr');
      this.document.documentElement.setAttribute('lang', 'en');
    }
  }
  
  /**
   * Toggle between English and Arabic languages
   */
  toggleLanguage(): void {
    const newLanguage = this.languageSignal() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }
}
