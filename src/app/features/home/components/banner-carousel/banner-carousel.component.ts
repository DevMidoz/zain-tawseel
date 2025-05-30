import { Component, ViewChild, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule, CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { BannerCarouselService, BannerSlide } from './services/banner-carousel.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CarouselModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzSkeletonModule,
    HttpClientModule
  ],
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private bannerService = inject(BannerCarouselService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;
  
  @ViewChild('mainCarousel') mainCarousel!: CarouselComponent;
  
  // Main carousel options
  mainCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 800,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false,
    smartSpeed: 600,
    slideTransition: 'ease-out',
    lazyLoad: true,
    rtl: false
  };
  
  // Main carousel slides
  mainSlides: BannerSlide[] = [];
  isLoading = true;
  hasError = false;

  private langSubscription!: Subscription;
  private bannerSubscription!: Subscription;
  isRtl = false;

  ngOnInit(): void {
    // Set initial RTL state based on current language
    this.isRtl = this.language() === 'ar';
    this.updateCarouselDirection();
    
    // Initial load of banner slides
    this.loadBannerSlides();
    
    // Subscribe to language changes using TranslateService
    // Only update RTL direction on language change, not reload slides
    // as the loadBannerSlides method already uses the current language
    this.langSubscription = this.translateService.onLangChange.subscribe((event) => {
      this.isRtl = event.lang === 'ar';
      this.updateCarouselDirection();
      // Don't call loadBannerSlides() here to avoid duplicate API calls
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

  private loadBannerSlides(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Get country code based on selected country (default to Kuwait)
    const countryMap: { [key: string]: string } = {
      'Kuwait': 'KWT',
      'Saudi Arabia': 'SAU',
      'UAE': 'UAE',
      'USA': 'USA'
    };
    
    // TODO: Get the actual selected country from a country service
    const selectedCountry = 'Kuwait';
    const countryCode = countryMap[selectedCountry] || 'KWT';
    
    this.bannerSubscription = this.bannerService.getBannerSlides(countryCode, this.language()).subscribe({
      next: (slides) => {
        this.mainSlides = slides;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banner slides:', error);
        this.isLoading = false;
        this.hasError = true;
        
        // Fallback to default slides in case of error
        this.mainSlides = [
          {
            id: 1,
            image: 'assets/images/pubg_slide.png',
            alt: 'Banner 1',
            title: 'PUBG Mobile',
            link: '/categories/games/pubg'
          },
          {
            id: 2,
            image: 'assets/images/pubg_slide.png',
            alt: 'Banner 2',
            title: 'PlayStation Cards',
            link: '/categories/games/playstation'
          },
          {
            id: 3,
            image: 'assets/images/pubg_slide.png',
            alt: 'Banner 3',
            title: 'Nintendo Games',
            link: '/categories/games/nintendo'
          }
        ];
      }
    });
  }

  private updateCarouselDirection(): void {
    this.mainCarouselOptions = {
      ...this.mainCarouselOptions,
      rtl: this.isRtl
    };
  }
}
