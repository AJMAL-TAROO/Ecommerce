// E-commerce Application
class EcommerceApp {
  constructor() {
    this.products = [];
    this.cart = this.loadCart();
    this.currentCategory = 'All';
    this.currentProduct = null;
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.renderCategories();
    this.renderProducts();
    this.updateCartCount();
    this.setupEventListeners();
  }

  async loadProducts() {
    try {
      const response = await fetch('./data/products.json');
      const data = await response.json();
      this.products = data.products;
      this.categories = data.categories;
    } catch (error) {
      console.error('Error loading products:', error);
      this.showNotification('Error loading products', 'error');
    }
  }

  loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
  }

  renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = this.categories.map(category => `
      <button class="btn btn-sm ${category === this.currentCategory ? 'btn-primary' : 'btn-ghost'}" 
              onclick="app.filterByCategory('${category}')">
        ${category}
      </button>
    `).join('');
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.renderCategories();
    this.renderProducts();
  }

  getFilteredProducts() {
    if (this.currentCategory === 'All') {
      return this.products;
    }
    return this.products.filter(p => p.category === this.currentCategory);
  }

  renderProducts() {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;

    const filteredProducts = this.getFilteredProducts();

    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-2xl text-gray-500">No products found</p>
        </div>
      `;
      return;
    }

    productsContainer.innerHTML = filteredProducts.map(product => `
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <figure class="h-64 overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            ${product.name}
            ${!product.inStock ? '<div class="badge badge-error">Out of Stock</div>' : ''}
          </h2>
          <p class="text-sm text-gray-600 line-clamp-2">${product.description}</p>
          <div class="flex items-center gap-2 text-sm">
            <div class="rating rating-sm">
              ${this.renderStars(product.rating)}
            </div>
            <span class="text-gray-500">(${product.reviews})</span>
          </div>
          <div class="card-actions justify-between items-center mt-4">
            <span class="text-2xl font-bold text-primary">$${product.price.toFixed(2)}</span>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-outline" onclick="app.showProductDetail(${product.id})">
                Details
              </button>
              <button class="btn btn-sm btn-primary" 
                      onclick="app.addToCart(${product.id})"
                      ${!product.inStock ? 'disabled' : ''}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />';
    }
    if (hasHalfStar) {
      stars += '<input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />';
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars += '<input type="radio" class="mask mask-star-2 bg-gray-300" disabled />';
    }
    
    return stars;
  }

  showProductDetail(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg" />
        </div>
        <div>
          <h3 class="text-3xl font-bold mb-4">${product.name}</h3>
          <div class="badge badge-secondary mb-4">${product.category}</div>
          <div class="flex items-center gap-2 mb-4">
            <div class="rating rating-sm">
              ${this.renderStars(product.rating)}
            </div>
            <span class="text-gray-500">(${product.reviews} reviews)</span>
          </div>
          <p class="text-gray-600 mb-6">${product.description}</p>
          <div class="text-4xl font-bold text-primary mb-6">$${product.price.toFixed(2)}</div>
          <div class="flex gap-4">
            ${product.inStock ? `
              <button class="btn btn-primary btn-lg flex-1" onclick="app.addToCart(${product.id}); app.closeModal()">
                Add to Cart
              </button>
            ` : `
              <button class="btn btn-error btn-lg flex-1" disabled>
                Out of Stock
              </button>
            `}
            <button class="btn btn-outline btn-lg" onclick="app.closeModal()">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('modal-open');
  }

  closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('modal-open');
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const cartItem = this.cart.find(item => item.id === productId);
    
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    this.saveCart();
    this.showNotification(`${product.name} added to cart!`, 'success');
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.renderCart();
    this.showNotification('Item removed from cart', 'info');
  }

  updateQuantity(productId, change) {
    const cartItem = this.cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart();
      this.renderCart();
    }
  }

  updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
      cartCount.classList.remove('hidden');
    } else {
      cartCount.classList.add('hidden');
    }
  }

  toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    cartDrawer.classList.toggle('translate-x-full');
    this.renderCart();
  }

  renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-12">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <p class="text-xl text-gray-500">Your cart is empty</p>
        </div>
      `;
      cartTotal.textContent = '$0.00';
      return;
    }

    cartItems.innerHTML = this.cart.map(item => `
      <div class="flex gap-4 p-4 bg-base-200 rounded-lg">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded" />
        <div class="flex-1">
          <h4 class="font-semibold">${item.name}</h4>
          <p class="text-sm text-gray-600">$${item.price.toFixed(2)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="btn btn-xs" onclick="app.updateQuantity(${item.id}, -1)">-</button>
            <span class="px-3">${item.quantity}</span>
            <button class="btn btn-xs" onclick="app.updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
          <button class="btn btn-sm btn-error btn-outline mt-2" onclick="app.removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      </div>
    `).join('');

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty', 'warning');
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (confirm(`Proceed to checkout?\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}`)) {
      this.cart = [];
      this.saveCart();
      this.toggleCart();
      this.showNotification('Order placed successfully! Thank you for your purchase.', 'success');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} shadow-lg fixed top-4 right-4 w-96 z-50 animate-fade-in`;
    notification.innerHTML = `
      <div>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  setupEventListeners() {
    window.addEventListener('click', (e) => {
      if (e.target.id === 'product-modal') {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        const cartDrawer = document.getElementById('cart-drawer');
        if (!cartDrawer.classList.contains('translate-x-full')) {
          this.toggleCart();
        }
      }
    });
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new EcommerceApp();
});
