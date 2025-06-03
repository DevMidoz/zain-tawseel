import { TestBed } from '@angular/core/testing';

import { MainBannerService } from './main-banner.service';

describe('MainBannerService', () => {
  let service: MainBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
