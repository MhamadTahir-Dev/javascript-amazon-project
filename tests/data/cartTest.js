import {
  addToCart,
  cart,
  loadFromStorage,
  removeFromCart,
  updateDliveryOption,
} from '../../data/cart.js';

describe('test suite : addToCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]);
    });
    loadFromStorage();

    // 🌟 لێرەدا هەم selectorەکە و هەم added-to-cartەکەمان داناوە
    document.querySelector('.js-test-container').innerHTML = `
      <select class="js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
        <option value="1" selected>1</option>
      </select>
      <div class="js-added-to-cart-e43638ce-6aa0-4b85-b27f-e1d07eb678c6"></div>
    `;

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryOptionsId: '1',
        },
      ]),
    );
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('add a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    // 🌟 لێرەش وەک تێستی یەکەم هەردوکیان زیاد دەکەین
    document.querySelector('.js-test-container').innerHTML = `
      <select class="js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
        <option value="1" selected>1</option>
      </select>
      <div class="js-added-to-cart-e43638ce-6aa0-4b85-b27f-e1d07eb678c6"></div>
    `;

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]),
    );
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});

describe('test suite: removeFromCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('removes a product from the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]);
    });
    loadFromStorage();

    removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([]),
    );
  });

  it('does nothing if product is not in the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]);
    });
    loadFromStorage();

    removeFromCart('does-not-exist');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]),
    );
  });
});

describe('test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('updates the delivery option', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]);
    });
    loadFromStorage();

    updateDliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', '3');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionsId).toEqual('3');

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '3',
        },
      ]),
    );
  });

  it(' update the delivery option of a product that is not in the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionsId: '1',
        },
      ]);
    });
    loadFromStorage();

    updateDliveryOption('does-not-exist', '3');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].deliveryOptionsId).toEqual('1');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('does nothing if the delivery option does not exist', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionId: '1',
        },
      ]);
    });
    loadFromStorage();

    updateDliveryOption(
      'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      'does-not-exist',
    );
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});
