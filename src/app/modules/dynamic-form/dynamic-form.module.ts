import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuestionFormComponent } from './components/question-form-component/question-form-component.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { QuestionControlService } from './services/question-control.service';
import { GeoLocationModule } from '../geo-location/geo-location.module';
import { ItemModule } from '../item/item.module';
import { BarcodeModule } from '../barcode/barcode.module';
import { ListQuestionComponent } from './components/list-question/list-question.component';
import { ItemHostDirective } from './directives/item-host.directive';
import { ItemsHostComponent } from './components/items-host/items-host.component';

@NgModule({
  declarations: [QuestionFormComponent, DynamicFormComponent,ListQuestionComponent, ItemHostDirective,ItemsHostComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    GeoLocationModule,
    ItemModule,
    BarcodeModule
  ],
  exports: [QuestionFormComponent, DynamicFormComponent,ListQuestionComponent,ItemsHostComponent],
  providers: [QuestionControlService]
})
export class DynamicFormModule { }
