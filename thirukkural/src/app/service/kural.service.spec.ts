import { TestBed } from '@angular/core/testing';

import { KuralService } from './kural.service';

describe('KuralService', () => {
  let service: KuralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
