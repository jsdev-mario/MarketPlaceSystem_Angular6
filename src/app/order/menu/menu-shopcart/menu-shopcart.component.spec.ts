import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuShopcartComponent } from './menu-shopcart.component';

describe('MenuShopcartComponent', () => {
  let component: MenuShopcartComponent;
  let fixture: ComponentFixture<MenuShopcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuShopcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuShopcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
