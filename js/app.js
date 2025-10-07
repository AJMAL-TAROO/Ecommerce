// E-commerce Application
class EcommerceApp {
  constructor() {
    this.products = [];
    this.categories = [];
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
      // Try to fetch from JSON file first (for HTTP server deployment)
      const response = await fetch('./data/products.json');
      const data = await response.json();
      this.products = data.products;
      this.categories = data.categories;
    } catch (error) {
      // Fallback to embedded data if fetch fails (for file:// protocol)
      console.log('Loading products from embedded data');
      const embeddedData = {
        "products": [
          {
            "id": 1,
            "name": "Wireless Headphones",
            "category": "Electronics",
            "price": 79.99,
            "description": "Premium wireless headphones with noise cancellation and 30-hour battery life",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.5,
            "reviews": 128
          },
          {
            "id": 2,
            "name": "Smart Watch",
            "category": "Electronics",
            "price": 199.99,
            "description": "Fitness tracking smartwatch with heart rate monitor and GPS",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.7,
            "reviews": 256
          },
          {
            "id": 3,
            "name": "Laptop Backpack",
            "category": "Accessories",
            "price": 49.99,
            "description": "Durable laptop backpack with multiple compartments and USB charging port",
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.3,
            "reviews": 89
          },
          {
            "id": 4,
            "name": "Mechanical Keyboard",
            "category": "Electronics",
            "price": 129.99,
            "description": "RGB mechanical keyboard with cherry switches for gaming and typing",
            "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.8,
            "reviews": 342
          },
          {
            "id": 5,
            "name": "Running Shoes",
            "category": "Sports",
            "price": 89.99,
            "description": "Comfortable running shoes with excellent cushioning and support",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.6,
            "reviews": 203
          },
          {
            "id": 6,
            "name": "Coffee Maker",
            "category": "Home",
            "price": 69.99,
            "description": "Programmable coffee maker with thermal carafe and brew strength control",
            "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.4,
            "reviews": 167
          },
          {
            "id": 7,
            "name": "Yoga Mat",
            "category": "Sports",
            "price": 34.99,
            "description": "Non-slip yoga mat with extra cushioning for comfortable practice",
            "image": "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&h=500&fit=crop",
            "inStock": false,
            "rating": 4.5,
            "reviews": 145
          },
          {
            "id": 8,
            "name": "Desk Lamp",
            "category": "Home",
            "price": 39.99,
            "description": "LED desk lamp with adjustable brightness and color temperature",
            "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.2,
            "reviews": 98
          },
          {
            "id": 9,
            "name": "Wireless Mouse",
            "category": "Electronics",
            "price": 29.99,
            "description": "Ergonomic wireless mouse with precision tracking and long battery life",
            "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.6,
            "reviews": 287
          },
          {
            "id": 10,
            "name": "Water Bottle",
            "category": "Sports",
            "price": 24.99,
            "description": "Insulated stainless steel water bottle keeps drinks cold for 24 hours",
            "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.7,
            "reviews": 412
          },
          {
            "id": 11,
            "name": "Bluetooth Speaker",
            "category": "Electronics",
            "price": 59.99,
            "description": "Portable Bluetooth speaker with 360-degree sound and waterproof design",
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.5,
            "reviews": 234
          },
          {
            "id": 12,
            "name": "Sunglasses",
            "category": "Accessories",
            "price": 79.99,
            "description": "Polarized sunglasses with UV protection and stylish design",
            "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
            "inStock": true,
            "rating": 4.4,
            "reviews": 176
          }
        ],
        "categories": [
          "All",
          "Electronics",
          "Accessories",
          "Sports",
          "Home"
        ]
      };
      this.products = embeddedData.products;
      this.categories = embeddedData.categories;
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

    if (!this.categories || this.categories.length === 0) {
      categoriesContainer.innerHTML = '';
      return;
    }

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
