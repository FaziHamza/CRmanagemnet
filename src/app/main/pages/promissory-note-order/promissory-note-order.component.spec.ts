import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteOrderComponent } from './promissory-note-order.component';

describe('PromissoryNoteOrderComponent', () => {
  let component: PromissoryNoteOrderComponent;
  let fixture: ComponentFixture<PromissoryNoteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromissoryNoteOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromissoryNoteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
