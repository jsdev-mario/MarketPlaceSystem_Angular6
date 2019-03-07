import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInfodetailsComponent } from './delivery-infodetails.component';

describe('DeliveryInfodetailsComponent', () => {
  let component: DeliveryInfodetailsComponent;
  let fixture: ComponentFixture<DeliveryInfodetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryInfodetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryInfodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
