import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSetupComponent } from './cmsetup.component';

describe('CMSetupComponent', () => {
  let component: CMSetupComponent;
  let fixture: ComponentFixture<CMSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CMSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
