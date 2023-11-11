import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckGuarantorComponent } from './check-guarantor.component';

describe('CheckGuarantorComponent', () => {
  let component: CheckGuarantorComponent;
  let fixture: ComponentFixture<CheckGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckGuarantorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
