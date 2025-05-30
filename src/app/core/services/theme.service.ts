import { Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  // Using Angular Signals for state management
  private themeSignal = signal<ThemeType>('light');
  
  // Expose a readonly signal for components to subscribe to
  public readonly theme = this.themeSignal.asReadonly();
  
  constructor() {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }
  
  /**
   * Set the current theme
   * @param theme The theme to set ('light' or 'dark')
   */
  setTheme(theme: ThemeType): void {
    this.themeSignal.set(theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
