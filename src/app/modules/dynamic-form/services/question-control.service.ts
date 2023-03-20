import { Injectable }   from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../models/question-base';

@Injectable()
export class QuestionControlService {
  constructor(public fb:UntypedFormBuilder) { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new UntypedFormControl(question.value || '', Validators.required)
                                              : new UntypedFormControl(question.value||'');
    });
    return this.fb.group(group);
  }
}
