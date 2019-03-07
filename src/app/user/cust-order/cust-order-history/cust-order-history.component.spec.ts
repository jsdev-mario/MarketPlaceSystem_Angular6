import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustOrderHistoryComponent } from './cust-order-history.component';

describe('CustOrderHistoryComponent', () => {
  let component: CustOrderHistoryComponent;
  let fixture: ComponentFixture<CustOrderHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustOrderHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
