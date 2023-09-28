import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnDetailsComponent } from './pn-details.component';

describe('PnDetailsComponent', () => {
  let component: PnDetailsComponent;
  let fixture: ComponentFixture<PnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PnDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
