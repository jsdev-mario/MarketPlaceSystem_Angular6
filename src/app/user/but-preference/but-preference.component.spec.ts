import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButPreferenceComponent } from './but-preference.component';

describe('ButPreferenceComponent', () => {
  let component: ButPreferenceComponent;
  let fixture: ComponentFixture<ButPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
