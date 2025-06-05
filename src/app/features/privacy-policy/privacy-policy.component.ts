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
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NzTypographyModule,
    NzDividerModule,
    BreadcrumbComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  ngOnInit(): void {
    this.breadcrumbs = [
      {
        label: 'Privacy Policy',
        translateKey: 'NAV.PRIVACY_POLICY',
      },
    ];
  }
}
