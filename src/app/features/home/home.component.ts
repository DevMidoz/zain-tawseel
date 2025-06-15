import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';

// Import component modules
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { CategoriesCarouselComponent } from './components/categories-carousel/categories-carousel.component';
import { OffersCardsComponent } from './components/offers-cards/offers-cards.component';
import { BestSellersCardsComponent } from './components/best-sellers-cards/best-sellers-cards.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { MemberReviewsComponent } from './components/member-reviews/member-reviews.component';
import { MainBannerComponent } from './components/main-banner/main-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    BannerCarouselComponent,
    CategoriesCarouselComponent,
    OffersCardsComponent,
    BestSellersCardsComponent,
    WhyChooseUsComponent,
    MainBannerComponent,
    MemberReviewsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
}
