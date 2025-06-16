import {
  Component,
  OnInit,
  inject,
  HostListener,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

// Import Swiper modules
import { register } from 'swiper/element/bundle';
register(); // Register Swiper custom elements

import {
  MainBannerService,
  MainBanner,
  BannerProduct,
} from '../home/components/main-banner/services/main-banner.service';
import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import { NzCardAltComponent } from '@shared/components/nz-card-alt/nz-card-alt.component';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzGridModule,
    NzCardModule,
    NzButtonModule,
    NzTypographyModule,
    NzSkeletonModule,
    NzIconModule,
    NzMessageModule,
    NzCardAltComponent,
    BreadcrumbComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
})
export class ProductInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl?: ElementRef;

  private mainBannerService = inject(MainBannerService);
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private messageService = inject(NzMessageService);

  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;

  // Banner data
  banner: MainBanner | null = null;
  products: BannerProduct[] = [];

  // Breadcrumb
  breadcrumbs: Breadcrumb[] = [];

  // Responsive state
  isMobile = false;

  // Swiper parameters
  swiperParams = {
    slidesPerView: 2.2,
    spaceBetween: 10,
    grabCursor: true,
    breakpoints: {
      480: {
        slidesPerView: 2.5,
      },
    },
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.initSwiper();
  }

  ngOnInit(): void {
    // Check screen size on init
    this.checkScreenSize();

    // Get the current banner from the service
    this.mainBannerService.getCurrentBanner().subscribe({
      next: (banner) => {
        if (banner) {
          this.banner = banner;
          this.products = banner.products_list || [];

          // Setup breadcrumb
          this.setupBreadcrumbs();

          // Initialize swiper after products are loaded
          setTimeout(() => {
            this.initSwiper();
          }, 100);
        } else {
          // No banner data, redirect to home or show message
          this.messageService.error('No banner information available');
        }
      },
    });
  }

  ngAfterViewInit() {
    this.initSwiper();
  }

  /**
   * Initialize swiper with parameters
   */
  initSwiper() {
    if (this.isMobile && this.swiperEl && this.swiperEl.nativeElement) {
      const swiperElement = this.swiperEl.nativeElement;

      // Set parameters
      Object.assign(swiperElement, this.swiperParams);

      // Initialize swiper
      swiperElement.initialize();
    }
  }

  /**
   * Check screen size to determine if mobile view
   */
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  setupBreadcrumbs(): void {
    this.breadcrumbs = [
      {
        label: 'Home',
        translateKey: 'NAV.HOME',
        url: '/',
      },
      {
        label: this.banner?.name || 'Products',
        translateKey: '',
      },
    ];
  }

  /**
   * Get product name based on language
   */
  getProductName(product: BannerProduct): string {
    return this.language() === 'ar' ? product.web_name_ar : product.web_name_en;
  }

  /**
   * Navigate to product details - redirect to App Store
   */
  viewProductDetails(product: BannerProduct): void {
    window.open(
      'https://apps.apple.com/us/app/zain-tawseel/id1042615361',
      '_blank'
    );
  }

  /**
   * Add product to cart
   */
  addToCart(product: BannerProduct): void {
    console.log('Add to cart:', product.id);
    this.messageService.success('Product added to cart');
  }

  /**
   * Buy now functionality - redirect to App Store
   */
  buyNow(product: BannerProduct): void {
    window.open(
      'https://apps.apple.com/us/app/zain-tawseel/id1042615361',
      '_blank'
    );
  }

  /**
   * Track by function for products list
   */
  trackByProductId(index: number, product: BannerProduct): number {
    return product.id;
  }
}
