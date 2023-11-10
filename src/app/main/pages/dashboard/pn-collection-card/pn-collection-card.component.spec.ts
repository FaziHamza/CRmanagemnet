import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnCollectionCardComponent } from './pn-collection-card.component';

describe('PnCollectionCardComponent', () => {
  let component: PnCollectionCardComponent;
  let fixture: ComponentFixture<PnCollectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PnCollectionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnCollectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
