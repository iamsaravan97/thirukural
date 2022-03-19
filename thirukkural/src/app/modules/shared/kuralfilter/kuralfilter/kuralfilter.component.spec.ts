import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KuralfilterComponent } from './kuralfilter.component';

describe('KuralfilterComponent', () => {
  let component: KuralfilterComponent;
  let fixture: ComponentFixture<KuralfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KuralfilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KuralfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
