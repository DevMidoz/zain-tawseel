import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CarouselModule,
  CarouselComponent,
  OwlOptions,
} from 'ngx-owl-carousel-o';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { HttpClientModule } from '@angular/common/http';
import { Subscription, filter } from 'rxjs';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { CategoriesService, Category } from './services/categories.service';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CarouselModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzSkeletonModule,
    HttpClientModule,
  ],
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss'],
})
export class CategoriesCarouselComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  public translateService = inject(TranslateService);
  private languageService = inject(LanguageService);
  private categoriesService = inject(CategoriesService);

  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;

  @ViewChild('categoriesCarousel') categoriesCarousel!: CarouselComponent;

  private langSubscription!: Subscription;
  private categoriesSubscription!: Subscription;
  isRtl = false;
  isLoading = true;
  hasError = false;
  private currentLang = '';

  // Categories carousel options
  categoriesCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    autoplay: false,
    autoplayTimeout: 5000,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ],
    smartSpeed: 500,
    slideTransition: 'linear',
    responsive: {
      0: {
        items: 4,
      },
      400: {
        items: 4,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
    rtl: false,
  };

  // Categories for carousel
  categories: Category[] = [];

  ngOnInit(): void {
    // Store current language
    this.currentLang = this.translateService.currentLang || 'en';

    // Set initial RTL state
    this.isRtl = this.currentLang === 'ar';
    this.updateCarouselDirection();

    // Load categories on init
    this.loadCategories();

    // Subscribe to language changes - only reload data if language actually changes
    this.langSubscription = this.translateService.onLangChange
      .pipe(filter((event) => event.lang !== this.currentLang))
      .subscribe((event) => {
        this.isRtl = event.lang === 'ar';
        this.updateCarouselDirection();

        // Clear the service cache when language changes
        this.categoriesService.clearCache();
        this.currentLang = event.lang;

        // Reload categories when language changes to ensure correct language is displayed
        this.loadCategories();
      });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  /**
   * Load categories from the API
   */
  public loadCategories(): void {
    this.isLoading = true;
    this.hasError = false;

    // Use the service without parameters - it will get country code from the store
    this.categoriesSubscription?.unsubscribe();
    this.categoriesSubscription = this.categoriesService
      .getCategories()
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.isLoading = false;
          this.hasError = true;
        },
      });
  }

  private updateCarouselDirection(): void {
    this.categoriesCarouselOptions = {
      ...this.categoriesCarouselOptions,
      rtl: this.isRtl,
    };
  }

  // Tracking functions for @for loops
  trackByCategory(index: number, category: Category): string {
    return `${index}-${category.id}`;
  }

  trackByIndex(index: number, item: number): string {
    return index.toString();
  }
}
