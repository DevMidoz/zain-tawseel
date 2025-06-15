import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellersCardsComponent } from './best-sellers-cards.component';

describe('BestSellersCardsComponent', () => {
  let component: BestSellersCardsComponent;
  let fixture: ComponentFixture<BestSellersCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellersCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestSellersCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
