import { ViewContainerRef } from '@angular/core';
import { ItemHostDirective } from './item-host.directive';
import { TestViewContainerRef } from './TestViewContainerRef';

describe('ItemHostDirective', () => {
  it('should create an instance', () => {
    const ref = new TestViewContainerRef()
    const directive = new ItemHostDirective(ref);
    expect(directive).toBeTruthy();
  });
});
