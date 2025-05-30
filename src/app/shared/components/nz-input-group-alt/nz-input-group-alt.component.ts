import { Component, Input, ContentChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-nz-input-group-alt',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule
  ],
  templateUrl: './nz-input-group-alt.component.html',
  styleUrls: ['./nz-input-group-alt.component.scss']
})
export class NzInputGroupAltComponent {
  private themeService = inject(ThemeService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  
  @Input() prefix?: string | TemplateRef<void>;
  @Input() suffix?: string | TemplateRef<void>;
  @Input() addOnBefore?: string | TemplateRef<void>;
  @Input() addOnAfter?: string | TemplateRef<void>;
  @Input() compact: boolean = false;
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Input() mode: 'light' | 'dark' | 'auto' = 'auto';
  @Input() searchStyle: boolean = false;
  
  get currentTheme(): 'light' | 'dark' {
    if (this.mode !== 'auto') {
      return this.mode;
    }
    return this.theme() === 'dark' ? 'dark' : 'light';
  }
}
