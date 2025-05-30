import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule, CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

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
    HttpClientModule
  ],
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss']
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
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    smartSpeed: 500,
    slideTransition: 'linear',
    responsive: {
      0: {
        items: 4
      },
      400: {
        items: 4
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: false,
    rtl: false
  };
  
  // Categories for carousel
  categories: Category[] = [];
  
  ngOnInit(): void {
    // Set initial RTL state
    this.isRtl = this.translateService.currentLang === 'ar';
    this.updateCarouselDirection();
    
    // Load categories on init
    this.loadCategories(this.translateService.currentLang);
    
    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe((event: any) => {
      this.isRtl = event.lang === 'ar';
      this.updateCarouselDirection();
      
      // Only reload categories if the language changes
      if (event.lang !== this.translateService.currentLang) {
        this.loadCategories(event.lang);
      }
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
   * @param lang Current language code
   */
  public loadCategories(lang: string): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Use 'KWT' as default country code - this could be made dynamic in the future
    this.categoriesSubscription = this.categoriesService.getCategories('KWT', lang).subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  private updateCarouselDirection(): void {
    this.categoriesCarouselOptions = {
      ...this.categoriesCarouselOptions,
      rtl: this.isRtl
    };
  }
}
