import { TestBed } from '@angular/core/testing';

import { GeoService } from './geo-service';
import { HttpClientModule } from '@angular/common/http';

describe('GeoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientModule] }));

  it('should be created', () => {
    const service: GeoService = TestBed.get(GeoService);
    expect(service).toBeTruthy();
  });
});
