import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NzTypographyModule,
    NzDividerModule,
    NzGridModule,
    NzIconModule,
    BreadcrumbComponent,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  ngOnInit(): void {
    this.breadcrumbs = [
      {
        label: 'About Us',
        translateKey: 'NAV.ABOUT_US',
      },
    ];
  }
}
