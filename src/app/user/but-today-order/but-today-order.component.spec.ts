import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButTodayOrderComponent } from './but-today-order.component';

describe('ButDashComponent', () => {
  let component: ButTodayOrderComponent;
  let fixture: ComponentFixture<ButTodayOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButTodayOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButTodayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
