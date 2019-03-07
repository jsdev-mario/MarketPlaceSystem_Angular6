import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustChangePasswordComponent } from './cust-change-password.component';

describe('CustChangePasswordComponent', () => {
  let component: CustChangePasswordComponent;
  let fixture: ComponentFixture<CustChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
