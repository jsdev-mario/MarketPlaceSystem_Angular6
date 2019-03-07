import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOrderitemsComponent } from './checkout-orderitems.component';

describe('CheckoutOrderitemsComponent', () => {
  let component: CheckoutOrderitemsComponent;
  let fixture: ComponentFixture<CheckoutOrderitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutOrderitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutOrderitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
