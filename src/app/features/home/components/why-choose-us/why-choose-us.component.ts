import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NzGridModule,
    NzCardModule,
    NzTypographyModule
  ],
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
  
  // Features data
  features = [
    {
      id: 1,
      title: 'HOME.WHY_CHOOSE_US.BEST_PRICES.TITLE',
      description: 'HOME.WHY_CHOOSE_US.BEST_PRICES.DESCRIPTION',
      icon: 'fa-solid fa-tags'
    },
    {
      id: 2,
      title: 'HOME.WHY_CHOOSE_US.COMPETITIVE_OFFERS.TITLE',
      description: 'HOME.WHY_CHOOSE_US.COMPETITIVE_OFFERS.DESCRIPTION',
      icon: 'fa-solid fa-percent'
    },
    {
      id: 3,
      title: 'HOME.WHY_CHOOSE_US.PREMIUM_SUPPORT.TITLE',
      description: 'HOME.WHY_CHOOSE_US.PREMIUM_SUPPORT.DESCRIPTION',
      icon: 'fa-solid fa-headset'
    },
    {
      id: 4,
      title: 'HOME.WHY_CHOOSE_US.VARIETY_PRODUCTS.TITLE',
      description: 'HOME.WHY_CHOOSE_US.VARIETY_PRODUCTS.DESCRIPTION',
      icon: 'fa-solid fa-box-open'
    }
  ];
}
