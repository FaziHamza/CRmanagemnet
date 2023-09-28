import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEarlySettlementComponent } from './create-early-settlement.component';

describe('CreateEarlySettlementComponent', () => {
  let component: CreateEarlySettlementComponent;
  let fixture: ComponentFixture<CreateEarlySettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEarlySettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEarlySettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
