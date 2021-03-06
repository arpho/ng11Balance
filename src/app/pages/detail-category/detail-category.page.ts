// tslint:disable:semicolon
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController, ToastController } from '@ionic/angular';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { QuestionBase } from 'src/app/modules/dynamic-form/models/question-base';
import { TextboxQuestion } from 'src/app/modules/item/models/question-textbox';
import { SelectorQuestion } from 'src/app/modules/dynamic-form/models/question-selector';
import { CategoriesService } from 'src/app/services/categories/categorie.service';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.page.html',
  styleUrls: ['./detail-category.page.scss'],
})
export class DetailCategoryPage implements OnInit {
  category: CategoryModel;
  categoryFields: Array<any>;
  showSpinner = false;

  constructor(
    public service: CategoriesService,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
  }
  filter(ev: {}) {
    // tslint:disable-next-line: no-string-literal
    this.category.title = ev['category']
  }
  async submit(ev: {}) {

    // tslint:disable-next-line: no-string-literal
    this.category.father = ev['father'];
    this.showSpinner = true;
    this.service.updateItem(this.category).finally(() => {
      this.showSpinner = false;
    }).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'categoria modificata',
        duration: 2000,
        position: 'top'
      });
      toast.onDidDismiss().then((result) => {
        this.dismiss();
      });
      toast.present();

    }).catch(async (err) => {
      console.log('error', err);
      const toast = await this.toastCtrl.create({
        message: 'qualcosa è andata male ' + err,
        duration: 2000
      });
      toast.onDidDismiss().then((res) => {
        this.dismiss();
      });
      toast.present();
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(this.category);

  }

  ngOnInit() {
    this.category = this.navParams.get('item');
    this.categoryFields = [new TextboxQuestion({
      key: 'category',
      label: 'categoria',
      value: this.category ? this.category.title : '',
      order: 1
    }),
    new SelectorQuestion({
      key: 'father',
      label: 'categoria origine',
      text: ' categoria origine',
      value: this.category?this.category.father:{},
      service: this.service,
      required: false,
      createPopup:''
    })];
  }

}
