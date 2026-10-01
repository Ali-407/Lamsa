import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { PaymentGatewayPageComponent } from './pages/payment-gateway-page/payment-gateway-page.component';

export const CHECKOUT_ROUTES: Routes = [
  { path: '', component: CheckoutPageComponent },
  { path: 'payment', component: PaymentGatewayPageComponent }
];
