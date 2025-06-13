import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import {
  ProductDetailsService,
  ProductDetails,
} from './services/product-details.service';

import {
  SubcategoriesService,
  Subcategory,
} from '../home/components/categories-carousel/services/subcategories.service';

import { ProductsService, Product } from './services/products.service';
import { CountryFacade } from '../../core/store/country/country.facade';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '@shared/components/breadcrumb/breadcrumb.component';
import { CategoriesService } from '../home/components/categories-carousel/services/categories.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzGridModule,
    NzCardModule,
    NzMessageModule,
    NzSpinModule,
    HttpClientModule,
    BreadcrumbComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private route = inject(ActivatedRoute);
  private productService = inject(ProductDetailsService);
  private subcategoriesService = inject(SubcategoriesService);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private message = inject(NzMessageService);
  private translateService = inject(TranslateService);
  private countryFacade = inject(CountryFacade);

  // Subject for unsubscribing from observables
  private destroy$ = new Subject<void>();

  @ViewChild('classificationsScroll') classificationsScrollRef!: ElementRef;
  @ViewChild('amountsScroll') amountsScrollRef!: ElementRef;

  // Route params
  productId: string = '';
  categoryId: string = '';
  subcategoryId: string = '';

  // Product data
  product: ProductDetails | null = null;
  productImage: string = 'assets/images/placeholder-card.png';

  // Loading state
  isLoading: boolean = true;
  hasError: boolean = false;

  // Subcategories
  subcategories: Subcategory[] = [];
  loadingSubcategories: boolean = false;
  subcategoriesError: boolean = false;

  // Products (Card Amounts)
  products: Product[] = [];
  loadingProducts: boolean = false;
  productsError: boolean = false;

  // Selected options
  selectedCountry: string = 'KWT';
  selectedCurrency: string = 'KWD';
  selectedAmount: number = 10;
  selectedProduct: Product | null = null;
  selectedSubcategory: number | null = null;
  exchangeRate: number = 1;
  isDarkTheme: boolean = false; // Track dark theme state

  // Available amounts
  availableAmounts: Product[] = [];

  // Breadcrumbs
  breadcrumbs: Breadcrumb[] = [];
  categoryName: string = '';
  subcategoryName: string = '';

  get selectedSubcategoryName(): string | null {
    if (!this.selectedSubcategory) return null;
    const sub = this.subcategories.find(
      (s) => s.id === this.selectedSubcategory
    );
    return sub ? `${this.categoryName} ${this.getSubcategoryName(sub)} ` : null;
  }

  ngOnInit(): void {
    // Check if dark theme is active
    this.isDarkTheme = document.body.classList.contains('dark-theme');

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkTheme = document.body.classList.contains('dark-theme');
        }
      });
    });
    observer.observe(document.body, { attributes: true });

    // Subscribe to the selected country from the store
    this.countryFacade.selectedCountryCode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((countryCode) => {
        if (countryCode) {
          this.selectedCountry = countryCode;

          // Reload data if we already have a product ID or category ID
          if (this.productId) {
            this.loadProductDetails();
          } else if (this.selectedSubcategory) {
            this.loadProductsByCategory(this.selectedSubcategory);
          }
        }
      });

    // Get the parameters from the route
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      // Case 1: Direct product ID
      if (params.has('id')) {
        this.productId = params.get('id') || '';
        this.loadProductDetails();
      }
      // Case 2: Category ID and optional subcategory ID
      else if (params.has('categoryId')) {
        this.categoryId = params.get('categoryId') || '';

        // Check if subcategory ID is provided
        if (params.has('subcategoryId')) {
          this.subcategoryId = params.get('subcategoryId') || '';
          this.handleSubcategorySelection();
        } else {
          this.handleCategorySelection();
        }
      } else {
        // Default fallback
        this.productId = '168';
        this.loadProductDetails();
      }
    });
  }

  ngOnDestroy(): void {
    // Complete the subject to unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    // Initialize horizontal scrolling
    this.setupHorizontalScroll();
  }

  buyNow(): void {
    window.open(
      'https://apps.apple.com/us/app/zain-tawseel/id1042615361',
      '_blank'
    );
  }

  /**
   * Handle the case when a category is selected
   */
  handleCategorySelection(): void {
    this.isLoading = true;
    this.hasError = false;

    // Load subcategories for the selected category
    this.loadSubcategories(parseInt(this.categoryId), true);

    // Set up breadcrumbs for category
    this.setupCategoryBreadcrumbs();
  }

  /**
   * Handle the case when a subcategory is selected
   */
  handleSubcategorySelection(): void {
    this.isLoading = true;
    this.hasError = false;

    // Load subcategories for the parent category and mark the selected subcategory
    this.loadSubcategories(parseInt(this.categoryId), false);

    // Set up breadcrumbs for subcategory
    this.setupSubcategoryBreadcrumbs();
  }

  setupHorizontalScroll(): void {
    // Set up scroll behavior if elements are available
    setTimeout(() => {
      if (this.classificationsScrollRef) {
        this.enableDragScroll(this.classificationsScrollRef.nativeElement);
      }

      if (this.amountsScrollRef?.nativeElement) {
        this.enableDragScroll(this.amountsScrollRef.nativeElement);
      }
    }, 500); // Give time for the view to render
  }

  enableDragScroll(element: HTMLElement): void {
    if (!element) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    element.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      element.classList.add('active');
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      e.preventDefault();
    });

    element.addEventListener('mouseleave', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener('mouseup', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      element.scrollLeft = scrollLeft - walk;
    });

    // Add touch support for mobile devices
    element.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDown = true;
          element.classList.add('active');
          startX = e.touches[0].pageX - element.offsetLeft;
          scrollLeft = element.scrollLeft;
        }
      },
      { passive: false }
    );

    element.addEventListener('touchend', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener('touchcancel', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!isDown) return;
        if (e.touches.length === 1) {
          const x = e.touches[0].pageX - element.offsetLeft;
          const walk = (x - startX) * 2;
          element.scrollLeft = scrollLeft - walk;
          e.preventDefault(); // Prevent page scrolling while dragging
        }
      },
      { passive: false }
    );
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    this.productService
      .getProductDetails(this.productId, this.selectedCountry)
      .subscribe({
        next: (productDetails) => {
          if (productDetails) {
            this.product = productDetails;
            this.productImage = productDetails.image;
            this.selectedCurrency = productDetails.currencySymbol;
            // Don't override the country code from the store
            // this.selectedCountry = productDetails.countryCode;

            // Set default amount based on product price
            if (productDetails.price) {
              this.selectedAmount = productDetails.price;
            }

            this.isLoading = false;

            // Set up breadcrumbs for product details
            this.setupProductBreadcrumbs(productDetails);

            // Load subcategories based on the product's category_id
            this.loadSubcategories(productDetails.categoryId, true);
          } else {
            this.handleError();
          }
        },
        error: () => {
          this.handleError();
        },
      });
  }

  loadSubcategories(categoryId: number, selectFirstSubcategory: boolean): void {
    if (!categoryId) {
      this.isLoading = false;
      this.hasError = true;
      return;
    }

    this.loadingSubcategories = true;
    this.subcategoriesError = false;

    const lang = this.translateService.currentLang || 'en';

    // Fetch category name first
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          const category = categories.find((c) => c.id === categoryId);
          if (category) {
            this.categoryName = category.name;
          }

          // Then fetch subcategories
          this.subcategoriesService
            .getSubcategories(categoryId, this.selectedCountry, lang)
            .subscribe({
              next: (subcategories) => {
                this.subcategories = subcategories;
                this.loadingSubcategories = false;

                // Handle subcategory selection
                if (subcategories.length > 0) {
                  if (selectFirstSubcategory) {
                    // Case 1: Select first subcategory
                    this.selectSubcategory(subcategories[0].id);
                  } else if (this.subcategoryId) {
                    // Case 2: Select the specified subcategory
                    this.selectSubcategory(parseInt(this.subcategoryId));
                  } else {
                    // Fallback: Select first subcategory
                    this.selectSubcategory(subcategories[0].id);
                  }
                } else {
                  this.isLoading = false;
                }

                // Setup horizontal scroll after subcategories are loaded
                setTimeout(() => this.setupHorizontalScroll(), 300);
              },
              error: (error) => {
                console.error('Error loading subcategories:', error);
                this.subcategoriesError = true;
                this.loadingSubcategories = false;
                this.isLoading = false;
              },
            });
        },
        error: (error) => {
          console.error('Error fetching category name:', error);
          // Continue with loading subcategories even if category name fetch fails
          this.fetchSubcategoriesOnly(categoryId, selectFirstSubcategory, lang);
        },
      });
  }

  /**
   * Fetch subcategories without category name (fallback)
   */
  private fetchSubcategoriesOnly(
    categoryId: number,
    selectFirstSubcategory: boolean,
    lang: string
  ): void {
    this.subcategoriesService
      .getSubcategories(categoryId, this.selectedCountry, lang)
      .subscribe({
        next: (subcategories) => {
          this.subcategories = subcategories;
          this.loadingSubcategories = false;

          // Handle subcategory selection
          if (subcategories.length > 0) {
            if (selectFirstSubcategory) {
              // Case 1: Select first subcategory
              this.selectSubcategory(subcategories[0].id);
            } else if (this.subcategoryId) {
              // Case 2: Select the specified subcategory
              this.selectSubcategory(parseInt(this.subcategoryId));
            } else {
              // Fallback: Select first subcategory
              this.selectSubcategory(subcategories[0].id);
            }
          } else {
            this.isLoading = false;
          }

          // Setup horizontal scroll after subcategories are loaded
          setTimeout(() => this.setupHorizontalScroll(), 300);
        },
        error: (error) => {
          console.error('Error loading subcategories:', error);
          this.subcategoriesError = true;
          this.loadingSubcategories = false;
          this.isLoading = false;
        },
      });
  }

  loadProductsByCategory(categoryId: number): void {
    if (!categoryId) {
      this.loadingProducts = false;
      this.productsError = true;
      this.isLoading = false;
      return;
    }

    this.loadingProducts = true;
    this.productsError = false;

    this.productsService
      .getProductsByCategory(categoryId.toString(), this.selectedCountry)
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loadingProducts = false;

          // Update available amounts based on product prices
          if (products.length > 0) {
            // Store the full product objects instead of just prices
            this.availableAmounts = products;

            // Set default selected amount and product
            this.selectedProduct = products[0];
            this.selectedAmount = products[0].price;
            this.selectedCurrency = products[0].currencySymbol;
          }

          // Make sure to set isLoading to false
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.productsError = true;
          this.loadingProducts = false;
          this.isLoading = false;
        },
      });
  }

  handleError(): void {
    this.isLoading = false;
    this.hasError = true;
    this.message.error(
      'Failed to load product details. Please try again later.'
    );
  }

  selectCountry(country: string): void {
    if (this.selectedCountry === country) return;

    this.selectedCountry = country;

    // Reload data with new country code
    if (this.productId) {
      this.loadProductDetails();
    } else if (this.selectedSubcategory) {
      this.loadProductsByCategory(this.selectedSubcategory);
    }
  }

  selectAmount(amount: Product): void {
    this.selectedAmount = amount.price;
    this.selectedProduct = amount;
    this.selectedCurrency = amount.currencySymbol;
  }

  selectSubcategory(subcategoryId: number): void {
    if (this.selectedSubcategory === subcategoryId) return;

    this.selectedSubcategory = subcategoryId;

    // Find the selected subcategory to update the product image
    const selectedSubcategory = this.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    if (selectedSubcategory) {
      if (
        selectedSubcategory.image &&
        selectedSubcategory.image.trim() !== ''
      ) {
        this.productImage = selectedSubcategory.image;
      } else {
        this.productImage = 'assets/images/placeholder-card.png';
      }
    }

    // Load products for the selected subcategory
    this.loadProductsByCategory(subcategoryId);
  }

  getSubcategoryName(subcategory: Subcategory): string {
    const lang = this.translateService.currentLang || 'en';
    return lang === 'ar' ? subcategory.web_name_ar : subcategory.web_name_en;
  }

  /**
   * Set up breadcrumbs for product details page
   */
  setupProductBreadcrumbs(productDetails: ProductDetails): void {
    // Reset breadcrumbs
    this.breadcrumbs = [];

    // Add product name
    this.breadcrumbs.push({
      label: productDetails.title,
    });
  }

  /**
   * Set up breadcrumbs for category page
   */
  setupCategoryBreadcrumbs(): void {
    // Reset breadcrumbs
    this.breadcrumbs = [];

    // Fetch category name
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          const category = categories.find(
            (c) => c.id === parseInt(this.categoryId)
          );
          if (category) {
            this.categoryName = category.name;

            // Add category to breadcrumbs
            this.breadcrumbs.push({
              label: this.categoryName,
              url: `/category/${this.categoryId}`,
            });
          }
        },
        error: (error) => {
          console.error('Error fetching category name:', error);
        },
      });
  }

  /**
   * Set up breadcrumbs for subcategory page
   */
  setupSubcategoryBreadcrumbs(): void {
    // Reset breadcrumbs
    this.breadcrumbs = [];

    // Fetch category name
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          const category = categories.find(
            (c) => c.id === parseInt(this.categoryId)
          );
          if (category) {
            this.categoryName = category.name;

            // Add category to breadcrumbs
            this.breadcrumbs.push({
              label: this.categoryName,
              url: `/category/${this.categoryId}`,
            });

            // Fetch subcategory name
            const lang = this.translateService.currentLang || 'en';
            this.subcategoriesService
              .getSubcategories(
                parseInt(this.categoryId),
                this.selectedCountry,
                lang
              )
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (subcategories) => {
                  const subcategory = subcategories.find(
                    (s) => s.id === parseInt(this.subcategoryId)
                  );
                  if (subcategory) {
                    this.subcategoryName =
                      lang === 'ar'
                        ? subcategory.web_name_ar
                        : subcategory.web_name_en;

                    // Add subcategory to breadcrumbs
                    this.breadcrumbs.push({
                      label: `${this.categoryName} ${this.subcategoryName}`,
                      url: `/category/${this.categoryId}/${this.subcategoryId}`,
                    });
                  }
                },
                error: (error) => {
                  console.error('Error fetching subcategory name:', error);
                },
              });
          }
        },
        error: (error) => {
          console.error('Error fetching category name:', error);
        },
      });
  }
}
