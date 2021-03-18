import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ɵConsole,
  OnChanges,
  SimpleChanges,
  forwardRef
} from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { QuestionBase } from '../../models/question-base';

@Component({
  selector: 'app-question',
  templateUrl: './question-form-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class QuestionFormComponent implements OnInit, OnChanges,ControlValueAccessor {

  private onChange = () => { };
  private onTouch = () => { };

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
   this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch= fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
  public value: any;
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  ngOnInit() {
    this.value = this.question ? this.question.value : undefined;
    this.form = this.form
      ? this.form
      : new FormGroup({
        // I need an instance of formgroup for run the tests
        name: new FormControl(this.question.key),
        value: new FormControl(this.question.value)
      });
  }

  ngOnChanges(changes: SimpleChanges) {
  }
  get isValid() {
    return this.question ? this.form.controls[this.question.key].valid : false;
  }
  get getValue() {
    return this.question.key ? this.form.get(this.question.key).value : '';
  }

  getIcon() {
    return this.form.get(this.question.key).value ? String(this.question.iconTrue) : String(this.question.iconFalse)
  }
}
