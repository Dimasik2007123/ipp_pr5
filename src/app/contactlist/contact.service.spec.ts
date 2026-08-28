import { TestBed } from '@angular/core/testing';
import { ServiceAPI } from './contact.service';

describe('ServiceAPI', () => {
  let service: ServiceAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
