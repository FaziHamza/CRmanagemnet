import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePerVINModelComponent } from './promissory-note-per-vinmodel.component';

describe('PromissoryNotePerVINModelComponent', () => {
  let component: PromissoryNotePerVINModelComponent;
  let fixture: ComponentFixture<PromissoryNotePerVINModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromissoryNotePerVINModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromissoryNotePerVINModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
