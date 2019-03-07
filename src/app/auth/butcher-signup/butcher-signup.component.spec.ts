import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButcherSignupComponent } from './butcher-signup.component';

describe('ButcherSignupComponent', () => {
  let component: ButcherSignupComponent;
  let fixture: ComponentFixture<ButcherSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButcherSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButcherSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
