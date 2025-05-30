import { Component, Input, Output, EventEmitter, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-nz-input-alt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule
  ],
  templateUrl: './nz-input-alt.component.html',
  styleUrls: ['./nz-input-alt.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzInputAltComponent),
      multi: true
    }
  ]
})
export class NzInputAltComponent implements ControlValueAccessor {
  private themeService = inject(ThemeService);
  
  // Use signals for reactive state
  theme = this.themeService.theme;
  
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Input() type: string = 'text';
  @Input() maxLength?: number;
  @Input() mode: 'light' | 'dark' | 'auto' = 'auto';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  
  value: string = '';
  
  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
  
  onBlur(event: Event): void {
    this.onTouched();
    this.blur.emit(event);
  }
  
  onFocus(event: Event): void {
    this.focus.emit(event);
  }
  
  get currentTheme(): 'light' | 'dark' {
    if (this.mode !== 'auto') {
      return this.mode;
    }
    return this.theme() === 'dark' ? 'dark' : 'light';
  }
}
