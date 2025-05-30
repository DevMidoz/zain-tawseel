import { Component, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    TranslateModule,
    NzDropDownModule,
    NzIconModule,
    NzMenuModule,
    NzButtonModule
  ],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  private languageService = inject(LanguageService);
  
  // Get current language from service
  language = this.languageService.language;
  
  // Set specific language
  setLanguage(lang: 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
    window.location.reload();
  }
}
