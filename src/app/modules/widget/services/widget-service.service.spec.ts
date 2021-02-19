import { TestBed } from '@angular/core/testing';

import { WidgetService } from './widget-service';
import { WidgetSince } from '../models/WidgetSince';
import { WidgetTypes } from '../models/WidgetsTypes';
// import { Storage, IonicStorageModule } from '@ionic/storage';

describe('WidgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    // imports:[IonicStorageModule.forRoot()]
  }));

  it('should be created', () => {
    const service: WidgetService = TestBed.get(WidgetService);
    expect(service).toBeTruthy();
  });
  it('widgetFacrtory works',()=>{
    const service: WidgetService = TestBed.get(WidgetService)
    expect (service.widgetFactory(1).widget).toBe(WidgetTypes.Since)
    expect (service.widgetFactory(0).widget).toBe(WidgetTypes.Regular)
  })
});
