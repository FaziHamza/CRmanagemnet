import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlmentTypeComponent } from './settlment-type.component';

describe('SettlmentTypeComponent', () => {
  let component: SettlmentTypeComponent;
  let fixture: ComponentFixture<SettlmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlmentTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
