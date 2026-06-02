export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
    },
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
    },
  ];
}

function saveToStorage() {
  // aw cart ay yakam ba arazuy xota chi naweki le daneyt
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 🌟 لێرەدا ناوەکەمان کرد بە ئۆبجێکت {} بۆ ئەوەی کاتی هەموو بەرهەمەکان بە جیا خەزن بکات
const addedMessageTimeouts = {};

export function addToCart(productId) {
  let matchingItms;

  cart.forEach((cartItem) => {
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
    cart.push({
      productId,
      quantity,
    });
  }

  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

  addedMessage.classList.add('added-to-cart-visible');

  // 🌟 لێرەدا پشکنین دەکەین، ئەگەر پێشتر کلیک کرابوو، تایمەرە کۆنەکە دەکوژێنینەوە
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  // 🌟 دروستکردنی تایمەری ٢ چرکەیی نوێ
  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove('added-to-cart-visible');
  }, 2000);

  // 🌟 ئایدی تایمەرە نوێیەکە خەزن دەکەینەوە بۆ ئەم بەرهەمە تایبەتە
  addedMessageTimeouts[productId] = timeoutId;

  saveToStorage();
}

export function removeFromCart(productId) {
  const newcart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newcart.push(cartItem);
    }
  });
  cart = newcart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // ⚠️ زۆر گرنگە: لێرەدا دەبێت بڕەکە بگەڕێنێتەوە (return) بۆ ئەو شوێنەی بانگی دەکات
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}
