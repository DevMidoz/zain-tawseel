import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-how-to-use',
  standalone: true,
  imports: [CommonModule, NzDividerModule, NzTypographyModule],
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
})
export class HowToUseComponent {
  constructor(private modalRef: NzModalRef) {}

  closeModal(): void {
    this.modalRef.close();
  }
}
