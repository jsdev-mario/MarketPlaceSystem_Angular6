import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButChangePasswordComponent } from './but-change-password.component';

describe('CustChangePasswordComponent', () => {
  let component: ButChangePasswordComponent;
  let fixture: ComponentFixture<ButChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
