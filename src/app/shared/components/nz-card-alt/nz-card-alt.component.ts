import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-nz-card-alt',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzButtonModule,
    NzIconModule,
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
  @Input() discount: number = 0;
  @Input() buyNowText: string = 'Buy Now';
  @Input() link: string = '';
  @Input() showAddToCart: boolean = true;

  @Output() addToCartClicked = new EventEmitter<void>();
  @Output() buyNowClicked = new EventEmitter<void>();

  // Default placeholder image to use when the original image fails to load
  private readonly placeholderImage: string =
    'assets/images/placeholder-card.png';

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
