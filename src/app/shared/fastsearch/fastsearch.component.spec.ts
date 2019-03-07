import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastsearchComponent } from './fastsearch.component';

describe('FastsearchComponent', () => {
  let component: FastsearchComponent;
  let fixture: ComponentFixture<FastsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
