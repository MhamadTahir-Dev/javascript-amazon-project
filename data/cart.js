export const cart = [];

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
