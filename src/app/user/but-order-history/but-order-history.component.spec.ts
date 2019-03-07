import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButOrderHistoryComponent } from './but-order-history.component';

describe('ButOrderHistoryComponent', () => {
  let component: ButOrderHistoryComponent;
  let fixture: ComponentFixture<ButOrderHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButOrderHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
