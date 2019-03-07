import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustOrderComponent } from './cust-order.component';

describe('CustOrderComponent', () => {
  let component: CustOrderComponent;
  let fixture: ComponentFixture<CustOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
