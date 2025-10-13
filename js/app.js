// E-commerce Application
class EcommerceApp {
  constructor() {
    this.products = [];
    this.categories = [];
    this.cart = this.loadCart();
    this.currentCategory = 'All';
    this.searchTerm = '';
    this.currentProduct = null;
    this.isAdminAuthenticated = false;
    this.firebaseInitialized = false;
    this.clickCount = 0;
    this.clickTimer = null;
    this.init();
  }

  async init() {
    // Initialize Firebase
    await this.initializeFirebase();
    await this.loadProducts();
    this.renderCategories();
    this.renderProducts();
    this.updateCartCount();
    this.setupEventListeners();
  }

  async initializeFirebase() {
    try {
      await firebaseService.initialize();
      this.firebaseInitialized = true;
      console.log('Firebase initialized in app');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      this.showNotification('Failed to connect to database. Some features may not work.', 'error');
    }
  }

  async loadProducts() {
    try {
      if (this.firebaseInitialized) {
        // Load from Firebase
        this.products = await firebaseService.getProducts();
        this.categories = await firebaseService.getCategories();
        
        // If no products in Firebase, migrate embedded data
        if (this.products.length === 0) {
          console.log('No products found in Firebase. Migrating embedded data...');
          await this.migrateEmbeddedDataToFirebase();
          this.products = await firebaseService.getProducts();
          this.categories = await firebaseService.getCategories();
        }
      } else {
        // Fallback to embedded data if Firebase not initialized
        console.log('Loading products from embedded data');
        await this.loadEmbeddedData();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to embedded data
      await this.loadEmbeddedData();
    }
  }

  async loadEmbeddedData() {
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

  async migrateEmbeddedDataToFirebase() {
    try {
      await this.loadEmbeddedData();
      await firebaseService.migrateProducts(this.products);
      await firebaseService.migrateCategories(this.categories);
      this.showNotification('Data migrated to Firebase successfully!', 'success');
    } catch (error) {
      console.error('Error migrating data:', error);
      this.showNotification('Error migrating data to Firebase', 'error');
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
        <figure class="h-64 overflow-hidden relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
          ${product.promotion > 0 ? `
            <div class="badge badge-error absolute top-2 right-2 text-lg font-bold">
              -${product.promotion}%
            </div>
          ` : ''}
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            ${product.name}
            ${!product.inStock ? '<div class="badge badge-error">Out of Stock</div>' : ''}
            ${product.promotion > 0 ? '<div class="badge badge-secondary">On Sale</div>' : ''}
          </h2>
          <p class="text-sm text-gray-600 line-clamp-2">${product.description}</p>
          <div class="card-actions justify-between items-center mt-4">
            ${product.promotion > 0 ? `
              <div>
                <span class="text-lg text-gray-500 line-through">₨${product.price.toFixed(2)}</span>
                <span class="text-2xl font-bold text-primary ml-2">₨${(product.price * (1 - product.promotion / 100)).toFixed(2)}</span>
              </div>
            ` : `
              <span class="text-2xl font-bold text-primary">₨${product.price.toFixed(2)}</span>
            `}
            <div class="flex gap-2">
              <button class="btn btn-sm btn-outline" onclick="app.showProductDetail('${product.id}')">
                Details
              </button>
              <button class="btn btn-sm btn-primary" 
                      onclick="app.addToCart('${product.id}')"
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
        <div class="relative">
          <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg" />
          ${product.promotion > 0 ? `
            <div class="badge badge-error absolute top-2 right-2 text-xl font-bold p-4">
              -${product.promotion}% OFF
            </div>
          ` : ''}
        </div>
        <div>
          <h3 class="text-3xl font-bold mb-4">${product.name}</h3>
          <div class="flex gap-2 mb-4">
            <div class="badge badge-secondary">${product.category}</div>
            ${product.promotion > 0 ? '<div class="badge badge-accent">On Sale</div>' : ''}
          </div>
          <p class="text-gray-600 mb-6">${product.description}</p>
          ${product.promotion > 0 ? `
            <div class="mb-6">
              <div class="text-2xl text-gray-500 line-through">₨${product.price.toFixed(2)}</div>
              <div class="text-4xl font-bold text-primary">₨${(product.price * (1 - product.promotion / 100)).toFixed(2)}</div>
              <div class="text-lg text-success font-semibold">You save ₨${(product.price * product.promotion / 100).toFixed(2)} (${product.promotion}%)</div>
            </div>
          ` : `
            <div class="text-4xl font-bold text-primary mb-6">₨${product.price.toFixed(2)}</div>
          `}
          <div class="flex gap-4">
            ${product.inStock ? `
              <button class="btn btn-primary btn-lg flex-1" onclick="app.addToCart('${product.id}'); app.closeModal()">
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
      cartTotal.textContent = '₨0.00';
      return;
    }

    cartItems.innerHTML = this.cart.map(item => {
      const effectivePrice = item.promotion > 0 ? item.price * (1 - item.promotion / 100) : item.price;
      return `
      <div class="flex gap-4 p-4 bg-base-200 rounded-lg">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded" />
        <div class="flex-1">
          <h4 class="font-semibold">${item.name}</h4>
          ${item.promotion > 0 ? `
            <p class="text-sm text-gray-500 line-through">₨${item.price.toFixed(2)}</p>
            <p class="text-sm text-primary font-bold">₨${effectivePrice.toFixed(2)} <span class="badge badge-error badge-xs">-${item.promotion}%</span></p>
          ` : `
            <p class="text-sm text-gray-600">₨${item.price.toFixed(2)}</p>
          `}
          <div class="flex items-center gap-2 mt-2">
            <button class="btn btn-xs" onclick="app.updateQuantity('${item.id}', -1)">-</button>
            <span class="px-3">${item.quantity}</span>
            <button class="btn btn-xs" onclick="app.updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold">₨${(effectivePrice * item.quantity).toFixed(2)}</p>
          <button class="btn btn-sm btn-error btn-outline mt-2" onclick="app.removeFromCart('${item.id}')">
            Remove
          </button>
        </div>
      </div>
    `;
    }).join('');

    const total = this.cart.reduce((sum, item) => {
      const effectivePrice = item.promotion > 0 ? item.price * (1 - item.promotion / 100) : item.price;
      return sum + (effectivePrice * item.quantity);
    }, 0);
    cartTotal.textContent = `₨${total.toFixed(2)}`;
  }

  checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty', 'warning');
      return;
    }

    const total = this.cart.reduce((sum, item) => {
      const effectivePrice = item.promotion > 0 ? item.price * (1 - item.promotion / 100) : item.price;
      return sum + (effectivePrice * item.quantity);
    }, 0);
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Show checkout modal
    this.showCheckoutModal(itemCount, total);
  }

  showCheckoutModal(itemCount, total) {
    const modal = document.getElementById('checkout-modal');
    const itemsCountEl = document.getElementById('checkout-items-count');
    const totalEl = document.getElementById('checkout-total');
    
    if (itemsCountEl) itemsCountEl.textContent = itemCount;
    if (totalEl) totalEl.textContent = `₨${total.toFixed(2)}`;
    
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

  async handleCheckoutSubmit(e) {
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
    
    // Get submit button and disable it to prevent multiple submissions
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
    
    try {
      // Show loading notification
      this.showNotification('Processing your order...', 'info');
      
      // Prepare order data
      const orderData = {
        screenshot: screenshot,
        name: name,
        phone: phone,
        address: address,
        cart: this.cart,
        total: this.cart.reduce((sum, item) => {
          const effectivePrice = item.promotion > 0 ? item.price * (1 - item.promotion / 100) : item.price;
          return sum + (effectivePrice * item.quantity);
        }, 0)
      };

      // Save order to Firebase with overall timeout (45 seconds)
      let result = null;
      if (this.firebaseInitialized) {
        const savePromise = firebaseService.saveOrder(orderData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Order submission timeout. Please check your internet connection and try again.')), 45000);
        });
        result = await Promise.race([savePromise, timeoutPromise]);
      } else {
        // Fallback: log to console if Firebase not available
        console.log('Order Details (Firebase not available):', orderData);
      }
      
      // Clear cart and close modals
      this.cart = [];
      this.saveCart();
      this.closeCheckoutModal();
      this.toggleCart();
      
      // Show appropriate success message
      if (result && result.uploadError) {
        this.showNotification('Order placed successfully! Note: Payment screenshot upload failed - please contact us with your payment proof.', 'warning');
      } else {
        this.showNotification('Order placed successfully! We will contact you shortly for delivery.', 'success');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      this.showNotification('Error processing order. Please try again.', 'error');
      // Re-enable submit button on error
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} shadow-lg fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in`;
    notification.style.width = '70%';
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

    // Triple-click listener for BeverlyShop logo
    const beverlyShopLogo = document.getElementById('beverlyshop-logo');
    if (beverlyShopLogo) {
      beverlyShopLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.clickCount++;
        
        // Clear existing timer
        if (this.clickTimer) {
          clearTimeout(this.clickTimer);
        }
        
        // Check if triple-click achieved
        if (this.clickCount === 3) {
          this.clickCount = 0;
          this.openAdminDashboard();
        } else {
          // Reset counter after 500ms if no third click
          this.clickTimer = setTimeout(() => {
            this.clickCount = 0;
          }, 500);
        }
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
      if (e.target.id === 'admin-login-modal') {
        this.closeAdminLogin();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeCheckoutModal();
        this.closeAdminDashboard();
        this.closeAdminLogin();
        const cartDrawer = document.getElementById('cart-drawer');
        if (!cartDrawer.classList.contains('translate-x-full')) {
          this.toggleCart();
        }
      }
      
      // Keyboard shortcut for admin dashboard: Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        this.openAdminDashboard();
      }
    });
  }

  // Admin Dashboard Methods
  openAdminDashboard() {
    // Check if admin is authenticated
    if (!this.isAdminAuthenticated) {
      this.showAdminLogin();
      return;
    }

    const modal = document.getElementById('admin-dashboard-modal');
    this.renderDashboard();
    modal.classList.add('modal-open');
  }

  closeAdminDashboard() {
    const modal = document.getElementById('admin-dashboard-modal');
    modal.classList.remove('modal-open');
  }

  showAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    modal.classList.add('modal-open');
    
    // Setup form submission handler
    const form = document.getElementById('admin-login-form');
    if (form) {
      form.onsubmit = (e) => this.handleAdminLogin(e);
    }
  }

  closeAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    modal.classList.remove('modal-open');
    
    // Reset form
    const form = document.getElementById('admin-login-form');
    if (form) form.reset();
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    if (!username || !password) {
      this.showNotification('Please enter both username and password', 'error');
      return;
    }
    
    try {
      // Verify admin credentials with Firebase
      const isValid = await firebaseService.verifyAdmin(username, password);
      
      if (isValid) {
        this.isAdminAuthenticated = true;
        this.closeAdminLogin();
        this.showNotification('Login successful! Welcome Admin.', 'success');
        this.openAdminDashboard();
      } else {
        this.showNotification('Invalid username or password', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showNotification('Login failed. Please try again.', 'error');
    }
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
      <!-- Tab Navigation -->
      <div role="tablist" class="tabs tabs-boxed mb-4 md:mb-6 text-xs md:text-sm overflow-x-auto">
        <a role="tab" class="tab tab-active" onclick="app.switchDashboardTab('stats')">Statistics</a>
        <a role="tab" class="tab" onclick="app.switchDashboardTab('products')">Products</a>
        <a role="tab" class="tab" onclick="app.switchDashboardTab('categories')">Categories</a>
        <a role="tab" class="tab" onclick="app.switchDashboardTab('orders')">Orders</a>
      </div>

      <!-- Statistics Tab -->
      <div id="stats-tab" class="dashboard-tab">
      <!-- Summary Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs md:text-sm opacity-80">Total Products</p>
              <h3 class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">${stats.totalProducts}</h3>
            </div>
            <div class="text-3xl md:text-5xl opacity-80">
              <i class="fas fa-box"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs md:text-sm opacity-80">In Stock</p>
              <h3 class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">${stats.inStockCount}</h3>
            </div>
            <div class="text-3xl md:text-5xl opacity-80">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs md:text-sm opacity-80">Out of Stock</p>
              <h3 class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">${stats.outOfStockCount}</h3>
            </div>
            <div class="text-3xl md:text-5xl opacity-80">
              <i class="fas fa-times-circle"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs md:text-sm opacity-80">Avg. Price</p>
              <h3 class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">₨${stats.averagePrice.toFixed(0)}</h3>
            </div>
            <div class="text-3xl md:text-5xl opacity-80">
              <i class="fas fa-rupee-sign"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Products per Category -->
        <div class="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
          <h4 class="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <i class="fas fa-chart-bar mr-2 md:mr-3 text-primary"></i>
            Products per Category
          </h4>
          <div class="space-y-3 md:space-y-4">
            ${categories.map(category => {
              const catStats = stats.categoryStats[category];
              const percentage = (catStats.count / stats.totalProducts * 100).toFixed(1);
              const barWidth = (catStats.count / maxCategoryCount * 100).toFixed(1);
              
              return `
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-sm md:text-lg">${category}</span>
                    <span class="badge badge-primary text-xs md:badge-lg">${catStats.count} items</span>
                  </div>
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="flex-1 bg-base-300 rounded-full h-3 md:h-4 overflow-hidden">
                      <div class="category-bar bg-gradient-to-r from-primary to-secondary h-full rounded-full" 
                           style="width: ${barWidth}%"></div>
                    </div>
                    <span class="text-xs md:text-sm font-semibold w-10 md:w-12">${percentage}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Category Details Table -->
        <div class="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
          <h4 class="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <i class="fas fa-list mr-2 md:mr-3 text-primary"></i>
            Category Details
          </h4>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full text-xs md:text-base">
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
                      <td class="font-semibold text-xs md:text-base">${category}</td>
                      <td class="text-center">
                        <span class="badge badge-neutral badge-sm md:badge-md">${catStats.count}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge badge-success badge-sm md:badge-md">${catStats.inStock}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge badge-error badge-sm md:badge-md">${catStats.outOfStock}</span>
                      </td>
                      <td class="text-right font-bold text-primary text-xs md:text-base">
                        ₨${catStats.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="font-bold text-xs md:text-base">
                  <td>Total</td>
                  <td class="text-center">
                    <span class="badge badge-primary badge-sm md:badge-lg">${stats.totalProducts}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-success badge-sm md:badge-lg">${stats.inStockCount}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-error badge-sm md:badge-lg">${stats.outOfStockCount}</span>
                  </td>
                  <td class="text-right text-primary text-sm md:text-lg">
                    ₨${stats.totalValue.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Additional Insights -->
      <div class="bg-gradient-to-br from-base-100 to-base-200 rounded-lg shadow-lg p-4 md:p-6 mt-4 md:mt-6">
        <h4 class="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center">
          <i class="fas fa-lightbulb mr-2 md:mr-3 text-warning"></i>
          Quick Insights
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div class="bg-base-100 rounded-lg p-3 md:p-4 border-l-4 border-primary">
            <p class="text-xs md:text-sm text-gray-600">Total Inventory Value</p>
            <p class="text-lg md:text-2xl font-bold text-primary">₨${stats.totalValue.toFixed(2)}</p>
          </div>
          <div class="bg-base-100 rounded-lg p-3 md:p-4 border-l-4 border-success">
            <p class="text-xs md:text-sm text-gray-600">Stock Availability</p>
            <p class="text-lg md:text-2xl font-bold text-success">${((stats.inStockCount / stats.totalProducts) * 100).toFixed(1)}%</p>
          </div>
          <div class="bg-base-100 rounded-lg p-3 md:p-4 border-l-4 border-warning">
            <p class="text-xs md:text-sm text-gray-600">Categories</p>
            <p class="text-lg md:text-2xl font-bold text-warning">${categories.length}</p>
          </div>
        </div>
      </div>
      </div>

      <!-- Product Management Tab -->
      <div id="products-tab" class="dashboard-tab hidden">
        <div class="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h4 class="text-lg md:text-2xl font-bold">Product Management</h4>
          <button class="btn btn-primary btn-sm md:btn-md w-full sm:w-auto" onclick="app.showAddProductForm()">
            <i class="fas fa-plus mr-2"></i>
            Add New Product
          </button>
        </div>

        <!-- Add/Edit Product Form -->
        <div id="product-form-container" class="hidden mb-4 md:mb-6">
          <div class="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
            <h5 class="text-base md:text-xl font-bold mb-3 md:mb-4" id="form-title">Add New Product</h5>
            <form id="product-form" class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input type="hidden" id="product-id" />
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Product Name *</span>
                </label>
                <input type="text" id="product-name" class="input input-bordered input-sm md:input-md" required />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Category *</span>
                </label>
                <select id="product-category" class="select select-bordered select-sm md:select-md" required>
                  <option value="">Select Category</option>
                  ${this.categories.filter(cat => cat !== 'All').map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Price (₨) *</span>
                </label>
                <input type="number" id="product-price" class="input input-bordered input-sm md:input-md" step="0.01" min="0" required />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">In Stock</span>
                </label>
                <input type="checkbox" id="product-instock" class="checkbox checkbox-primary checkbox-sm md:checkbox-md" checked />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Promotion (%)</span>
                </label>
                <input type="number" id="product-promotion" class="input input-bordered input-sm md:input-md" step="1" min="0" max="100" placeholder="0" />
                <label class="label">
                  <span class="label-text-alt text-xs">Enter discount percentage (0-100). Leave 0 for no promotion.</span>
                </label>
              </div>

              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Description *</span>
                </label>
                <textarea id="product-description" class="textarea textarea-bordered textarea-sm md:textarea-md h-20 md:h-24" required></textarea>
              </div>

              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Product Image</span>
                </label>
                <div class="tabs tabs-boxed mb-2 text-xs md:text-sm">
                  <a class="tab tab-active" onclick="app.switchImageInput('url')">Image URL</a>
                  <a class="tab" onclick="app.switchImageInput('file')">Upload Image</a>
                </div>
                <div id="image-url-input">
                  <input type="url" id="product-image-url" class="input input-bordered input-sm md:input-md w-full" placeholder="Enter image URL" />
                  <label class="label">
                    <span class="label-text-alt text-xs">Enter a URL to an external image</span>
                  </label>
                </div>
                <div id="image-file-input" class="hidden">
                  <input type="file" id="product-image" accept="image/*" class="file-input file-input-bordered file-input-sm md:file-input-md w-full" />
                  <label class="label">
                    <span class="label-text-alt text-xs">Upload an image from your device (will be stored in Firebase Storage)</span>
                  </label>
                </div>
              </div>

              <div class="md:col-span-2 flex gap-2 justify-end">
                <button type="button" class="btn btn-outline btn-sm md:btn-md" onclick="app.cancelProductForm()">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm md:btn-md">
                  <i class="fas fa-save mr-2"></i>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Products List -->
        <div class="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
          <h5 class="text-base md:text-xl font-bold mb-3 md:mb-4">All Products</h5>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full text-xs md:text-sm">
              <thead>
                <tr>
                  <th class="hidden md:table-cell">ID</th>
                  <th>Name</th>
                  <th class="hidden sm:table-cell">Category</th>
                  <th>Price</th>
                  <th class="hidden md:table-cell">Promotion</th>
                  <th class="hidden lg:table-cell">Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.products.map(product => `
                  <tr>
                    <td class="hidden md:table-cell">${product.id}</td>
                    <td>
                      <div class="flex items-center gap-2 md:gap-3">
                        <div class="avatar">
                          <div class="w-8 h-8 md:w-12 md:h-12 rounded">
                            <img src="${product.image}" alt="${product.name}" />
                          </div>
                        </div>
                        <div class="font-semibold text-xs md:text-sm">${product.name}</div>
                      </div>
                    </td>
                    <td class="hidden sm:table-cell"><span class="badge badge-primary badge-sm md:badge-md">${product.category}</span></td>
                    <td class="font-bold text-xs md:text-sm">₨${product.price.toFixed(2)}</td>
                    <td class="hidden md:table-cell">
                      ${product.promotion > 0 ? 
                        `<span class="badge badge-error badge-sm">-${product.promotion}%</span>` : 
                        '<span class="badge badge-ghost badge-sm">None</span>'}
                    </td>
                    <td class="hidden lg:table-cell">
                      ${product.inStock ? 
                        '<span class="badge badge-success badge-sm">In Stock</span>' : 
                        '<span class="badge badge-error badge-sm">Out</span>'}
                    </td>
                    <td>
                      <div class="flex gap-1 md:gap-2">
                        <button class="btn btn-xs md:btn-sm btn-info" onclick="app.viewProduct('${product.id}')" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-xs md:btn-sm btn-warning" onclick="app.editProduct('${product.id}')" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-xs md:btn-sm btn-error" onclick="app.deleteProduct('${product.id}')" title="Delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Categories Management Tab -->
      <div id="categories-tab" class="dashboard-tab hidden">
        <div class="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h4 class="text-lg md:text-2xl font-bold">Category Management</h4>
          <button class="btn btn-primary btn-sm md:btn-md w-full sm:w-auto" onclick="app.showAddCategoryForm()">
            <i class="fas fa-plus mr-2"></i>
            Add New Category
          </button>
        </div>

        <!-- Add/Edit Category Form -->
        <div id="category-form-container" class="hidden mb-4 md:mb-6">
          <div class="bg-base-100 rounded-lg shadow-lg p-4 md:p-6">
            <h5 class="text-base md:text-xl font-bold mb-3 md:mb-4" id="category-form-title">Add New Category</h5>
            <form id="category-form" class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input type="hidden" id="category-old-name" />
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Category Name *</span>
                </label>
                <input type="text" id="category-name" class="input input-bordered input-sm md:input-md" required placeholder="e.g., Featured, New, Black Friday" />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Display Color</span>
                </label>
                <div class="flex gap-2">
                  <input type="color" id="category-color" class="w-12 h-10 md:w-16 md:h-12 border-2 border-base-300 rounded cursor-pointer" value="#3b82f6" />
                  <input type="text" id="category-color-hex" class="input input-bordered input-sm md:input-md flex-1" placeholder="#3b82f6" value="#3b82f6" />
                </div>
                <label class="label">
                  <span class="label-text-alt text-xs">Color for category badges and highlights</span>
                </label>
              </div>

              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text font-semibold text-xs md:text-sm">Description</span>
                </label>
                <textarea id="category-description" class="textarea textarea-bordered textarea-sm md:textarea-md h-16 md:h-20" placeholder="Optional description for this category"></textarea>
              </div>

              <div class="form-control md:col-span-2">
                <div class="flex gap-2">
                  <button type="submit" class="btn btn-primary btn-sm md:btn-md">
                    <i class="fas fa-save mr-2"></i>
                    Save Category
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm md:btn-md" onclick="app.cancelCategoryForm()">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Categories List -->
        <div id="categories-list-container">
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>

      <!-- Orders Management Tab -->
      <div id="orders-tab" class="dashboard-tab hidden">
        <div class="mb-4 md:mb-6">
          <h4 class="text-lg md:text-2xl font-bold mb-3 md:mb-4">Orders Management</h4>
          <div id="orders-content">
            <div class="flex justify-center py-12">
              <span class="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Load orders if Firebase is initialized
    if (this.firebaseInitialized) {
      this.loadOrders();
    }
  }

  async loadOrders() {
    try {
      const orders = await firebaseService.getOrders();
      this.renderOrdersTab(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      const ordersContent = document.getElementById('orders-content');
      if (ordersContent) {
        ordersContent.innerHTML = `
          <div class="alert alert-error">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>Failed to load orders. Please try again.</span>
          </div>
        `;
      }
    }
  }

  renderOrdersTab(orders) {
    const ordersContent = document.getElementById('orders-content');
    if (!ordersContent) return;

    if (orders.length === 0) {
      ordersContent.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle mr-2"></i>
          <span>No orders found yet.</span>
        </div>
      `;
      return;
    }

    // Calculate order statistics
    const orderStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };

    ordersContent.innerHTML = `
      <!-- Order Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
        <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-3 md:p-4">
          <div class="text-center">
            <p class="text-xs md:text-sm opacity-80">Total Orders</p>
            <h3 class="text-xl md:text-3xl font-bold mt-1">${orderStats.total}</h3>
          </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-3 md:p-4">
          <div class="text-center">
            <p class="text-xs md:text-sm opacity-80">Pending</p>
            <h3 class="text-xl md:text-3xl font-bold mt-1">${orderStats.pending}</h3>
          </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-3 md:p-4">
          <div class="text-center">
            <p class="text-xs md:text-sm opacity-80">Processing</p>
            <h3 class="text-xl md:text-3xl font-bold mt-1">${orderStats.processing}</h3>
          </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-3 md:p-4">
          <div class="text-center">
            <p class="text-xs md:text-sm opacity-80">Completed</p>
            <h3 class="text-xl md:text-3xl font-bold mt-1">${orderStats.completed}</h3>
          </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-lg shadow-lg p-3 md:p-4">
          <div class="text-center">
            <p class="text-xs md:text-sm opacity-80">Cancelled</p>
            <h3 class="text-xl md:text-3xl font-bold mt-1">${orderStats.cancelled}</h3>
          </div>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs md:text-sm opacity-80">Total Revenue (Completed Orders)</p>
            <h3 class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">₨${orderStats.totalRevenue.toFixed(2)}</h3>
          </div>
          <div class="text-4xl md:text-6xl opacity-80">
            <i class="fas fa-money-bill-wave"></i>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-base-100 rounded-lg shadow-lg p-3 md:p-4 mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-end">
          <div class="form-control flex-1 sm:flex-initial">
            <label class="label">
              <span class="label-text font-semibold text-xs md:text-sm">Filter by Status</span>
            </label>
            <select id="order-status-filter" class="select select-bordered select-sm md:select-md" onchange="app.filterOrders()">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text font-semibold text-xs md:text-sm">Search</span>
            </label>
            <input 
              type="text" 
              id="order-search" 
              placeholder="Search by customer name, phone, or order ID..." 
              class="input input-bordered input-sm md:input-md w-full"
              oninput="app.filterOrders()" 
            />
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-base-100 rounded-lg shadow-lg p-3 md:p-6">
        <h5 class="text-base md:text-xl font-bold mb-3 md:mb-4">All Orders</h5>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th class="hidden sm:table-cell">Order ID</th>
                <th>Customer</th>
                <th class="hidden md:table-cell">Items</th>
                <th>Total</th>
                <th>Status</th>
                <th class="hidden lg:table-cell">Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="orders-table-body">
              ${this.renderOrderRows(orders)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Store orders for filtering
    this.allOrders = orders;
  }

  renderOrderRows(orders) {
    return orders.map(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';
      const itemCount = order.items ? order.items.length : 0;
      const statusBadgeClass = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'completed': 'badge-success',
        'cancelled': 'badge-error'
      }[order.status] || 'badge-ghost';

      return `
        <tr data-order-id="${order.id}" data-status="${order.status}" data-customer="${order.customerName?.toLowerCase() || ''}" data-phone="${order.customerPhone || ''}">
          <td class="font-mono text-xs hidden sm:table-cell">${order.orderId?.substring(0, 8) || order.id?.substring(0, 8)}...</td>
          <td>
            <div>
              <div class="font-semibold text-xs md:text-sm">${order.customerName || 'N/A'}</div>
              <div class="text-xs text-gray-500">${order.customerPhone || ''}</div>
            </div>
          </td>
          <td class="text-center hidden md:table-cell">
            <span class="badge badge-primary badge-sm">${itemCount}</span>
          </td>
          <td class="font-bold text-primary text-xs md:text-sm">₨${(order.totalAmount || 0).toFixed(2)}</td>
          <td>
            <span class="badge ${statusBadgeClass} badge-sm md:badge-md">${order.status || 'pending'}</span>
          </td>
          <td class="text-xs hidden lg:table-cell">${orderDate}</td>
          <td>
            <div class="flex gap-1">
              <button class="btn btn-xs md:btn-sm btn-info" onclick="app.viewOrderDetails('${order.id}')" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-xs md:btn-sm btn-primary" title="Update Status">
                  <i class="fas fa-edit"></i>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50 text-xs md:text-sm">
                  <li><a onclick="app.updateOrderStatus('${order.id}', 'pending')">
                    <i class="fas fa-clock text-warning"></i> Pending
                  </a></li>
                  <li><a onclick="app.updateOrderStatus('${order.id}', 'processing')">
                    <i class="fas fa-spinner text-info"></i> Processing
                  </a></li>
                  <li><a onclick="app.updateOrderStatus('${order.id}', 'completed')">
                    <i class="fas fa-check text-success"></i> Completed
                  </a></li>
                  <li><a onclick="app.updateOrderStatus('${order.id}', 'cancelled')">
                    <i class="fas fa-times text-error"></i> Cancelled
                  </a></li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterOrders() {
    const statusFilter = document.getElementById('order-status-filter')?.value || 'all';
    const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
    const tableBody = document.getElementById('orders-table-body');
    
    if (!tableBody || !this.allOrders) return;

    let filteredOrders = this.allOrders;

    // Filter by status
    if (statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => {
        const customerName = (order.customerName || '').toLowerCase();
        const customerPhone = (order.customerPhone || '').toLowerCase();
        const orderId = (order.orderId || order.id || '').toLowerCase();
        
        return customerName.includes(searchTerm) || 
               customerPhone.includes(searchTerm) || 
               orderId.includes(searchTerm);
      });
    }

    tableBody.innerHTML = this.renderOrderRows(filteredOrders);
  }

  async viewOrderDetails(orderId) {
    try {
      const order = this.allOrders?.find(o => o.id === orderId);
      if (!order) {
        this.showNotification('Order not found', 'error');
        return;
      }

      const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';
      const statusBadgeClass = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'completed': 'badge-success',
        'cancelled': 'badge-error'
      }[order.status] || 'badge-ghost';

      const modal = document.getElementById('product-modal');
      const modalContent = document.getElementById('modal-content');
      
      modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-2xl">Order Details</h3>
          <button class="btn btn-ghost btn-circle" onclick="document.getElementById('product-modal').classList.remove('modal-open')">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Order Info -->
          <div class="bg-base-200 rounded-lg p-4">
            <h4 class="font-bold text-lg mb-3 flex items-center">
              <i class="fas fa-receipt mr-2 text-primary"></i>
              Order Information
            </h4>
            <div class="space-y-2">
              <p><span class="font-semibold">Order ID:</span> <span class="font-mono text-sm">${order.orderId || order.id}</span></p>
              <p><span class="font-semibold">Date:</span> ${orderDate}</p>
              <p><span class="font-semibold">Status:</span> <span class="badge ${statusBadgeClass} badge-lg ml-2">${order.status || 'pending'}</span></p>
              <p><span class="font-semibold">Total Amount:</span> <span class="text-primary font-bold text-lg">₨${(order.totalAmount || 0).toFixed(2)}</span></p>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-base-200 rounded-lg p-4">
            <h4 class="font-bold text-lg mb-3 flex items-center">
              <i class="fas fa-user mr-2 text-primary"></i>
              Customer Information
            </h4>
            <div class="space-y-2">
              <p><span class="font-semibold">Name:</span> ${order.customerName || 'N/A'}</p>
              <p><span class="font-semibold">Phone:</span> ${order.customerPhone || 'N/A'}</p>
              <p><span class="font-semibold">Address:</span></p>
              <p class="bg-base-100 p-2 rounded">${order.customerAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-base-200 rounded-lg p-4 mb-6">
          <h4 class="font-bold text-lg mb-3 flex items-center">
            <i class="fas fa-shopping-bag mr-2 text-primary"></i>
            Order Items
          </h4>
          <div class="overflow-x-auto">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${(order.items || []).map(item => `
                  <tr>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="avatar">
                          <div class="w-10 h-10 rounded">
                            <img src="${item.image || ''}" alt="${item.name}" />
                          </div>
                        </div>
                        <span class="font-semibold">${item.name}</span>
                        ${item.promotion > 0 ? `<span class="badge badge-error badge-sm">-${item.promotion}%</span>` : ''}
                      </div>
                    </td>
                    <td>
                      ${item.promotion > 0 ? `
                        <div>
                          <span class="text-sm line-through text-gray-500">₨${(item.price || 0).toFixed(2)}</span>
                          <span class="font-semibold text-primary ml-1">₨${((item.price || 0) * (1 - (item.promotion || 0) / 100)).toFixed(2)}</span>
                        </div>
                      ` : `₨${(item.price || 0).toFixed(2)}`}
                    </td>
                    <td>${item.quantity || 1}</td>
                    <td class="font-bold">₨${(((item.price || 0) * (1 - (item.promotion || 0) / 100)) * (item.quantity || 1)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="font-bold">
                  <td colspan="3" class="text-right">Total:</td>
                  <td class="text-primary text-lg">₨${(order.totalAmount || 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Payment Screenshot -->
        ${order.paymentScreenshot ? `
          <div class="bg-base-200 rounded-lg p-4">
            <h4 class="font-bold text-lg mb-3 flex items-center">
              <i class="fas fa-image mr-2 text-primary"></i>
              Payment Proof
            </h4>
            <div class="flex justify-center">
              <img src="${order.paymentScreenshot}" alt="Payment Screenshot" class="max-w-full max-h-96 rounded-lg shadow-lg" />
            </div>
            <div class="mt-3 text-center">
              <a href="${order.paymentScreenshot}" target="_blank" class="btn btn-sm btn-primary">
                <i class="fas fa-external-link-alt mr-2"></i>
                Open in New Tab
              </a>
            </div>
          </div>
        ` : `
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>No payment screenshot available for this order.</span>
          </div>
        `}

        <!-- Actions -->
        <div class="flex gap-2 justify-end mt-6">
          <button class="btn btn-outline" onclick="document.getElementById('product-modal').classList.remove('modal-open')">
            Close
          </button>
          <button class="btn btn-primary" onclick="app.printReceipt('${orderId}')">
            <i class="fas fa-print mr-2"></i>
            Print Receipt
          </button>
        </div>
      `;

      modal.classList.add('modal-open');
    } catch (error) {
      console.error('Error viewing order details:', error);
      this.showNotification('Failed to load order details', 'error');
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      await firebaseService.updateOrderStatus(orderId, newStatus);
      this.showNotification(`Order status updated to ${newStatus}`, 'success');
      
      // Reload orders to reflect changes
      await this.loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      this.showNotification('Failed to update order status', 'error');
    }
  }

  printReceipt(orderId) {
    const order = this.allOrders?.find(o => o.id === orderId);
    if (!order) {
      this.showNotification('Order not found', 'error');
      return;
    }

    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order ${order.orderId || order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
          }
          h1, h2, h3 { color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; font-size: 18px; }
          .text-right { text-align: right; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .badge-pending { background-color: #fef3c7; color: #92400e; }
          .badge-processing { background-color: #dbeafe; color: #1e40af; }
          .badge-completed { background-color: #d1fae5; color: #065f46; }
          .badge-cancelled { background-color: #fee2e2; color: #991b1b; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BeverlyShop</h1>
          <p>E-commerce Platform</p>
          <h2>Order Receipt</h2>
        </div>

        <div class="section">
          <div class="section-title">Order Information</div>
          <p><strong>Order ID:</strong> ${order.orderId || order.id}</p>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Status:</strong> <span class="badge badge-${order.status}">${order.status || 'pending'}</span></p>
        </div>

        <div class="section">
          <div class="section-title">Customer Information</div>
          <p><strong>Name:</strong> ${order.customerName || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
          <p><strong>Address:</strong> ${order.customerAddress || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th class="text-right">Price</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || []).map(item => {
                const effectivePrice = (item.promotion > 0) ? (item.price || 0) * (1 - (item.promotion || 0) / 100) : (item.price || 0);
                return `
                <tr>
                  <td>${item.name}${item.promotion > 0 ? ` (-${item.promotion}%)` : ''}</td>
                  <td class="text-right">₨${effectivePrice.toFixed(2)}</td>
                  <td class="text-right">${item.quantity || 1}</td>
                  <td class="text-right">₨${(effectivePrice * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" class="text-right">Total:</td>
                <td class="text-right">₨${(order.totalAmount || 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="section" style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc;">
          <p>Thank you for your purchase!</p>
          <p style="font-size: 12px; color: #666;">This is a computer-generated receipt.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  switchDashboardTab(tabName) {
    const statsTab = document.getElementById('stats-tab');
    const productsTab = document.getElementById('products-tab');
    const categoriesTab = document.getElementById('categories-tab');
    const ordersTab = document.getElementById('orders-tab');
    const tabs = document.querySelectorAll('#dashboard-content .tab');
    
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    
    // Hide all tabs
    [statsTab, productsTab, categoriesTab, ordersTab].forEach(tab => {
      if (tab) tab.classList.add('hidden');
    });
    
    if (tabName === 'stats') {
      statsTab.classList.remove('hidden');
      tabs[0].classList.add('tab-active');
    } else if (tabName === 'products') {
      productsTab.classList.remove('hidden');
      tabs[1].classList.add('tab-active');
    } else if (tabName === 'categories') {
      categoriesTab.classList.remove('hidden');
      tabs[2].classList.add('tab-active');
      // Load categories when tab is opened
      this.loadCategoriesTab();
    } else if (tabName === 'orders') {
      ordersTab.classList.remove('hidden');
      tabs[3].classList.add('tab-active');
    }
  }

  switchImageInput(type) {
    const urlInput = document.getElementById('image-url-input');
    const fileInput = document.getElementById('image-file-input');
    const tabs = document.querySelectorAll('#product-form .tabs .tab');
    
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    
    if (type === 'url') {
      urlInput.classList.remove('hidden');
      fileInput.classList.add('hidden');
      tabs[0].classList.add('tab-active');
    } else {
      urlInput.classList.add('hidden');
      fileInput.classList.remove('hidden');
      tabs[1].classList.add('tab-active');
    }
  }

  showAddProductForm() {
    const formContainer = document.getElementById('product-form-container');
    const formTitle = document.getElementById('form-title');
    const form = document.getElementById('product-form');
    
    formTitle.textContent = 'Add New Product';
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-instock').checked = true;
    formContainer.classList.remove('hidden');
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    form.onsubmit = (e) => this.handleProductFormSubmit(e);
  }

  cancelProductForm() {
    const formContainer = document.getElementById('product-form-container');
    formContainer.classList.add('hidden');
    document.getElementById('product-form').reset();
  }

  async handleProductFormSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const imageInput = document.getElementById('product-image');
    const imageFile = imageInput.files ? imageInput.files[0] : null;
    
    const productData = {
      name: document.getElementById('product-name').value.trim(),
      category: document.getElementById('product-category').value,
      price: parseFloat(document.getElementById('product-price').value),
      description: document.getElementById('product-description').value.trim(),
      image: document.getElementById('product-image-url')?.value?.trim() || '',
      inStock: document.getElementById('product-instock').checked,
      promotion: parseInt(document.getElementById('product-promotion').value) || 0
    };
    
    try {
      this.showNotification('Saving product...', 'info');
      
      if (productId) {
        // Update existing product
        if (this.firebaseInitialized) {
          await firebaseService.updateProduct(productId, productData, imageFile);
        } else {
          // Fallback for local updates
          const product = this.products.find(p => p.id === productId);
          if (product) {
            Object.assign(product, productData);
          }
        }
        this.showNotification('Product updated successfully!', 'success');
      } else {
        // Add new product
        if (this.firebaseInitialized) {
          await firebaseService.addProduct(productData, imageFile);
        } else {
          // Fallback for local addition
          const newId = Math.max(...this.products.map(p => parseInt(p.id) || 0), 0) + 1;
          this.products.push({
            id: newId.toString(),
            ...productData
          });
        }
        this.showNotification('Product added successfully!', 'success');
      }
      
      this.cancelProductForm();
      
      // Reload products from Firebase
      if (this.firebaseInitialized) {
        await this.loadProducts();
      }
      
      this.renderDashboard();
      this.renderProducts();
      this.renderCategories();
    } catch (error) {
      console.error('Error saving product:', error);
      this.showNotification('Error saving product. Please try again.', 'error');
    }
  }

  viewProduct(productId) {
    this.showProductDetail(productId);
  }

  editProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    
    const formContainer = document.getElementById('product-form-container');
    const formTitle = document.getElementById('form-title');
    const form = document.getElementById('product-form');
    
    formTitle.textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image-url').value = product.image || '';
    document.getElementById('product-instock').checked = product.inStock;
    document.getElementById('product-promotion').value = product.promotion || 0;
    
    // Show URL input by default
    this.switchImageInput('url');
    
    formContainer.classList.remove('hidden');
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    form.onsubmit = (e) => this.handleProductFormSubmit(e);
  }

  async deleteProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        this.showNotification('Deleting product...', 'info');
        
        if (this.firebaseInitialized) {
          await firebaseService.deleteProduct(productId);
        } else {
          // Fallback for local deletion
          this.products = this.products.filter(p => p.id !== productId);
        }
        
        this.showNotification('Product deleted successfully!', 'success');
        
        // Reload products from Firebase
        if (this.firebaseInitialized) {
          await this.loadProducts();
        }
        
        this.renderDashboard();
        this.renderProducts();
        this.renderCategories();
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showNotification('Error deleting product. Please try again.', 'error');
      }
    }
  }

  // ==================== CATEGORY MANAGEMENT METHODS ====================

  async loadCategoriesTab() {
    const listContainer = document.getElementById('categories-list-container');
    if (!listContainer) return;

    try {
      const categories = await firebaseService.getCategories();
      const metadata = await firebaseService.getCategoryMetadata();
      
      await this.renderCategoriesList(categories, metadata);
    } catch (error) {
      console.error('Error loading categories:', error);
      listContainer.innerHTML = `
        <div class="alert alert-error">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>Failed to load categories. Please try again.</span>
        </div>
      `;
    }
  }

  async renderCategoriesList(categories, metadata) {
    const listContainer = document.getElementById('categories-list-container');
    if (!listContainer) return;

    const categoriesWithMeta = categories
      .filter(cat => cat !== 'All') // Don't show 'All' category
      .map(cat => ({
        name: cat,
        color: metadata[cat]?.color || '#3b82f6',
        description: metadata[cat]?.description || '',
        productCount: this.products.filter(p => p.category === cat).length
      }));

    if (categoriesWithMeta.length === 0) {
      listContainer.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle mr-2"></i>
          <span>No categories yet. Click "Add New Category" to create one.</span>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${categoriesWithMeta.map(cat => `
          <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div class="card-body">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3 flex-1">
                  <div class="w-8 h-8 rounded-full" style="background-color: ${cat.color}"></div>
                  <h3 class="card-title text-lg">${cat.name}</h3>
                </div>
                <div class="badge badge-primary badge-lg">${cat.productCount}</div>
              </div>
              
              ${cat.description ? `
                <p class="text-sm text-base-content opacity-70 mb-3">${cat.description}</p>
              ` : ''}
              
              <div class="card-actions justify-between items-center mt-4">
                <button class="btn btn-sm btn-ghost" onclick="app.manageProductsInCategory('${cat.name}')">
                  <i class="fas fa-box mr-1"></i>
                  Manage Products
                </button>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-ghost" onclick="app.editCategory('${cat.name}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-ghost text-error" onclick="app.deleteCategory('${cat.name}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  showAddCategoryForm() {
    const formContainer = document.getElementById('category-form-container');
    const formTitle = document.getElementById('category-form-title');
    const form = document.getElementById('category-form');
    
    if (formContainer && formTitle && form) {
      formTitle.textContent = 'Add New Category';
      form.reset();
      document.getElementById('category-old-name').value = '';
      document.getElementById('category-color').value = '#3b82f6';
      document.getElementById('category-color-hex').value = '#3b82f6';
      formContainer.classList.remove('hidden');
      
      // Setup color picker sync
      this.setupColorPickerSync();
      
      // Setup form submission
      form.onsubmit = (e) => this.handleCategoryFormSubmit(e);
    }
  }

  cancelCategoryForm() {
    const formContainer = document.getElementById('category-form-container');
    if (formContainer) {
      formContainer.classList.add('hidden');
    }
  }

  setupColorPickerSync() {
    const colorPicker = document.getElementById('category-color');
    const colorHex = document.getElementById('category-color-hex');
    
    if (colorPicker && colorHex) {
      colorPicker.addEventListener('input', (e) => {
        colorHex.value = e.target.value;
      });
      
      colorHex.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
          colorPicker.value = hex;
        }
      });
    }
  }

  async handleCategoryFormSubmit(e) {
    e.preventDefault();
    
    const oldName = document.getElementById('category-old-name').value;
    const name = document.getElementById('category-name').value.trim();
    const color = document.getElementById('category-color').value;
    const description = document.getElementById('category-description').value.trim();
    
    if (!name) {
      this.showNotification('Please enter a category name', 'error');
      return;
    }
    
    try {
      const metadata = { color, description };
      
      if (oldName && oldName !== name) {
        // Update existing category
        await firebaseService.updateCategory(oldName, name, metadata);
        this.showNotification('Category updated successfully!', 'success');
      } else if (oldName === name) {
        // Just update metadata
        await firebaseService.saveCategoryMetadata(name, metadata);
        this.showNotification('Category updated successfully!', 'success');
      } else {
        // Add new category
        await firebaseService.addCategory(name, metadata);
        this.showNotification('Category added successfully!', 'success');
      }
      
      this.cancelCategoryForm();
      
      // Reload categories
      if (this.firebaseInitialized) {
        this.categories = await firebaseService.getCategories();
      }
      
      this.loadCategoriesTab();
      this.renderDashboard();
      this.renderCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      this.showNotification('Error saving category. Please try again.', 'error');
    }
  }

  async editCategory(categoryName) {
    const formContainer = document.getElementById('category-form-container');
    const formTitle = document.getElementById('category-form-title');
    const form = document.getElementById('category-form');
    
    if (formContainer && formTitle && form) {
      try {
        const metadata = await firebaseService.getCategoryMetadata();
        const catMeta = metadata[categoryName] || {};
        
        formTitle.textContent = 'Edit Category';
        document.getElementById('category-old-name').value = categoryName;
        document.getElementById('category-name').value = categoryName;
        document.getElementById('category-color').value = catMeta.color || '#3b82f6';
        document.getElementById('category-color-hex').value = catMeta.color || '#3b82f6';
        document.getElementById('category-description').value = catMeta.description || '';
        
        formContainer.classList.remove('hidden');
        
        // Setup color picker sync
        this.setupColorPickerSync();
        
        // Setup form submission
        form.onsubmit = (e) => this.handleCategoryFormSubmit(e);
      } catch (error) {
        console.error('Error loading category for edit:', error);
        this.showNotification('Error loading category. Please try again.', 'error');
      }
    }
  }

  async deleteCategory(categoryName) {
    const productsInCategory = this.products.filter(p => p.category === categoryName).length;
    
    if (productsInCategory > 0) {
      const confirmMsg = `This category has ${productsInCategory} product(s). Deleting it will remove the category from all products. Continue?`;
      if (!confirm(confirmMsg)) return;
    } else {
      if (!confirm(`Are you sure you want to delete the "${categoryName}" category?`)) return;
    }
    
    try {
      await firebaseService.deleteCategory(categoryName);
      this.showNotification('Category deleted successfully!', 'success');
      
      // Reload categories
      if (this.firebaseInitialized) {
        this.categories = await firebaseService.getCategories();
        
        // Update products that had this category
        const productsToUpdate = this.products.filter(p => p.category === categoryName);
        for (const product of productsToUpdate) {
          await firebaseService.updateProduct(product.id, { ...product, category: 'Electronics' });
        }
        
        await this.loadProducts();
      }
      
      this.loadCategoriesTab();
      this.renderDashboard();
      this.renderCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      this.showNotification('Error deleting category. Please try again.', 'error');
    }
  }

  async manageProductsInCategory(categoryName) {
    const modal = document.createElement('div');
    modal.className = 'modal modal-open';
    modal.innerHTML = `
      <div class="modal-box w-11/12 max-w-4xl">
        <h3 class="font-bold text-2xl mb-4">Manage Products in "${categoryName}"</h3>
        <p class="text-sm text-base-content opacity-70 mb-4">
          Select products to add to this category, or uncheck to remove them.
        </p>
        
        <div id="category-products-list" class="max-h-96 overflow-y-auto">
          <div class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        </div>
        
        <div class="modal-action">
          <button class="btn btn-primary" onclick="app.saveCategoryProducts('${categoryName}')">
            <i class="fas fa-save mr-2"></i>
            Save Changes
          </button>
          <button class="btn btn-ghost" onclick="this.closest('.modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load products list
    const productsList = modal.querySelector('#category-products-list');
    const productsHtml = this.products.map(product => {
      const isInCategory = product.category === categoryName;
      return `
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4 hover:bg-base-200 rounded-lg p-3">
            <input type="checkbox" 
                   class="checkbox checkbox-primary" 
                   data-product-id="${product.id}"
                   ${isInCategory ? 'checked' : ''} />
            <div class="flex items-center gap-3 flex-1">
              <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded" />
              <div class="flex-1">
                <span class="label-text font-semibold">${product.name}</span>
                <div class="text-xs opacity-70">Current: ${product.category}</div>
              </div>
              <span class="badge badge-ghost">₨${product.price.toFixed(2)}</span>
            </div>
          </label>
        </div>
      `;
    }).join('');
    
    productsList.innerHTML = productsHtml;
  }

  async saveCategoryProducts(categoryName) {
    const modal = document.querySelector('.modal-open');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    
    try {
      const updates = [];
      
      checkboxes.forEach(checkbox => {
        const productId = checkbox.getAttribute('data-product-id');
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
          const shouldBeInCategory = checkbox.checked;
          const isInCategory = product.category === categoryName;
          
          if (shouldBeInCategory && !isInCategory) {
            // Add to category
            updates.push(firebaseService.updateProduct(productId, { ...product, category: categoryName }));
          } else if (!shouldBeInCategory && isInCategory) {
            // Remove from category (set to default)
            updates.push(firebaseService.updateProduct(productId, { ...product, category: 'Electronics' }));
          }
        }
      });
      
      if (updates.length > 0) {
        await Promise.all(updates);
        this.showNotification('Products updated successfully!', 'success');
        
        // Reload data
        await this.loadProducts();
        this.loadCategoriesTab();
        this.renderDashboard();
        this.renderCategories();
        this.renderProducts();
      }
      
      modal.remove();
    } catch (error) {
      console.error('Error updating products:', error);
      this.showNotification('Error updating products. Please try again.', 'error');
    }
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new EcommerceApp();
});
