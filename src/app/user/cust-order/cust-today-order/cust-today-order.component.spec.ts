import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustTodayOrderComponent } from './cust-today-order.component';

describe('CustTodayOrderComponent', () => {
  let component: CustTodayOrderComponent;
  let fixture: ComponentFixture<CustTodayOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustTodayOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustTodayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
