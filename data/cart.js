export let cart = [
  {
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    Quantity: 2,
  },
  {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    Quantity: 1,
  },
];

export function addToCart(productId) {
  let matchingItms;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItms = cartItem;
    }
  });

  if (matchingItms) {
    // matchingItms.Quantity += 1;
    matchingItms.Quantity++;
  } else {
    cart.push({
      productId: productId,
      Quantity: 1,
    });
  }
}
export function removeFromcart(productId) {
  const newcart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newcart.push(cartItem);
    }
  });
  cart = newcart;
}
