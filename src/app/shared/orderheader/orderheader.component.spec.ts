import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderheaderComponent } from './orderheader.component';

describe('OrderheaderComponent', () => {
  let component: OrderheaderComponent;
  let fixture: ComponentFixture<OrderheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
