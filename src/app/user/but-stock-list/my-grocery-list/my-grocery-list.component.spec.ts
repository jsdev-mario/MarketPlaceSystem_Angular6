import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroceryListComponent } from './my-grocery-list.component';

describe('MyGroceryListComponent', () => {
  let component: MyGroceryListComponent;
  let fixture: ComponentFixture<MyGroceryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGroceryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroceryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
