import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private pendingScrollElement: string | null = null;
  private pendingScrollOffset: number = 0;

  constructor(private router: Router) {
    // Listen for navigation end events to handle scrolling after navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Check if we have a pending scroll element after navigation completes
        if (this.pendingScrollElement) {
          setTimeout(() => {
            this.scrollToElement(
              this.pendingScrollElement!,
              this.pendingScrollOffset
            );
            this.pendingScrollElement = null;
            this.pendingScrollOffset = 0;
          }, 300); // Delay to ensure the DOM is ready
        } else {
          // If no specific element to scroll to, scroll to top
          this.scrollToTop();
        }
      });
  }

  /**
   * Scrolls to the top of the page
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Scrolls to an element with the given ID
   * @param elementId The ID of the element to scroll to
   * @param offset Optional offset from the top (default: 0)
   */
  scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Navigate to a route and scroll to an element after navigation
   * @param route The route to navigate to
   * @param elementId The ID of the element to scroll to after navigation
   * @param offset Optional offset from the top (default: 0)
   */
  navigateAndScroll(
    route: string,
    elementId: string,
    offset: number = 0
  ): void {
    // Check if we're already on the target route
    if (this.router.url === route) {
      this.scrollToElement(elementId, offset);
    } else {
      // Set the pending scroll element and navigate
      this.pendingScrollElement = elementId;
      this.pendingScrollOffset = offset;
      this.router.navigateByUrl(route);
    }
  }
}
