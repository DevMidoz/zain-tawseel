import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CrispService {
  private translateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  /**
   * Initialize the Crisp chat service
   */
  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Set initial language
    this.setLanguage(this.translateService.currentLang || 'en');

    // Update language when it changes
    this.translateService.onLangChange.subscribe((event) => {
      this.setLanguage(event.lang);
    });

    // Adjust position for mobile
    this.adjustPositionForMobile();

    // Add a global listener for Crisp events
    this.setupCrispEventListeners();
  }

  /**
   * Set up event listeners for Crisp
   */
  private setupCrispEventListeners(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Wait for Crisp to be fully loaded
    if (window.$crisp) {
      // When the chat is opened
      window.$crisp.push([
        'on',
        'chat:opened',
        () => {
          // Reapply mobile positioning
          if (window.innerWidth <= 768) {
            this.applyMobilePositioning();

            // Add a small delay to ensure styles are applied after the chat is fully opened
            setTimeout(() => {
              this.applyMobilePositioning();
              this.applyDirectStyles();
            }, 100);
          }
        },
      ]);

      // When the chat is closed
      window.$crisp.push([
        'on',
        'chat:closed',
        () => {
          // Reapply mobile positioning
          if (window.innerWidth <= 768) {
            this.applyMobilePositioning();
          }
        },
      ]);

      // When the chat is initialized
      window.$crisp.push([
        'on',
        'session:loaded',
        () => {
          // Apply mobile positioning if on mobile
          if (window.innerWidth <= 768) {
            this.applyMobilePositioning();
            this.applyDirectStyles();
          }
        },
      ]);
    }
  }

  /**
   * Apply mobile positioning CSS
   */
  private applyMobilePositioning(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Create or update the style element
    let style = document.getElementById(
      'crisp-mobile-position'
    ) as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.id = 'crisp-mobile-position';
      document.head.appendChild(style);
    }

    // Update the style content with improved mobile styling
    style.textContent = `
      /* Mobile styles for Crisp chat */
      @media (max-width: 768px) {
        /* Chat button */
        .crisp-client .cc-1m7s {
          bottom: 80px !important;
        }
        
        /* Chat window container */
        .crisp-client .cc-kegp {
          bottom: 80px !important;
          height: calc(100% - 80px) !important;
          max-height: calc(100% - 80px) !important;
          border-radius: 10px 10px 0 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          left: 0 !important;
          right: 0 !important;
          margin: 0 !important;
          transform: none !important;
        }
        
        /* Expanded chat */
        .crisp-client .cc-1brb6 {
          bottom: 80px !important;
        }
        
        /* Chat window in full view */
        .crisp-client .cc-1brb6[data-full-view=true] {
          bottom: 80px !important;
        }
        
        /* Chat window in full view - inner container */
        .crisp-client .cc-1brb6[data-full-view=true] .cc-1yy0g .cc-1m2mf {
          bottom: 80px !important;
        }
        
        /* Chat container */
        .crisp-client .cc-tlyw {
          max-height: calc(100% - 80px) !important;
          bottom: 80px !important;
        }
        
        /* Fix chat header */
        .crisp-client .cc-kegp .cc-1tyx {
          border-radius: 10px 10px 0 0 !important;
        }
        
        /* Fix chat body */
        .crisp-client .cc-kegp .cc-1s3d {
          height: calc(100% - 120px) !important;
        }
        
        /* Fix chat footer */
        .crisp-client .cc-kegp .cc-1oci {
          border-radius: 0 !important;
        }
        
        /* Message input container */
        .crisp-client .cc-kegp .cc-1oci .cc-1iv2 {
          padding: 10px !important;
        }
        
        /* Message input field */
        .crisp-client .cc-kegp .cc-1oci .cc-1iv2 .cc-1a6h {
          border-radius: 20px !important;
        }
        
        /* Fix any animations */
        .crisp-client .cc-kegp, 
        .crisp-client .cc-1brb6, 
        .crisp-client .cc-tlyw {
          transition: none !important;
          animation: none !important;
        }
        
        /* Ensure full height of chat content */
        .crisp-client .cc-kegp .cc-1s3d .cc-1h5w {
          height: 100% !important;
        }
        
        /* Ensure chat content scrolls properly */
        .crisp-client .cc-kegp .cc-1s3d .cc-1h5w .cc-1aye {
          max-height: 100% !important;
          overflow-y: auto !important;
        }
      }
    `;

    // Also apply direct styles to any existing elements
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        this.applyDirectStyles();
      }, 200);
    }
  }

  /**
   * Set the Crisp chat language
   */
  private setLanguage(lang: string): void {
    if (!isPlatformBrowser(this.platformId) || !window.$crisp) {
      return;
    }

    const isArabic = lang === 'ar';
    window.$crisp.push(['set', 'session:data', [[['chat-rtl', isArabic]]]]);
    window.$crisp.push(['do', 'text:show', [isArabic ? 'ar' : 'en']]);
    window.$crisp.push(['set', 'user:language', isArabic ? 'ar' : 'en']);

    // Update position for RTL languages
    this.updateCrispPosition(isArabic);
  }

  /**
   * Open the Crisp chat window
   */
  openChat(): void {
    if (isPlatformBrowser(this.platformId) && window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);

      // Apply mobile styling if on mobile
      if (window.innerWidth <= 768) {
        // Apply styles after a short delay to ensure the chat is open
        setTimeout(() => {
          this.applyMobilePositioning();
          this.applyDirectStyles();
        }, 100);
      }
    }
  }

  /**
   * Apply direct styles to Crisp elements
   */
  private applyDirectStyles(): void {
    if (!isPlatformBrowser(this.platformId) || window.innerWidth > 768) {
      return;
    }

    // Apply styles to chat window
    const chatWindow = document.querySelector('.crisp-client .cc-kegp');
    if (chatWindow instanceof HTMLElement) {
      chatWindow.style.width = '100%';
      chatWindow.style.maxWidth = '100%';
      chatWindow.style.left = '0';
      chatWindow.style.right = '0';
      chatWindow.style.bottom = '80px';
      chatWindow.style.borderRadius = '10px 10px 0 0';
      chatWindow.style.margin = '0';
      chatWindow.style.transform = 'none';
    }

    // Apply styles to chat header
    const chatHeader = document.querySelector(
      '.crisp-client .cc-kegp .cc-1tyx'
    );
    if (chatHeader instanceof HTMLElement) {
      chatHeader.style.borderRadius = '10px 10px 0 0';
    }

    // Apply styles to chat body
    const chatBody = document.querySelector('.crisp-client .cc-kegp .cc-1s3d');
    if (chatBody instanceof HTMLElement) {
      chatBody.style.height = 'calc(100% - 120px)';
    }
  }

  /**
   * Adjust the position of Crisp chat on mobile devices
   */
  private adjustPositionForMobile(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Use Crisp API to set the position
    if (window.$crisp) {
      window.$crisp.push([
        'on',
        'session:loaded',
        () => {
          const isArabic = this.translateService.currentLang === 'ar';
          this.updateCrispPosition(isArabic);
        },
      ]);

      // Also update on window resize
      window.addEventListener('resize', () => {
        const isArabic = this.translateService.currentLang === 'ar';
        this.updateCrispPosition(isArabic);
      });
    }
  }

  /**
   * Update the Crisp position based on screen size and language
   */
  private updateCrispPosition(isRTL: boolean = false): void {
    if (!isPlatformBrowser(this.platformId) || !window.$crisp) {
      return;
    }

    // Set horizontal position based on language
    // if (isRTL) {
    //   window.$crisp.push(['config', 'position:reverse', true]);
    // } else {
    //   window.$crisp.push(['config', 'position:reverse', false]);
    // }

    // Set vertical offset based on screen size
    if (window.innerWidth <= 768) {
      this.applyMobilePositioning();
    } else {
      // Remove the mobile positioning styles
      const existingStyle = document.getElementById('crisp-mobile-position');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }
}
