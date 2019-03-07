import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermconditionComponent } from './termcondition.component';

describe('TermconditionComponent', () => {
  let component: TermconditionComponent;
  let fixture: ComponentFixture<TermconditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermconditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
