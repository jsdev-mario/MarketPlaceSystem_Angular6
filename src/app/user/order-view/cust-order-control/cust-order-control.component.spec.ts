import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustOrderControlComponent } from './cust-order-control.component';

describe('CustOrderControlComponent', () => {
  let component: CustOrderControlComponent;
  let fixture: ComponentFixture<CustOrderControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustOrderControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustOrderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
