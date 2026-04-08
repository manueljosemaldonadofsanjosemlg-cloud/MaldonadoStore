import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListPageComponent
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
