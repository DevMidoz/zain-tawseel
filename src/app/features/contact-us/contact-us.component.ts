import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService } from '@core/services/language.service';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzIconModule,
    NzTypographyModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzDividerModule,
    BreadcrumbComponent,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  // Use signals for reactive state
  theme = this.themeService.theme;
  language = this.languageService.language;

  // Contact information
  contactInfo = {
    email: 'info@zain-tawseel.com',
    phone: '+965 2202 0001',
    whatsapp: '+965 9933 2100',
  };

  // Social media links
  socialMedia = [
    {
      name: 'Facebook',
      icon: 'facebook-f',
      url: 'https://www.facebook.com/people/Zain-tawseel/61565639704205/',
    },
    {
      name: 'X',
      icon: 'x-twitter',
      url: 'https://x.com/zaintawseel',
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/zaintawseel',
    },
  ];

  // Breadcrumbs
  breadcrumbs: Breadcrumb[] = [
    {
      label: 'Home',
      translateKey: 'NAV.HOME',
      url: '/',
    },
    {
      label: 'Contact Us',
      translateKey: 'NAV.CONTACT_US',
    },
  ];

  ngOnInit(): void {
    // Any initialization logic
  }

  /**
   * Open a URL in a new tab
   */
  openLink(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Open email client
   */
  sendEmail(): void {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  /**
   * Open phone dialer
   */
  callPhone(): void {
    window.location.href = `tel:${this.contactInfo.phone.replace(/\s/g, '')}`;
  }

  /**
   * Open WhatsApp
   */
  openWhatsApp(): void {
    const phoneNumber = this.contactInfo.whatsapp.replace(/\s/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  }
}
