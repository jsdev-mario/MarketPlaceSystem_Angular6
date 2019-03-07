import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButcherComponent } from './butcher.component';

describe('ButcherComponent', () => {
  let component: ButcherComponent;
  let fixture: ComponentFixture<ButcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
