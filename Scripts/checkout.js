import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { renderOrderummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
// import '../data/cart-class.js';
import '../data/Car.js';
// import '../data/backend-practice.js';
import { loadFromStorage } from '../data/cart.js';
import { loadproducts } from '../data/products.js';

loadproducts(() => {
  renderCheckoutHeader();
  renderOrderummary();
  renderPaymentSummary();
});
