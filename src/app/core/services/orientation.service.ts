import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Define interface for the Screen Orientation API
interface ScreenOrientationAPI extends ScreenOrientation {
  lock(orientation: OrientationLockType): Promise<void>;
}

// Define the orientation lock types
type OrientationLockType = 'portrait' | 'landscape';

@Injectable({
  providedIn: 'root',
})
export class OrientationService {
  /**
   * Observable that emits the current orientation
   */
  public orientation$: Observable<OrientationType> = fromEvent(
    window,
    'orientationchange'
  ).pipe(
    startWith(null),
    map(() => this.getOrientation())
  );

  constructor() {
    this.lockToPortrait();

    // Listen for orientation changes and reapply lock
    window.addEventListener('orientationchange', () => {
      this.lockToPortrait();
    });
  }

  /**
   * Get the current orientation
   */
  private getOrientation(): OrientationType {
    // Check if screen orientation API is available
    if (window.screen && window.screen.orientation) {
      return window.screen.orientation.type;
    } else if (window.orientation !== undefined) {
      // Fallback for older browsers
      const angle = window.orientation as number;
      if (angle === 0 || angle === 180) {
        return 'portrait-primary';
      } else {
        return 'landscape-primary';
      }
    } else {
      // Default to portrait if we can't detect
      return 'portrait-primary';
    }
  }

  /**
   * Get the current orientation as an observable
   */
  getCurrentOrientation(): Observable<OrientationType> {
    return new Observable((observer) => {
      observer.next(this.getOrientation());
      observer.complete();
    });
  }

  /**
   * Lock the screen orientation to portrait
   */
  lockToPortrait(): void {
    // Only attempt to lock on mobile devices
    if (!this.isMobileDevice()) {
      return;
    }

    try {
      // Try to use the Screen Orientation API if available
      if (window.screen && window.screen.orientation) {
        // Cast to our extended interface that includes the lock method
        const screenOrientation = window.screen
          .orientation as unknown as ScreenOrientationAPI;

        if (screenOrientation.lock) {
          screenOrientation.lock('portrait').catch((error: Error) => {
            console.warn('Failed to lock orientation: ', error);
          });
        }
      }
    } catch (error: unknown) {
      console.warn('Screen Orientation API not supported', error);
    }
  }

  /**
   * Check if the device is in landscape orientation
   */
  isLandscape(): boolean {
    // iOS devices often need multiple detection methods
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // For iOS, use multiple detection methods
      return (
        window.innerHeight < window.innerWidth ||
        (window.orientation !== undefined &&
          (window.orientation === 90 || window.orientation === -90))
      );
    }

    // Standard detection for other devices
    return window.innerHeight < window.innerWidth;
  }

  /**
   * Check if the current device is a mobile device
   */
  private isMobileDevice(): boolean {
    // Special handling for iPhone 14 Pro Max and other newer iOS devices
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    return (
      (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
        isIOS) &&
      (window.innerWidth <= 926 || window.innerHeight <= 926) // iPhone 14 Pro Max width is 430 x 932
    );
  }
}

// Type definition for orientation
type OrientationType =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary'
  | string; // Fallback for other values
