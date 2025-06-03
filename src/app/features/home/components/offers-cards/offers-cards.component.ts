import { Component, inject, signal, OnInit, OnDestroy, ViewChild, PLATFORM_ID, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Import Swiper core and required modules
import { register } from 'swiper/element/bundle';
// Register Swiper custom elements
register();

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { OffersService, Offer } from './services/offers.service';
import { trackByIndexAndId, trackByValue } from '@shared/utils/track-by.util';

// Import the NzCardAlt component
import { NzCardAltComponent } from '@shared/components/nz-card-alt/nz-card-alt.component';

@Component({
  selector: 'app-offers-cards',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzBadgeModule,
    NzSkeletonModule,
    NzGridModule,
    HttpClientModule,
    NzCardAltComponent
  ],
  templateUrl: './offers-cards.component.html',
  styleUrls: ['./offers-cards.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OffersCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  private themeService = inject(ThemeService);
  public translateService = inject(TranslateService);
  private languageService = inject(LanguageService);
  private offersService = inject(OffersService);
  private platformId = inject(PLATFORM_ID);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
  
  private langSubscription!: Subscription;
  private offersSubscription!: Subscription;
  isLoading = true;
  hasError = false;
  
  @ViewChild('swiperEl') swiperEl!: ElementRef;
  
  // Swiper configuration
  swiperParams = {
    slidesPerView: 2,
    spaceBetween: 16,
    navigation: true,
    pagination: {
      clickable: true
    },
    loop: false,
    // rewind: false, // Prevent rewinding to the first slide after the last slide
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false
    // },
    // // Prevent swiping beyond the last slide with a natural stop
    // resistance: true,
    // resistanceRatio: 0.85,
    // Ensure proper behavior at the end of slides
    // freeMode: false,
    // Add padding at the end to ensure the last slide is fully visible
    // slidesOffsetAfter: 16,
    // Detect edge swipes and handle them properly
    // edgeSwipeDetection: true,
    // Prevent swiping to infinity
    // watchSlidesProgress: true,
    breakpoints: {
      // All breakpoints use slidesPerView: 'auto' to maintain the card width
      // and let the container determine how many cards fit
      0: {
        slidesPerView: 2,
        spaceBetween: 8
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 12
      },
      // when window width is >= 600px
      600: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      // when window width is >= 900px
      900: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 2,
        spaceBetween: 16
      }
    }
  };
  
  // Offers data
  offers: Offer[] = [];
  
  // Limited offers for desktop view (max 6)
  get displayedOffers(): Offer[] {
    return this.offers.slice(5, 11);
  }
  
  addToCart(offer: Offer): void {
    console.log('Added to cart:', offer);
    // Implement add to cart functionality
  }
  
  buyNow(offer: Offer): void {
    console.log('Buy now:', offer);
    // Implement buy now functionality
  }

  /**
   * Load offers from the API
   * @param lang Current language code
   */
  public loadOffers(lang: string): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Use 'KWT' as default country code - this could be made dynamic in the future
    this.offersSubscription = this.offersService.getOffers('KWT', lang).subscribe({
      next: (data) => {
        console.log('Loaded offer IDs:', JSON.stringify(data.map(o => o.id)));
        this.offers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe(event => {
      this.loadOffers(event.lang);
      this.updateSwiperDirection();
    });
    
    // Initial load of offers
    this.loadOffers(this.translateService.currentLang);
  }
  
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperDirection();
    }
  }
  
  /**
   * Update Swiper direction based on current language
   */
  private updateSwiperDirection(): void {
    if (isPlatformBrowser(this.platformId) && this.swiperEl?.nativeElement) {
      // Update RTL setting based on current language
      const isRtl = this.language() === 'ar';
      const swiperInstance = this.swiperEl.nativeElement;
      
      // Set direction and update swiper
      swiperInstance.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      
      // If swiper is already initialized, update it
      if (swiperInstance.swiper) {
        swiperInstance.swiper.changeLanguageDirection(isRtl ? 'rtl' : 'ltr');
        swiperInstance.swiper.update();
      }
    }
  }
  
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    if (this.offersSubscription) {
      this.offersSubscription.unsubscribe();
    }
  }

  // Tracking functions for the @for loops
  trackByOfferIdAndIndex(index: number, offer: Offer): string {
    return trackByIndexAndId(index, offer);
  }

  trackByIndex(index: number, item: number): string {
    return trackByValue(index, item);
  }
}
