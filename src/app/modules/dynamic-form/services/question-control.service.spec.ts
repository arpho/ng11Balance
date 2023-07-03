import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { QuestionControlService } from './question-control.service';

describe('QuestionControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [QuestionControlService,UntypedFormBuilder] }));

  it('should be created', () => {
    const service: QuestionControlService = TestBed.get(QuestionControlService);
    expect(service).toBeTruthy();
  });
});
