import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/user/services/authguard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {path:"user",
  
  loadChildren:()=>import('./modules/user/user.module').then(m=>m.UserModule)
},
{ path: 'categorie', loadChildren:()=>import( './pages/categorie/categorie.module').then(m=>m.CategoriePageModule), canActivate: [AuthGuard] },
{ path: 'pagamenti', loadChildren:()=>import( './pages/pagamenti/payments.module').then(m=>m.PaymentsPageModule), canActivate: [AuthGuard] },
{
  path: 'shopping-karts', loadChildren:()=>import( './pages/shoppingKarts/shopping-karts/shopping-karts.module').then(m=>m.ShoppingKartsPageModule), canActivate: [AuthGuard]
},
{path:'fidelityCards',loadChildren:()=>import('./pages/fidelity-cards/fidelity-cards.module').then(m=>m.FidelityCardsPageModule),canActivate:[AuthGuard]},
{ path: 'fornitori', loadChildren:()=>import( './pages/fornitori/fornitori.module').then(m=>m.FornitoriPageModule), canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
