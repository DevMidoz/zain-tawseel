import { Component, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    FormsModule,
    NzSwitchModule,
    NzIconModule
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  // Get current theme from service
  theme = this.themeService.theme;
  
  // Toggle theme
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  // Check if dark theme is active
  isDarkTheme(): boolean {
    return this.theme() === 'dark';
  }
}
