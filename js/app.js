// E-commerce Application
class EcommerceApp {
  constructor() {
    this.products = [];
    this.categories = [];
    this.cart = this.loadCart();
    this.currentCategory = 'All';
    this.searchTerm = '';
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
            "inStock": true
          },
          {
            "id": 2,
            "name": "Smart Watch",
            "category": "Electronics",
            "price": 199.99,
            "description": "Fitness tracking smartwatch with heart rate monitor and GPS",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 3,
            "name": "Laptop Backpack",
            "category": "Accessories",
            "price": 49.99,
            "description": "Durable laptop backpack with multiple compartments and USB charging port",
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 4,
            "name": "Mechanical Keyboard",
            "category": "Electronics",
            "price": 129.99,
            "description": "RGB mechanical keyboard with cherry switches for gaming and typing",
            "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 5,
            "name": "Running Shoes",
            "category": "Sports",
            "price": 89.99,
            "description": "Comfortable running shoes with excellent cushioning and support",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 6,
            "name": "Coffee Maker",
            "category": "Home",
            "price": 69.99,
            "description": "Programmable coffee maker with thermal carafe and brew strength control",
            "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 7,
            "name": "Yoga Mat",
            "category": "Sports",
            "price": 34.99,
            "description": "Non-slip yoga mat with extra cushioning for comfortable practice",
            "image": "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&h=500&fit=crop",
            "inStock": false
          },
          {
            "id": 8,
            "name": "Desk Lamp",
            "category": "Home",
            "price": 39.99,
            "description": "LED desk lamp with adjustable brightness and color temperature",
            "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 9,
            "name": "Wireless Mouse",
            "category": "Electronics",
            "price": 29.99,
            "description": "Ergonomic wireless mouse with precision tracking and long battery life",
            "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 10,
            "name": "Water Bottle",
            "category": "Sports",
            "price": 24.99,
            "description": "Insulated stainless steel water bottle keeps drinks cold for 24 hours",
            "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 11,
            "name": "Bluetooth Speaker",
            "category": "Electronics",
            "price": 59.99,
            "description": "Portable Bluetooth speaker with 360-degree sound and waterproof design",
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
            "inStock": true
          },
          {
            "id": 12,
            "name": "Sunglasses",
            "category": "Accessories",
            "price": 79.99,
            "description": "Polarized sunglasses with UV protection and stylish design",
            "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
            "inStock": true
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

  searchProducts(searchTerm) {
    this.searchTerm = searchTerm;
    this.renderProducts();
  }

  getFilteredProducts() {
    let filtered = this.products;
    
    // Filter by category
    if (this.currentCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.currentCategory);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
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

    // Show checkout modal
    this.showCheckoutModal(itemCount, total);
  }

  showCheckoutModal(itemCount, total) {
    const modal = document.getElementById('checkout-modal');
    const itemsCountEl = document.getElementById('checkout-items-count');
    const totalEl = document.getElementById('checkout-total');
    
    if (itemsCountEl) itemsCountEl.textContent = itemCount;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    modal.classList.add('modal-open');
    
    // Setup form submission handler
    const form = document.getElementById('checkout-form');
    if (form) {
      form.onsubmit = (e) => this.handleCheckoutSubmit(e);
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('modal-open');
    
    // Reset form
    const form = document.getElementById('checkout-form');
    if (form) form.reset();
  }

  handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const screenshot = document.getElementById('payment-screenshot').files[0];
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    // Validate all fields are filled
    if (!screenshot || !name || !phone || !address) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // In a real application, you would upload the screenshot and send the order data to a server
    // For now, we'll simulate a successful order
    console.log('Order Details:', {
      screenshot: screenshot.name,
      name,
      phone,
      address,
      cart: this.cart,
      total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    
    // Clear cart and close modals
    this.cart = [];
    this.saveCart();
    this.closeCheckoutModal();
    this.toggleCart();
    
    this.showNotification('Order placed successfully! We will contact you shortly for delivery.', 'success');
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
    // Search input listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchProducts(e.target.value);
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target.id === 'product-modal') {
        this.closeModal();
      }
      if (e.target.id === 'checkout-modal') {
        this.closeCheckoutModal();
      }
      if (e.target.id === 'admin-dashboard-modal') {
        this.closeAdminDashboard();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeCheckoutModal();
        this.closeAdminDashboard();
        const cartDrawer = document.getElementById('cart-drawer');
        if (!cartDrawer.classList.contains('translate-x-full')) {
          this.toggleCart();
        }
      }
    });
  }

  // Admin Dashboard Methods
  openAdminDashboard() {
    const modal = document.getElementById('admin-dashboard-modal');
    this.renderDashboard();
    modal.classList.add('modal-open');
  }

  closeAdminDashboard() {
    const modal = document.getElementById('admin-dashboard-modal');
    modal.classList.remove('modal-open');
  }

