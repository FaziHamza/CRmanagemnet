import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderRequestComponent } from './work-order-request.component';

describe('WorkOrderRequestComponent', () => {
  let component: WorkOrderRequestComponent;
  let fixture: ComponentFixture<WorkOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
