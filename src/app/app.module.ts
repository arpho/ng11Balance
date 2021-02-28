import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {ItemModule} from './modules/item/item.module'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './modules/user/user.module';
import { CreateWidgetPage } from './modules/widget/pages/create-widget/create-widget.page';
import { EditWidgetPage } from './modules/widget/pages/edit-widget/edit-widget.page';
import { SelectorItemsPage } from './modules/item/pages/selector-items/selector-items.page';
import { CreateSupplierPage } from './pages/create-supplier/create-supplier.page';
import { CreateShoppingKartPage } from './pages/create-shopping-kart/create-shopping-kart.page';
import { ViewSupplierPage } from './pages/view-supplier/view-supplier.page';
import { FilterPopupPage } from './modules/item/pages/filter-popup/filter-popup.page';
import { CreatePurchasePage } from './pages/create-purchase/create-purchase.page';
import { DetailPurchasePage } from './pages/detail-purchase/detail-purchase.page';
import { DetailCategoryPage } from './pages/detail-category/detail-category.page';
import { EditUserPage } from './modules/user/pages/edit-user/edit-user.page';
import { DetailPaymentPage } from './pages/detail-payment/detail-payment.page';
import { UpdateFidelityCardPage } from './pages/update-fidelity-card/update-fidelity-card.page';
import { CreateFidelityCardPage } from './pages/create-fidelity-card/create-fidelity-card.page';
import { DetailShoppingKartPage } from './pages/detail-shopping-kart/detail-shopping-kart.page';
import { ScannerPopupPage } from './modules/barcode/pages/scanner-popup/scanner-popup.page';
import { CreatePaymentPage } from './pages/create-payment/create-payment.page';
import { TotalComponent } from './components/total/total.component';
import { CategoriesSelectorComponent } from './components/categories-selector/categories-selector.component';
import { CategoriesSelectorPage } from './pages/categories-selector/categories-selector.page';
import { CategoryComponent } from './components/category/category.component';
import { CategoriesViewerComponent } from './components/categories-viewer/categories-viewer.component';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';

@NgModule({
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ItemModule,UserModule,DynamicFormModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent,
    ],
    declarations: [
      AppComponent,
       CreateWidgetPage,
       EditWidgetPage,
       SelectorItemsPage,
      CreateSupplierPage,
      CreateShoppingKartPage,
      ViewSupplierPage,
      FilterPopupPage,
      SelectorItemsPage,
      CreatePurchasePage,
      DetailPurchasePage,
      DetailCategoryPage,
      EditUserPage,
      DetailPaymentPage,
      UpdateFidelityCardPage,
      CreateFidelityCardPage,
      DetailShoppingKartPage,
      ScannerPopupPage,
      CreatePaymentPage,
      TotalComponent,
      CategoriesSelectorComponent,
      CategoriesSelectorPage,
      CategoryComponent,
      CategoriesViewerComponent],
})
export class AppModule {}
