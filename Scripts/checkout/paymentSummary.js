import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getdeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  let productpriceCents = 0;
  let ShippingpriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productpriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getdeliveryOption(cartItem.deliveryOptionsId);
    ShippingpriceCents += deliveryOption.priceCents;
  });

  const TotalBeforeTaxCents = productpriceCents + ShippingpriceCents;
  const taxCents = TotalBeforeTaxCents * 0.1;
  const TotalCents = TotalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
       <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productpriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(ShippingpriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(TotalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$
            ${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(TotalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>

    `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}
