// Optional: when importing a lot of values, you
// can put each value on a separate line to make
// the code easier to read.
import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from '../data/cart.js';
import { products } from '../data/products.js';
import formatCurrency from './utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

hello();

const today = dayjs();
const DeliveryDate = today.add(7, 'days');
console.log(DeliveryDate.format('dddd, MMMM D'));

let cartSummeryHtml = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingproduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingproduct = product;
    }
  });

  const deliveryOptionsId = cartItem.deliveryOptionsId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionsId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const DeliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dataString = DeliveryDate.format('dddd, MMM D');

  cartSummeryHtml += `
  <div class="cart-item-container js-cart-item-container-${matchingproduct.id}">
    <div class="delivery-date">Delivery date: ${dataString}</div>

    <div class="cart-item-details-grid">
      <img
        class="product-image"
        src="${matchingproduct.image}"
      />

      <div class="cart-item-details">
        <div class="product-name">
         ${matchingproduct.name}
        </div>
        <div class="product-price">$${formatCurrency(matchingproduct.priceCents)}</div>
        <div class="product-quantity">

          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingproduct.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary  js-update-link" data-product-id="${matchingproduct.id}">Update</span>

       <input type="text" class="quantity-input js-quantity-input-${matchingproduct.id}"  data-product-id="${matchingproduct.id}">
       
          <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingproduct.id}">Save</span>

          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingproduct.id}">Delete</span>
        </div>
      </div>

      <div class="delivery-options">
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
    const today = dayjs();
    const DeliveryDate = today.add(deliveryOptions.deliveryDays, 'days');
    const dataString = DeliveryDate.format('dddd, MMM D');

    const priceString =
      deliveryOptions.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOptions.priceCents)} -`;

    const ischecked = deliveryOptions.id === cartItem.deliveryOptionsId;

    html += `
        <div class="delivery-option">
        <input
          type="radio"
          ${ischecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingproduct.id}"
        />
        <div>
          <div class="delivery-option-date">${dataString}</div>
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

    const containers = document.querySelector(
      ` .js-cart-item-container-${productId}`,
    );

    containers.remove();

    updateCartQuantity();
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
