import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NzTypographyModule,
    NzDividerModule,
    BreadcrumbComponent,
  ],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  ngOnInit(): void {
    this.breadcrumbs = [
      {
        label: 'Terms & Conditions',
        translateKey: 'NAV.TERMS_CONDITIONS',
      },
    ];
  }
}
