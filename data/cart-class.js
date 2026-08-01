import { validDeliveryOption } from './deliveryOptions.js';

class Cart {
  cartItems; // Shurcat = undefined;
  #localStoragekey; //  Shurcat = undefined;
  addedMessageTimeouts = {};

  constructor(localStoragekey) {
    this.#localStoragekey = localStoragekey;
    this.addedMessageTimeouts = {};
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStoragekey));

    if (!this.cartItems) {
      this.cartItems = [
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryOptionsId: '1',
        },
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionsId: '2',
        },
      ];
    }
  }
  saveToStorage() {
    // aw cart ay yakam ba arazuy xota chi naweki le daneyt
    localStorage.setItem(this.#localStoragekey, JSON.stringify(this.cartItems));
  }

  // 🌟 لێرەدا ناوەکەمان کرد بە ئۆبجێکت {} بۆ ئەوەی کاتی هەموو بەرهەمەکان بە جیا خەزن بکات
  addedMessageTimeouts = {};

  addToCart(productId) {
    let matchingItms;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItms = cartItem;
      }
    });

    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`,
    );

    const quantity = Number(quantitySelector.value);

    if (matchingItms) {
      // matchingItms.quantity += 1;
      // matchingItms.quantity++;
      matchingItms.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionsId: '1',
      });
    }

    const addedMessage = document.querySelector(
      `.js-added-to-cart-${productId}`,
    );

    addedMessage.classList.add('added-to-cart-visible');

    // 🌟 لێرەدا پشکنین دەکەین، ئەگەر پێشتر کلیک کرابوو، تایمەرە کۆنەکە دەکوژێنینەوە
    const previousTimeoutId = this.addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    // 🌟 دروستکردنی تایمەری ٢ چرکەیی نوێ
    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);

    // 🌟 ئایدی تایمەرە نوێیەکە خەزن دەکەینەوە بۆ ئەم بەرهەمە تایبەتە
    this.addedMessageTimeouts[productId] = timeoutId;

    this.saveToStorage();
  }
  removeFromCart(productId) {
    const newcart = [];
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newcart.push(cartItem);
      }
    });
    this.cartItems = newcart;

    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    // ⚠️ زۆر گرنگە: لێرەدا دەبێت بڕەکە بگەڕێنێتەوە (return) بۆ ئەو شوێنەی بانگی دەکات
    return cartQuantity;
  }
  updateQuantity(productId, newQuantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.quantity = newQuantity;

    this.saveToStorage();
  }
  updateDliveryOption(productId, deliveryOptionsId) {
    let matchingItms;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItms = cartItem;
      }
    });

    // ✨ ئەگەر کاڵاکە نەدۆزرایەوە، ڕاستەوخۆ فەنکشنەکە ڕابگرە و مەچۆ خوارەوە

    if (!matchingItms) {
      return;
    }

    // ✨ پاراستنی دووەم (ئەم خاڵە): ئەگەر ئایدی ناردنەکە بوونی نەبوو و هەڵە بوو

    if (!validDeliveryOption(deliveryOptionsId)) {
      return;
    }

    matchingItms.deliveryOptionsId = deliveryOptionsId;
    this.saveToStorage();
  }
}

export const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
