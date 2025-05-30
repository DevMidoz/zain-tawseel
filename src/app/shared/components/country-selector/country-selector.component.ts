import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [
    TranslateModule,
    NzDropDownModule,
    NzIconModule,
    NzMenuModule,
    NzButtonModule
  ],
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss']
})
export class CountrySelectorComponent {
  // Selected country
  selectedCountry: string = 'Kuwait';
  
  // Country flags mapping
  countryFlags: { [key: string]: string } = {
    'Kuwait': 'assets/images/kuwait_flag.webp',
    'USA': 'assets/images/usa_flag.webp',
    'Saudi Arabia': 'assets/images/saudi_flag.webp',
    'UAE': 'assets/images/uae_flag.webp'
  };
  
  // Set selected country
  setCountry(country: string): void {
    this.selectedCountry = country;
  }
  
  // Get selected country flag
  getSelectedCountryFlag(): string {
    return this.countryFlags[this.selectedCountry] || this.countryFlags['Kuwait'];
  }
}
