import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButStockListComponent } from './but-stock-list.component';

describe('ButStockListComponent', () => {
  let component: ButStockListComponent;
  let fixture: ComponentFixture<ButStockListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButStockListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
