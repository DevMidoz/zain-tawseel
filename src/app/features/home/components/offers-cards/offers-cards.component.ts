import { Component, inject, signal, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule, CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

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
    CarouselModule,
    NzCardAltComponent
  ],
  templateUrl: './offers-cards.component.html',
  styleUrls: ['./offers-cards.component.scss']
})
export class OffersCardsComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  public translateService = inject(TranslateService);
  private languageService = inject(LanguageService);
  private offersService = inject(OffersService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
  
  private langSubscription!: Subscription;
  private offersSubscription!: Subscription;
  isLoading = true;
  hasError = false;
  
  @ViewChild('offersCarousel') offersCarousel!: CarouselComponent;
  
  // Offers carousel options with responsive breakpoints
  offersCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 600,
    autoplay: false,
    autoplayTimeout: 5000,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      900: {
        items: 4
      },
      1200: {
        items: 5
      }
    },
    nav: false,
    rtl: this.language() === 'ar'
  };
  
  // Offers data
  offers: Offer[] = [];
  
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
    // Update RTL setting when language changes
    this.offersCarouselOptions = {
      ...this.offersCarouselOptions,
      rtl: this.language() === 'ar'
    };
    
    // Load offers on init
    this.loadOffers(this.translateService.currentLang);
    
    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe((event: any) => {
      // Update carousel direction
      this.offersCarouselOptions = {
        ...this.offersCarouselOptions,
        rtl: event.lang === 'ar'
      };
      
      // Only reload offers if the language changes
      if (event.lang !== this.translateService.currentLang) {
        this.loadOffers(event.lang);
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    if (this.offersSubscription) {
      this.offersSubscription.unsubscribe();
    }
  }
}
