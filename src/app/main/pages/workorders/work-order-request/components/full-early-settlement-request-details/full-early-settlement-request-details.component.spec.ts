import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullEarlySettlementRequestDetailsComponent } from './full-early-settlement-request-details.component';

describe('FullEarlySettlementRequestDetailsComponent', () => {
  let component: FullEarlySettlementRequestDetailsComponent;
  let fixture: ComponentFixture<FullEarlySettlementRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullEarlySettlementRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullEarlySettlementRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
