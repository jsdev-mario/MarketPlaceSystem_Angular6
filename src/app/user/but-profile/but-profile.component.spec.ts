import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButProfileComponent } from './but-profile.component';

describe('ButProfileComponent', () => {
  let component: ButProfileComponent;
  let fixture: ComponentFixture<ButProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
