import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

export interface Breadcrumb {
  label: string;
  url?: string;
  translateKey?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NzBreadCrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbs: Breadcrumb[] = [];

  // Always include Home as the first breadcrumb
  ngOnInit(): void {
    if (
      this.breadcrumbs.length === 0 ||
      this.breadcrumbs[0]?.translateKey !== 'NAV.HOME'
    ) {
      this.breadcrumbs.unshift({
        label: 'Home',
        url: '/',
        translateKey: 'NAV.HOME',
      });
    }
  }
}
