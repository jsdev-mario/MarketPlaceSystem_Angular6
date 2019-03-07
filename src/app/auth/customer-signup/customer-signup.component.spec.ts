import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSignupComponent } from './customer-signup.component';

describe('CustomerSignupComponent', () => {
  let component: CustomerSignupComponent;
  let fixture: ComponentFixture<CustomerSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
