import { renderOrderummary } from '../../scripts/checkout/orderSummary.js';
import { cart } from '../../data/cart-class.js';
import { loadproducts } from '../../data/products.js';

describe('test suite : renderOrderummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeAll((done) => {
    loadproducts(() => {
      done();
    });
  });

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    document.querySelector('.js-test-container').innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-checkout-header-shipping-item-quantity"></div>
      <div class="js-return-to-home-link"></div>
        <div class="js-payment-summary"></div>
          <div class="js-checkout-header"></div>
     
    `;

    cart.cartItems = [
      {
        productId: productId1,
        quantity: 2,
        deliveryOptionsId: '1',
      },
      {
        productId: productId2,
        quantity: 1,
        deliveryOptionsId: '2',
      },
    ];

    renderOrderummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the cart', () => {
    // پشکنینی ژمارەی کاڵاکان
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(
      2,
    );

    // پشکنینی ناوەڕۆکی کاڵاکان
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText,
    ).toContain('Quantity: 2');
    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText,
    ).toContain('Quantity: 1');

    // پشکنینی ناوی کاڵاکان
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText,
    ).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText,
    ).toEqual('Intermediate Size Basketball');

    // پشکنینی نرخی کاڵاکان
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText,
    ).toEqual('$10.90');
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText,
    ).toEqual('$20.95');
  });

  it('removs  a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(
      1,
    );

    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`),
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`),
    ).not.toEqual(null);

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);

    // پشکنینی ناوی کاڵاکان
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText,
    ).toEqual('Intermediate Size Basketball');

    // پشکنینی نرخی کاڵاکان
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText,
    ).toEqual('$20.95');
  });

  it('Updating the delivery option', () => {
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();

    const input = document.querySelector(
      `.js-delivery-option-input-${productId1}-3`,
    );
    expect(input.checked).toEqual(true);
    expect(cart.cartItems.length).toEqual(2);

    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].deliveryOptionsId).toEqual('3');

    expect(
      document.querySelector('.js-payment-summary-shipping').innerText,
    ).toEqual('$14.98');

    expect(
      document.querySelector('.js-payment-summary-total').innerText,
    ).toEqual('$63.50');
  });
});
