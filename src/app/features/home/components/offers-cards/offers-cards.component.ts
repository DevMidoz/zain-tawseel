import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  PLATFORM_ID,
  ElementRef,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
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
import { Subscription, filter } from 'rxjs';

// Import Swiper JS
import { register } from 'swiper/element/bundle';
// Register Swiper custom elements
register();

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { OffersService, Offer } from './services/offers.service';

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
    NzCardAltComponent,
  ],
  templateUrl: './offers-cards.component.html',
  styleUrls: ['./offers-cards.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  private swiperInstance: any = null;
  isLoading = true;
  hasError = false;
  private currentLang = '';

  @ViewChild('swiperEl') swiperEl!: ElementRef;

  // Offers data
  offers: Offer[] = [];

  // Flag to check if we have real offers (not best sellers)
  hasOffers = false;

  // Limited offers for desktop view
  get displayedOffers(): Offer[] {
    // Take the first 6 offers for desktop view
    return this.offers.slice(0, 6);
  }

  addToCart(offer: Offer): void {
    // Placeholder function for the addToCart event
    console.log('Added to cart:', offer);
  }

  /**
   * Buy Now button handler - redirect to App Store
   */
  buyNow(offer: Offer): void {
    window.open(
      'https://apps.apple.com/us/app/zain-tawseel/id1042615361',
      '_blank'
    );
  }

  /**
   * Navigate to product details - redirect to App Store
   */
  viewProductDetails(offer: Offer): void {
    window.open(
      'https://apps.apple.com/us/app/zain-tawseel/id1042615361',
      '_blank'
    );
  }

  /**
   * Load offers from the API using the selected country code
   */
  public loadOffers(): void {
    this.isLoading = true;
    this.hasError = false;

    this.offersSubscription?.unsubscribe();
    this.offersSubscription = this.offersService.getOffers().subscribe({
      next: (data) => {
        // Check if these are actual offers or best sellers
        const areBestSellers =
          data.length > 0 && data.every((offer) => offer.isBestSeller === true);

        // Only set offers if they are actual offers (not best sellers)
        if (!areBestSellers) {
          this.offers = data;
          this.hasOffers = data.length > 0;
        } else {
          // If they are best sellers, clear the offers array
          this.offers = [];
          this.hasOffers = false;
        }

        this.isLoading = false;

        setTimeout(() => {
          this.initSwiper();
        }, 0);
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.isLoading = false;
        this.hasError = true;
        this.hasOffers = false;
      },
    });
  }

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang || 'en';

    this.langSubscription = this.translateService.onLangChange
      .pipe(filter((event) => event.lang !== this.currentLang))
      .subscribe((event) => {
        this.offersService.clearCache();
        this.currentLang = event.lang;
        this.loadOffers();
      });

    this.loadOffers();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initSwiper();
      }, 0);
    }
  }

  /**
   * Initialize Swiper with custom options
   */
  private initSwiper(): void {
    if (!isPlatformBrowser(this.platformId) || !this.swiperEl?.nativeElement) {
      return;
    }

    try {
      const isRtl = this.language() === 'ar';
      const swiperElement = this.swiperEl.nativeElement;

      if (swiperElement.swiper) {
        swiperElement.swiper.destroy();
      }

      swiperElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

      const params = {
        slidesPerView: 'auto',
        spaceBetween: 8,
        pagination: {
          clickable: true,
          dynamicBullets: true,
        },
        navigation: false,
        loop: false,
        rewind: false,
        freeMode: {
          enabled: false,
        },
        resistance: true,
        resistanceRatio: 0.85,
        touchRatio: 1,
        grabCursor: true,
        preventClicks: true,
        touchStartPreventDefault: false,
        centeredSlides: false,
        cssMode: true,
        watchSlidesProgress: true,
        watchOverflow: true,
        slidesOffsetAfter: 16,
        slidesOffsetBefore: 0,
        preventInteractionOnTransition: true,
        touchMoveStopPropagation: true,

        breakpoints: {
          0: {
            slidesPerView: 'auto',
            spaceBetween: 6,
            slidesOffsetAfter: 16,
          },
          480: {
            slidesPerView: 'auto',
            spaceBetween: 8,
            slidesOffsetAfter: 16,
          },
          600: {
            slidesPerView: 'auto',
            spaceBetween: 10,
            slidesOffsetAfter: 16,
          },
        },
      };

      Object.assign(swiperElement, params);
      swiperElement.initialize();
      this.swiperInstance = swiperElement.swiper;
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
    this.offersSubscription?.unsubscribe();

    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  trackByOfferIdAndIndex(index: number, offer: Offer): string {
    return `${offer.id}-${index}`;
  }

  trackByIndex(index: number, item: any): string {
    return `${index}`;
  }

  /**
   * Convert a flag code to a full country code
   * @param flagCode The 2-letter flag code (e.g., 'sa', 'us', 'uk')
   * @returns The full country code (e.g., 'SAU', 'USA', 'GBR')
   */
  getCountryCodeFromFlag(flagCode: string): string {
    if (!flagCode) return '';

    // Convert the 2-letter flag code to the 3-letter country code
    const flagToCountryMap: Record<string, string> = {
      sa: 'SAU', // Saudi Arabia
      kw: 'KWT', // Kuwait
      ae: 'UAE', // United Arab Emirates
      us: 'USA', // United States
      gb: 'GBR', // Great Britain/United Kingdom
    };

    return flagToCountryMap[flagCode.toLowerCase()] || flagCode.toUpperCase();
  }
}
