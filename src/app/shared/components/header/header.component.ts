import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzInputGroupAltComponent } from '../nz-input-group-alt/nz-input-group-alt.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

// NgZorro Modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

// Import new components
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { CountrySelectorComponent } from '../country-selector/country-selector.component';

// Services
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';

// Cart item interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzInputGroupAltComponent,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputModule,
    NzBadgeModule,
    NzAutocompleteModule,
    NzCollapseModule,
    FormsModule,
    NgFor,
    NgIf,
    RouterLink,
    LanguageSelectorComponent,
    ThemeToggleComponent,
    CountrySelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
  
  // Sample cart items (in a real app, this would come from a service)
  cartItems: CartItem[] = [
    { id: 1, name: 'Apple & iTunes Giftcard (US Store)', price: 500, quantity: 2 },
    { id: 2, name: 'PlayStation Giftcard (UAE Store)', price: 50, quantity: 1 }
  ];
  
  // Search functionality
  searchValue: string = '';
  searchOptions: string[] = [
    'PlayStation Gift Card',
    'Xbox Game Pass',
    'Nintendo Switch Online',
    'Google Play Gift Card',
    'PUBG Mobile UC'
  ];
  
  // Country selection
  selectedCountry: string = 'Kuwait';
  countryFlags: { [key: string]: string } = {
    'Kuwait': 'assets/images/kuwait_flag.webp',
    'USA': 'assets/images/usa_flag.webp',
    'Saudi Arabia': 'assets/images/saudi_flag.webp',
    'UAE': 'assets/images/uae_flag.webp'
  };
  
  // Computed cart total
  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Toggle theme
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  // Toggle language
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
  
  // Set specific language
  setLanguage(lang: 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
  }
  
  // Handle search input
  onSearchInput(): void {
    // In a real app, this would trigger an API call or filter results
    console.log('Search value:', this.searchValue);
  }
  
  // Set selected country
  setCountry(country: string): void {
    this.selectedCountry = country;
  }
  
  // Get selected country flag
  getSelectedCountryFlag(): string {
    return this.countryFlags[this.selectedCountry] || this.countryFlags['Kuwait'];
  }
  
  // Mobile sidebar state
  sidebarVisible: boolean = false;
  
  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    // Prevent body scrolling when sidebar is open
    document.body.style.overflow = this.sidebarVisible ? 'hidden' : '';
  }
  
  // Toggle cart dropdown
  toggleCart(): void {
    // Implementation will depend on how you want to handle the cart display on mobile
    console.log('Toggle cart');
  }
  
  // Check if dark theme is active
  isDarkTheme(): boolean {
    return this.themeService.theme() === 'dark';
  }
}
