import { TestBed } from '@angular/core/testing';

import { ShoppingKartsService } from './shopping-karts.service';
import { ShoppingKartModel } from 'src/app/models/shoppingKartModel';
import { PurchaseModel } from 'src/app/models/purchasesModel';
import { CategoryModel } from 'src/app/models/CategoryModel';

describe('ShoppingKartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingKartsService = TestBed.get(ShoppingKartsService);
    expect(service).toBeTruthy();
  });
});
