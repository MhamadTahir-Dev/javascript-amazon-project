import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { renderOrderummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
// import '../data/cart-class.js';
import '../data/Car.js';
// import '../data/backend-practice.js';
import { loadFromStorage } from '../data/cart.js';
import { loadproducts, loadproductsFetch } from '../data/products.js';
// H
import { loadCart, loadCartFetch } from '../data/cart.js';

async function loadpage() {
  try {
    // throw 'error1';

    // H ,I
    await Promise.all([loadproductsFetch(), loadCartFetch()]);
  } catch {
    console.log('Unexpected error.  please try again later. ');
  }
  renderCheckoutHeader();
  renderOrderummary();
  renderPaymentSummary();
}
loadpage();

// Promise.all([
//   loadproductsFetch(),
//   new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   }),
// ]).then((value) => {
//   console.log(value);
//   renderCheckoutHeader();
//   renderOrderummary();
//   renderPaymentSummary();
// });

// new Promise((resolve) => {
//   loadproducts(() => {
//     resolve('value1');
//   });
// })
//   .then((value) => {
//     console.log(value);
//     return new Promise((resolve) => {
//       loadCart(() => {
//         resolve();
//       });
//     });
//   })
//   .then(() => {
//     renderCheckoutHeader();
//     renderOrderummary();
//     renderPaymentSummary();
//   });

// loadproducts(() => {
//   loadCart(() => {
//     renderCheckoutHeader();
//     renderOrderummary();
//     renderPaymentSummary();
//   });
// });
