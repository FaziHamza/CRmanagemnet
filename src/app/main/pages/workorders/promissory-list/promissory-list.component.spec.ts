import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryListComponent } from './promissory-list.component';

describe('PromissoryListComponent', () => {
  let component: PromissoryListComponent;
  let fixture: ComponentFixture<PromissoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromissoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromissoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
