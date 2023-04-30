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
import { CategoriesSelectorComponent } from './components/categories-selector/categories-selector.component';
import { CategoriesSelectorPage } from './pages/categories-selector/categories-selector.page';
import { CategoryComponent } from './components/category/category.component';
import { CategoriesViewerComponent } from './components/categories-viewer/categories-viewer.component';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';
import { WidgetModule } from './modules/widget/widget.module';
import { DecoratorService } from './modules/offline/services/decorator-service.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PaymentItemComponent } from './components/payment-item/payment-item.component';
import { RoundPipe } from './modules/utilities/pipes/round.pipe';
import {UtilitiesModule} from './modules/utilities/utilities.module'

@NgModule({
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, UtilitiesModule, ItemModule, UserModule, DynamicFormModule, WidgetModule, ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
       DecoratorService,
       RoundPipe,
       {provide:APP_INITIALIZER, useFactory:initFunction, deps:[OfflineManagerService], multi:true}
      ],
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
        CategoriesSelectorComponent,
        CategoriesSelectorPage,
        CategoryComponent,
        PaymentItemComponent,
        CategoriesViewerComponent
    ]
})
export class AppModule {}
export function initFunction(config : OfflineManagerService)
{
  return ()=> config.init();
}
