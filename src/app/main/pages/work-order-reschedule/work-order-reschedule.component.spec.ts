import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderRescheduleComponent } from './work-order-reschedule.component';

describe('WorkOrderRescheduleComponent', () => {
  let component: WorkOrderRescheduleComponent;
  let fixture: ComponentFixture<WorkOrderRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderRescheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
