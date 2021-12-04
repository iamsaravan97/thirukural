import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocTreeFilterComponent } from './poc-tree-filter.component';

describe('PocTreeFilterComponent', () => {
  let component: PocTreeFilterComponent;
  let fixture: ComponentFixture<PocTreeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PocTreeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
