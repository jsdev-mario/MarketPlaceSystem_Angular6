import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButOrderControlComponent } from './but-order-control.component';

describe('ButOrderControlComponent', () => {
  let component: ButOrderControlComponent;
  let fixture: ComponentFixture<ButOrderControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButOrderControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButOrderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
