import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTransferComponent } from './work-order-transfer.component';

describe('WorkOrderTransferComponent', () => {
  let component: WorkOrderTransferComponent;
  let fixture: ComponentFixture<WorkOrderTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
