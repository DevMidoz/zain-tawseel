import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ScrollService } from '@core/services/scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzGridModule,
    NzLayoutModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  // Header height offset for scrolling (adjust based on your header height)
  private readonly HEADER_OFFSET = 80;

  constructor(
    private translateService: TranslateService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {}

  /**
   * Check if the current language is Arabic
   */
  isArabic(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  /**
   * Navigate to a section on the home page
   * @param section The section ID to scroll to
   */
  scrollToSection(section: string): void {
    this.scrollService.navigateAndScroll('/', section, this.HEADER_OFFSET);
  }
}
