import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePerAddressChartComponent } from './promissory-note-per-address-chart.component';

describe('PromissoryNotePerAddressChartComponent', () => {
  let component: PromissoryNotePerAddressChartComponent;
  let fixture: ComponentFixture<PromissoryNotePerAddressChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromissoryNotePerAddressChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromissoryNotePerAddressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
