import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NzLayoutModule,
    NzIconModule,
    NzGridModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  
  // Current year for the footer
  currentYear = new Date().getFullYear();
  
  // Current language
  currentLang = 'en';
  
  private langSubscription!: Subscription;
  
  ngOnInit(): void {
    // Set initial language
    this.currentLang = this.translateService.currentLang;
    
    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }
  
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
  
  // Helper method to check if current language is Arabic
  isArabic(): boolean {
    return this.currentLang === 'ar';
  }
}
