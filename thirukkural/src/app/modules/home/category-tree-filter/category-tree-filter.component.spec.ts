import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeFilterComponent } from './category-tree-filter.component';

describe('CategoryTreeFilterComponent', () => {
  let component: CategoryTreeFilterComponent;
  let fixture: ComponentFixture<CategoryTreeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTreeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
