// Firebase Service Module
class FirebaseService {
  constructor() {
    this.app = null;
    this.database = null;
    this.storage = null;
    this.analytics = null;
    this.initialized = false;
  }

  // Initialize Firebase
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Firebase App
      this.app = firebase.initializeApp(firebaseConfig);
      
      // Initialize services
      this.database = firebase.database();
      this.storage = firebase.storage();
      this.analytics = firebase.analytics();
      
      this.initialized = true;
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  // ==================== PRODUCTS OPERATIONS ====================
  
  // Get all products
  async getProducts() {
    try {
      const snapshot = await this.database.ref('products').once('value');
      const productsData = snapshot.val();
      
      if (!productsData) {
        return [];
      }

      // Convert object to array
      return Object.keys(productsData).map(key => ({
        id: key,
        ...productsData[key]
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product
  async getProduct(productId) {
    try {
      const snapshot = await this.database.ref(`products/${productId}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Add new product
  async addProduct(productData, imageFile = null) {
    try {
      // Upload image to Firebase Storage if provided
      let imageUrl = productData.image;
      if (imageFile) {
        imageUrl = await this.uploadProductImage(imageFile);
      }

      // Generate new product ID
      const newProductRef = this.database.ref('products').push();
      const productId = newProductRef.key;

      const newProduct = {
        ...productData,
        image: imageUrl,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };

      await newProductRef.set(newProduct);
      
      return { id: productId, ...newProduct };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(productId, productData, imageFile = null) {
    try {
      // Upload new image if provided
      let imageUrl = productData.image;
      if (imageFile) {
        // Delete old image if it exists in Firebase Storage
        if (productData.image && productData.image.includes('firebase')) {
          await this.deleteProductImage(productData.image);
        }
        imageUrl = await this.uploadProductImage(imageFile);
      }

      const updates = {
        ...productData,
        image: imageUrl,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };

      await this.database.ref(`products/${productId}`).update(updates);
      
      return { id: productId, ...updates };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      // Get product to delete its image
      const product = await this.getProduct(productId);
      
      // Delete image from storage if it's in Firebase Storage
      if (product && product.image && product.image.includes('firebase')) {
        await this.deleteProductImage(product.image);
      }

      // Delete product from database
      await this.database.ref(`products/${productId}`).remove();
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // ==================== STORAGE OPERATIONS ====================

  // Upload product image to Firebase Storage
  async uploadProductImage(file) {
    try {
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${file.name}`;
      const storageRef = this.storage.ref(fileName);
      
      // Upload file
      const snapshot = await storageRef.put(file);
      
      // Get download URL
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Delete product image from Firebase Storage
  async deleteProductImage(imageUrl) {
    try {
      // Extract path from URL
      const storageRef = this.storage.refFromURL(imageUrl);
      await storageRef.delete();
    } catch (error) {
      // If image doesn't exist or is external URL, ignore error
      console.warn('Could not delete image:', error.message);
    }
  }

  // ==================== CATEGORIES OPERATIONS ====================

  // Get all categories
  async getCategories() {
    try {
      const snapshot = await this.database.ref('categories').once('value');
      const categories = snapshot.val();
      return categories || ['All', 'Electronics', 'Accessories', 'Sports', 'Home'];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['All', 'Electronics', 'Accessories', 'Sports', 'Home'];
    }
  }

  // Update categories
  async updateCategories(categories) {
    try {
      await this.database.ref('categories').set(categories);
      return categories;
    } catch (error) {
      console.error('Error updating categories:', error);
      throw error;
    }
  }

  // Get category metadata (enhanced categories with color, description, etc.)
  async getCategoryMetadata() {
    try {
      const snapshot = await this.database.ref('categoryMetadata').once('value');
      return snapshot.val() || {};
    } catch (error) {
      console.error('Error fetching category metadata:', error);
      return {};
    }
  }

  // Save category metadata
  async saveCategoryMetadata(categoryId, metadata) {
    try {
      await this.database.ref(`categoryMetadata/${categoryId}`).set({
        ...metadata,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      });
      return metadata;
    } catch (error) {
      console.error('Error saving category metadata:', error);
      throw error;
    }
  }

  // Delete category metadata
  async deleteCategoryMetadata(categoryId) {
    try {
      await this.database.ref(`categoryMetadata/${categoryId}`).remove();
    } catch (error) {
      console.error('Error deleting category metadata:', error);
      throw error;
    }
  }

  // Add new category
  async addCategory(categoryName, metadata = {}) {
    try {
      const categories = await this.getCategories();
      if (!categories.includes(categoryName)) {
        categories.push(categoryName);
        await this.updateCategories(categories);
      }
      
      // Save metadata if provided
      if (metadata && Object.keys(metadata).length > 0) {
        await this.saveCategoryMetadata(categoryName, metadata);
      }
      
      return categoryName;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(categoryName) {
    try {
      const categories = await this.getCategories();
      const filteredCategories = categories.filter(cat => cat !== categoryName && cat !== 'All');
      
      // Always keep 'All' category
      if (!filteredCategories.includes('All')) {
        filteredCategories.unshift('All');
      }
      
      await this.updateCategories(filteredCategories);
      await this.deleteCategoryMetadata(categoryName);
      
      return filteredCategories;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Update category (rename)
  async updateCategory(oldName, newName, metadata = {}) {
    try {
      const categories = await this.getCategories();
      const index = categories.indexOf(oldName);
      
      if (index !== -1) {
        categories[index] = newName;
        await this.updateCategories(categories);
      }
      
      // Update metadata
      if (oldName !== newName) {
        await this.deleteCategoryMetadata(oldName);
      }
      await this.saveCategoryMetadata(newName, metadata);
      
      // Update all products with the old category
      const products = await this.getProducts();
      for (const product of products) {
        if (product.category === oldName) {
          await this.updateProduct(product.id, { ...product, category: newName });
        }
      }
      
      return newName;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // ==================== ORDERS/PAYMENTS OPERATIONS ====================

  // Save order/payment details
  async saveOrder(orderData) {
    try {
      const orderRef = this.database.ref('orders').push();
      const orderId = orderRef.key;

      // Upload payment screenshot to Firebase Storage
      let screenshotUrl = null;
      if (orderData.screenshot) {
        try {
          screenshotUrl = await this.uploadPaymentScreenshot(orderData.screenshot);
        } catch (uploadErr) {
          console.error('Failed to upload payment screenshot:', uploadErr);
          // Continue to save order even if screenshot upload fails
        }
      }

      const order = {
        orderId: orderId,
        customerName: orderData.name,
        customerPhone: orderData.phone,
        customerAddress: orderData.address,
        items: orderData.cart,
        totalAmount: orderData.total,
        paymentScreenshot: screenshotUrl,
        status: 'pending',
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };

      await orderRef.set(order);
      
      return { id: orderId, ...order };
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }

  // Get all orders
  async getOrders() {
    try {
      const snapshot = await this.database.ref('orders').once('value');
      const ordersData = snapshot.val();
      
      if (!ordersData) {
        return [];
      }

      // Convert object to array and sort by date
      return Object.keys(ordersData)
        .map(key => ({
          id: key,
          ...ordersData[key]
        }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      await this.database.ref(`orders/${orderId}/status`).set(status);
      await this.database.ref(`orders/${orderId}/updatedAt`).set(firebase.database.ServerValue.TIMESTAMP);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Upload payment screenshot
  async uploadPaymentScreenshot(file) {
    try {
      const timestamp = Date.now();
      const fileName = `payments/${timestamp}_${file.name}`;
      const storageRef = this.storage.ref(fileName);
      
      // Create upload task with timeout
      const uploadTask = storageRef.put(file);
      
      // Add timeout to prevent indefinite hanging
      const uploadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error('Upload timeout'));
        }, 30000); // 30 seconds
        
        uploadTask.then(snapshot => {
          clearTimeout(timeout);
          resolve(snapshot);
        }).catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
      });
      
      const snapshot = await uploadPromise;
      
      // Get download URL
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading payment screenshot:', error);
      throw error;
    }
  }

  // ==================== ADMIN AUTHENTICATION ====================

  // Verify admin credentials
  async verifyAdmin(username, password) {
    try {
      const snapshot = await this.database.ref('admin').once('value');
      const adminData = snapshot.val();
      
      if (!adminData) {
        // Create default admin if doesn't exist
        await this.createDefaultAdmin();
        return username === 'admin' && password === 'admin123';
      }

      return adminData.username === username && adminData.password === password;
    } catch (error) {
      console.error('Error verifying admin:', error);
      return false;
    }
  }

  // Create default admin
  async createDefaultAdmin() {
    try {
      const defaultAdmin = {
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        email: 'admin@beverlyshop.com',
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };

      await this.database.ref('admin').set(defaultAdmin);
      console.log('Default admin created');
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  // Update admin credentials
  async updateAdmin(username, password, email) {
    try {
      const updates = {
        username,
        password, // In production, this should be hashed
        email,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };

      await this.database.ref('admin').update(updates);
      return true;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  // ==================== DATA MIGRATION ====================

  // Migrate existing products to Firebase
  async migrateProducts(products) {
    try {
      const batch = {};
      
      products.forEach(product => {
        const productId = this.database.ref('products').push().key;
        batch[`products/${productId}`] = {
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          image: product.image,
          inStock: product.inStock,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
      });

      await this.database.ref().update(batch);
      console.log('Products migrated successfully');
      return true;
    } catch (error) {
      console.error('Error migrating products:', error);
      throw error;
    }
  }

  // Migrate categories to Firebase
  async migrateCategories(categories) {
    try {
      await this.database.ref('categories').set(categories);
      console.log('Categories migrated successfully');
      return true;
    } catch (error) {
      console.error('Error migrating categories:', error);
      throw error;
    }
  }
}

// Create and export global instance
const firebaseService = new FirebaseService();
