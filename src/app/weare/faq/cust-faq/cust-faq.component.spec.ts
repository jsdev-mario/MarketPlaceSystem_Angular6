import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustFaqComponent } from './cust-faq.component';

describe('CustFaqComponent', () => {
  let component: CustFaqComponent;
  let fixture: ComponentFixture<CustFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
