import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceorderComponent } from './placeorder.component';

describe('PlaceorderComponent', () => {
  let component: PlaceorderComponent;
  let fixture: ComponentFixture<PlaceorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
