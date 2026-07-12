// Optional: when importing a lot of values, you
// can put each value on a separate line to make
// the code easier to read.
import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDliveryOption,
} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import formatCurrency from '../utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {
  deliveryOptions,
  getdeliveryOption,
  calculateDeliveryDate,
} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderummary() {
  let cartSummeryHtml = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingproduct = getProduct(productId);

    const deliveryOptionsId = cartItem.deliveryOptionsId;

    const deliveryOption = getdeliveryOption(deliveryOptionsId);

    // bogranaway kat subtract(1, 'month'); bakardet
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummeryHtml += `
            <div class="cart-item-container
            js-cart-item-container
            js-cart-item-container-${matchingproduct.id}">
              <div class="delivery-date">Delivery date: ${dateString}</div>

              <div class="cart-item-details-grid">
                <img
                  class="product-image"
                  src="${matchingproduct.image}"
                />

                <div class="cart-item-details">
                  <div class="product-name js-product-name-${matchingproduct.id}">
                  ${matchingproduct.name}
                  </div>
                  <div class="product-price  js-product-price-${matchingproduct.id}">$${formatCurrency(matchingproduct.priceCents)}</div>
                  <div class="product-quantity  js-product-quantity-${matchingproduct.id}">

                    <span>
                      Quantity: <span class="quantity-label js-quantity-label-${matchingproduct.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary  js-update-link" data-product-id="${matchingproduct.id}">Update</span>

                    <input type="text" class="quantity-input js-quantity-input-${matchingproduct.id}"  data-product-id="${matchingproduct.id}">
                    
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingproduct.id}">Save</span>

                    <span class="delete-quantity-link link-primary js-delete-link  js-delete-link-${matchingproduct.id}" data-product-id="${matchingproduct.id}">Delete</span>
                  </div>
                </div>

                <div class="delivery-options ">
                  <div class="delivery-options-title">Choose a delivery option:</div>
                    ${deliveryOptionsHTML(matchingproduct, cartItem)}
                </div>
              </div>
            </div>
            `;
  });

  function deliveryOptionsHTML(matchingproduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOptions) => {
      const dateString = calculateDeliveryDate(deliveryOptions);

      const priceString =
        deliveryOptions.priceCents === 0
          ? 'FREE'
          : `$${formatCurrency(deliveryOptions.priceCents)} -`;

      const ischecked = deliveryOptions.id === cartItem.deliveryOptionsId;

      html += `
                  <div class="delivery-option  js-delivery-option  js-delivery-option-${matchingproduct.id}-${deliveryOptions.id}"  data-product-id="${matchingproduct.id}" data-delivery-Options-id="${deliveryOptions.id}">
                  <input
                    type="radio"
                    ${ischecked ? 'checked' : ''}
                    class="delivery-option-input js-delivery-option-input-${cartItem.productId}-${deliveryOptions.id}"
                    name="delivery-option-${matchingproduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                  </div>
                </div >`;
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummeryHtml;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      renderCheckoutHeader();
      renderOrderummary();
      renderPaymentSummary();
    });
  });

  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-return-to-home-link').innerHTML =
      `${cartQuantity} items`;
  }

  updateCartQuantity();

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.classList.add('is-editing-quantity');
    });
  });

  function saveQuantity(productId) {
    // Here's an example of a feature we can add: validation.
    // Note: we need to move the quantity-related code up
    // because if the new quantity is not valid, we should
    // return early and NOT run the rest of the code. This
    // technique is called an "early return".
    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`,
    );

    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }

    updateQuantity(productId, newQuantity);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.classList.remove('is-editing-quantity');

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`,
    );

    quantityLabel.innerHTML = newQuantity;

    updateCartQuantity();
  }

  document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      saveQuantity(productId);
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const productId = input.dataset.productId;
        saveQuantity(productId);
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionsId } = element.dataset;
      updateDliveryOption(productId, deliveryOptionsId);
      renderCheckoutHeader();
      renderOrderummary();
      renderPaymentSummary();
      // We can delete the code below (from the original solution)
      // because instead of using the DOM to update the page directly
      // we can use MVC and re-render everything. This will make sure
      // the page always matches the data.

      // const quantityLabel = document.querySelector(
      //   `.js-quantity-label-${productId}`
      // );
      // quantityLabel.innerHTML = newQuantity;

      // updateCartQuantity();
    });
  });
}
