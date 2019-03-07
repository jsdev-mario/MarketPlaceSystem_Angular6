import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountComponent } from './customer-account.component';

describe('CustomerAccountComponent', () => {
  let component: CustomerAccountComponent;
  let fixture: ComponentFixture<CustomerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
