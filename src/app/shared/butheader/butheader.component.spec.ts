import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButheaderComponent } from './butheader.component';

describe('ButheaderComponent', () => {
  let component: ButheaderComponent;
  let fixture: ComponentFixture<ButheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
