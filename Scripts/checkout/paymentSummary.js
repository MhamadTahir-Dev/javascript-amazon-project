import {  resetCart } from '../../data/cart.js';
import { cart } from '../../data/cart-class.js';
import { getProduct } from '../../data/products.js';
import { getdeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addorder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let productpriceCents = 0;
  let ShippingpriceCents = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productpriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getdeliveryOption(cartItem.deliveryOptionsId);
    ShippingpriceCents += deliveryOption.priceCents;
  });

  const TotalBeforeTaxCents = productpriceCents + ShippingpriceCents;
  const taxCents = TotalBeforeTaxCents * 0.1;
  const TotalCents = TotalBeforeTaxCents + taxCents;

  let cartQuantity = 0;

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const paymentSummaryHTML = `
       <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productpriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money   js-payment-summary-shipping">$${formatCurrency(ShippingpriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money   ">$${formatCurrency(TotalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$
            ${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money  js-payment-summary-total">$${formatCurrency(TotalCents)}</div>
          </div>

          <button class="place-order-button button-primary  js-place-order">
            Place your order
          </button>

    `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document
    .querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const respons = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });

        const order = await respons.json();
        addorder(order);
      } catch (error) {
        console.log('Unexpected error. Try again later.');
      }

      // Extra feature: make the cart empty after creating an order.
      resetCart();
      window.location.href = 'orders.html';
    });
}
