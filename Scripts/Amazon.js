// Optional: notice we can write imports on multiple
// lines so the line doesn't get too long.
import { cart } from '../data/cart-class.js';
import { products, loadproducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadproducts(renderProductsGrid);

function renderProductsGrid() {
  let prodectHtml = '';

  products.forEach((Prodect) => {
    prodectHtml += `
    <div class="product-container">
              <div class="product-image-container">
          <img class="product-image"
          src="${Prodect.image}">
              </div>

              <div class="product-name limit-text-to-2-lines">
              ${Prodect.name}
              </div>

              <div class="product-rating-container">
                <img
                  class="product-rating-stars"
                  src="${Prodect.getStarsUrl()}"
                />
                <div class="product-rating-count link-primary">${Prodect.rating.count}</div>
              </div>

              <div class="product-price">${Prodect.getPrice()}</div>

              <div class="product-quantity-container">
                <select  class="js-quantity-selector-${Prodect.id}">
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              ${Prodect.extraInfoHTML()}
              
              <div class="product-spacer"></div>

           

              <div class="added-to-cart  js-added-to-cart-${Prodect.id}">
                <img src="images/icons/checkmark.png" />
                Added
              </div>

              <button class="add-to-cart-button button-primary  js-add-to-cart"  data-product-id="${Prodect.id}">Add to Cart</button>
            </div>
  `;
  });

  document.querySelector('.js-products-grid').innerHTML = prodectHtml;

  // ١. لێرەدا ناوی فەنکشنەکە بە Qی گەورە بنووسە
  function updateCartQuantity() {
    const cartQuantity = cart.calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
  updateCartQuantity();

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      //const productId = button.dataset.productId;
      const { productId } = button.dataset;

      cart.addToCart(productId);
      updateCartQuantity();
    });
  });
}