  getDashboardStats() {
    const stats = {
      totalProducts: this.products.length,
      totalValue: 0,
      inStockCount: 0,
      outOfStockCount: 0,
      categoryStats: {},
      averagePrice: 0
    };

    // Calculate statistics
    this.products.forEach(product => {
      stats.totalValue += product.price;
      
      if (product.inStock) {
        stats.inStockCount++;
      } else {
        stats.outOfStockCount++;
      }

      // Category statistics
      if (!stats.categoryStats[product.category]) {
        stats.categoryStats[product.category] = {
          count: 0,
          totalValue: 0,
          inStock: 0,
          outOfStock: 0
        };
      }
      
      stats.categoryStats[product.category].count++;
      stats.categoryStats[product.category].totalValue += product.price;
      
      if (product.inStock) {
        stats.categoryStats[product.category].inStock++;
      } else {
        stats.categoryStats[product.category].outOfStock++;
      }
    });

    stats.averagePrice = stats.totalProducts > 0 ? stats.totalValue / stats.totalProducts : 0;

    return stats;
  }

  renderDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return;

    const stats = this.getDashboardStats();
    const categories = Object.keys(stats.categoryStats);
    const maxCategoryCount = Math.max(...Object.values(stats.categoryStats).map(c => c.count));

    dashboardContent.innerHTML = `
      <!-- Summary Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Total Products</p>
              <h3 class="text-4xl font-bold mt-2">${stats.totalProducts}</h3>
            </div>
            <div class="text-5xl opacity-80">
              <i class="fas fa-box"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">In Stock</p>
              <h3 class="text-4xl font-bold mt-2">${stats.inStockCount}</h3>
            </div>
            <div class="text-5xl opacity-80">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Out of Stock</p>
              <h3 class="text-4xl font-bold mt-2">${stats.outOfStockCount}</h3>
            </div>
            <div class="text-5xl opacity-80">
              <i class="fas fa-times-circle"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Avg. Price</p>
              <h3 class="text-4xl font-bold mt-2">$${stats.averagePrice.toFixed(0)}</h3>
            </div>
            <div class="text-5xl opacity-80">
              <i class="fas fa-dollar-sign"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Products per Category -->
        <div class="bg-base-100 rounded-lg shadow-lg p-6">
          <h4 class="text-2xl font-bold mb-6 flex items-center">
            <i class="fas fa-chart-bar mr-3 text-primary"></i>
            Products per Category
          </h4>
          <div class="space-y-4">
            ${categories.map(category => {
              const catStats = stats.categoryStats[category];
              const percentage = (catStats.count / stats.totalProducts * 100).toFixed(1);
              const barWidth = (catStats.count / maxCategoryCount * 100).toFixed(1);
              
              return `
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-lg">${category}</span>
                    <span class="badge badge-primary badge-lg">${catStats.count} items</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex-1 bg-base-300 rounded-full h-4 overflow-hidden">
                      <div class="category-bar bg-gradient-to-r from-primary to-secondary h-full rounded-full" 
                           style="width: ${barWidth}%"></div>
                    </div>
                    <span class="text-sm font-semibold w-12">${percentage}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Category Details Table -->
        <div class="bg-base-100 rounded-lg shadow-lg p-6">
          <h4 class="text-2xl font-bold mb-6 flex items-center">
            <i class="fas fa-list mr-3 text-primary"></i>
            Category Details
          </h4>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Category</th>
                  <th class="text-center">Total</th>
                  <th class="text-center">In Stock</th>
                  <th class="text-center">Out</th>
                  <th class="text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                ${categories.map(category => {
                  const catStats = stats.categoryStats[category];
                  return `
                    <tr>
                      <td class="font-semibold">${category}</td>
                      <td class="text-center">
                        <span class="badge badge-neutral">${catStats.count}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge badge-success">${catStats.inStock}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge badge-error">${catStats.outOfStock}</span>
                      </td>
                      <td class="text-right font-bold text-primary">
                        $${catStats.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="font-bold">
                  <td>Total</td>
                  <td class="text-center">
                    <span class="badge badge-primary badge-lg">${stats.totalProducts}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-success badge-lg">${stats.inStockCount}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-error badge-lg">${stats.outOfStockCount}</span>
                  </td>
                  <td class="text-right text-primary text-lg">
                    $${stats.totalValue.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Additional Insights -->
      <div class="bg-gradient-to-br from-base-100 to-base-200 rounded-lg shadow-lg p-6 mt-6">
        <h4 class="text-2xl font-bold mb-4 flex items-center">
          <i class="fas fa-lightbulb mr-3 text-warning"></i>
          Quick Insights
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-base-100 rounded-lg p-4 border-l-4 border-primary">
            <p class="text-sm text-gray-600">Total Inventory Value</p>
            <p class="text-2xl font-bold text-primary">$${stats.totalValue.toFixed(2)}</p>
          </div>
          <div class="bg-base-100 rounded-lg p-4 border-l-4 border-success">
            <p class="text-sm text-gray-600">Stock Availability</p>
            <p class="text-2xl font-bold text-success">${((stats.inStockCount / stats.totalProducts) * 100).toFixed(1)}%</p>
          </div>
          <div class="bg-base-100 rounded-lg p-4 border-l-4 border-warning">
            <p class="text-sm text-gray-600">Categories</p>
            <p class="text-2xl font-bold text-warning">${categories.length}</p>
          </div>
        </div>
      </div>
    `;
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new EcommerceApp();
});
