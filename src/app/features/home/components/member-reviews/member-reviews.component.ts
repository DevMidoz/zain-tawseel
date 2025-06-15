import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CarouselModule,
  CarouselComponent,
  OwlOptions,
} from 'ngx-owl-carousel-o';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Subscription } from 'rxjs';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-member-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CarouselModule,
    NzRateModule,
    NzCardModule,
    NzTypographyModule,
    NzAvatarModule,
  ],
  templateUrl: './member-reviews.component.html',
  styleUrls: ['./member-reviews.component.scss'],
})
export class MemberReviewsComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);

  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;

  @ViewChild('reviewsCarousel') reviewsCarousel!: CarouselComponent;

  private langSubscription!: Subscription;
  isRtl = false;

  // Reviews carousel options
  reviewsCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
    nav: false,
    rtl: false,
  };

  // Reviews data
  reviews = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      date: '2025-05-01',
      rating: 5,
      avatar: 'assets/images/avatars/avatar1.jpg',
      review: 'HOME.MEMBER_REVIEWS.REVIEW1',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      date: '2025-04-15',
      rating: 4,
      avatar: 'assets/images/avatars/avatar2.jpg',
      review: 'HOME.MEMBER_REVIEWS.REVIEW2',
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      date: '2025-04-28',
      rating: 5,
      avatar: 'assets/images/avatars/avatar3.jpg',
      review: 'HOME.MEMBER_REVIEWS.REVIEW3',
    },
    {
      id: 4,
      name: 'Layla Ahmed',
      date: '2025-05-10',
      rating: 4.5,
      avatar: 'assets/images/avatars/avatar4.jpg',
      review: 'HOME.MEMBER_REVIEWS.REVIEW4',
    },
  ];

  ngOnInit(): void {
    // Set initial RTL state
    this.isRtl = this.translateService.currentLang === 'ar';
    this.updateCarouselDirection();

    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe(
      (event: any) => {
        this.isRtl = event.lang === 'ar';
        this.updateCarouselDirection();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private updateCarouselDirection(): void {
    this.reviewsCarouselOptions = {
      ...this.reviewsCarouselOptions,
      rtl: this.isRtl,
    };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(
      this.language() === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    ).format(date);
  }

  // Tracking function for the @for loop
  trackByReview(index: number, review: any): string {
    return `${index}-${review.id}`;
  }
}
