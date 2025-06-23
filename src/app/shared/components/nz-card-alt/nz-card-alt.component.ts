import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-nz-card-alt',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzButtonModule,
    NzCardModule,
  ],
  templateUrl: './nz-card-alt.component.html',
  styleUrls: ['./nz-card-alt.component.scss'],
})
export class NzCardAltComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() price: number = 0;
  @Input() originalPrice: number = 0;
  @Input() currency: string = '';
  @Input() countryCode: string = '';
  @Input() discount: number = 0;
  @Input() buyNowText: string = 'Buy Now';
  @Input() link: string = '';
  @Input() showAddToCart: boolean = true;

  @Output() addToCartClicked = new EventEmitter<void>();
  @Output() buyNowClicked = new EventEmitter<void>();
  @Output() cardClicked = new EventEmitter<void>();

  // Path to Riyal SVG icon
  private readonly riyalIconPath: string = 'assets/svgs/Riyal.svg';

  // Default placeholder image to use when the original image fails to load
  private readonly placeholderImage: string =
    'assets/svgs/ZT Updated 4K-02.svg';

  /**
   * Check if we should show the currency as an SVG icon (only for Saudi Arabia)
   */
  shouldShowCurrencyIcon(): boolean {
    return this.countryCode === 'SAU';
  }

  /**
   * Get the currency icon for Saudi Arabia
   */
  getCurrencyIcon(): string {
    return this.riyalIconPath;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    // Only emit if the click is directly on the card or its container,
    // not on the buttons (which have their own click handlers)
    const target = event.target as HTMLElement;
    const isButton = target.closest('button') !== null;

    if (!isButton) {
      this.cardClicked.emit();
    }
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartClicked.emit();
  }

  onBuyNow(event: Event): void {
    if (!this.link) {
      event.preventDefault();
      event.stopPropagation();
      this.buyNowClicked.emit();
    }
  }

  /**
   * Handle image loading errors by replacing with a placeholder image
   */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement.src !== this.placeholderImage) {
      imgElement.src = this.placeholderImage;
    }
  }
}
