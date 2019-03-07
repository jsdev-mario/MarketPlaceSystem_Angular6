import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButFaqComponent } from './but-faq.component';

describe('ButFaqComponent', () => {
  let component: ButFaqComponent;
  let fixture: ComponentFixture<ButFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
