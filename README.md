# BeverlyShop - E-commerce Platform

A fully functional e-commerce platform built with HTML, CSS, JavaScript, TailwindCSS, and DaisyUI components. This project uses Firebase Realtime Database for data storage and Firebase Storage for product images.

## Features

- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🛍️ **Product Catalog**: Browse through a curated collection of products
- 🔍 **Category Filtering**: Filter products by categories (Electronics, Accessories, Sports, Home)
- 🛒 **Shopping Cart**: Add, remove, and update quantities of items in your cart
- 💰 **Real-time Cart Total**: See your total update as you add/remove items
- 📦 **Product Details**: View detailed information about each product
- ⭐ **Product Ratings**: See ratings and reviews for each product
- 💾 **LocalStorage Cart**: Cart persists across browser sessions
- 🎨 **Modern UI**: Beautiful interface using TailwindCSS and DaisyUI components
- ✅ **Stock Management**: Visual indicators for out-of-stock items
- 🔐 **Admin Authentication**: Secure admin panel with Firebase authentication
- 📸 **Image Storage**: Product images stored in Firebase Storage
- 💳 **Order Management**: Payment details and order history stored in Firebase
- 🔥 **Firebase Integration**: Real-time database and cloud storage

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styles and animations
- **JavaScript (ES6+)**: Application logic and interactivity
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on TailwindCSS
- **Font Awesome**: Icon library
- **Firebase Realtime Database**: Cloud-hosted NoSQL database for products, orders, and admin data
- **Firebase Storage**: Cloud storage for product images and payment screenshots
- **Firebase Analytics**: User analytics and insights
- **LocalStorage API**: Client-side cart persistence

## Project Structure

```
Ecommerce/
├── index.html                # Main HTML file
├── js/
│   ├── app.js               # Application logic and functionality
│   ├── firebase-config.js   # Firebase configuration
│   └── firebase-service.js  # Firebase service layer
├── data/
│   └── products.json        # Legacy product data (no longer used)
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for Firebase services)
- A local web server (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AJMAL-TAROO/Ecommerce.git
cd Ecommerce
```

2. The application is configured to use Firebase services. The Firebase configuration is already included in `js/firebase-config.js`.

3. Open with a local server (recommended):
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

4. Open your browser and navigate to `http://localhost:8000`

Alternatively, you can simply open `index.html` directly in your browser.

## Usage

### Browsing Products
- Products are displayed in a grid layout
- Click on category buttons to filter products
- Each product card shows the image, name, price, rating, and availability

### Viewing Product Details
- Click the "Details" button on any product card
- View full product information in a modal
- Add to cart directly from the detail view

### Managing Cart
- Click the cart icon in the navigation bar to open the cart drawer
- Adjust quantities using + and - buttons
- Remove items using the "Remove" button
- View real-time total calculation

### Checkout
- Click the "Checkout" button in the cart
- Upload a screenshot of your Juice by MCB payment confirmation
- Fill in your delivery details
- Submit the order (stored in Firebase Realtime Database)

### Admin Dashboard
- Click on the "BeverlyShop" logo in the navigation bar
- Login with admin credentials (default: username: `admin`, password: `admin123`)
- View statistics and manage products
- Add new products with image upload to Firebase Storage
- Edit or delete existing products

## Firebase Database Structure

The Firebase Realtime Database uses the following structure:

```json
{
  "products": {
    "productId1": {
      "name": "Product Name",
      "category": "Category",
      "price": 99.99,
      "description": "Product description",
      "image": "firebase-storage-url or external-url",
      "inStock": true,
      "createdAt": timestamp,
      "updatedAt": timestamp
    }
  },
  "categories": ["All", "Electronics", "Accessories", "Sports", "Home"],
  "orders": {
    "orderId1": {
      "orderId": "orderId1",
      "customerName": "John Doe",
      "customerPhone": "+1234567890",
      "customerAddress": "123 Main St",
      "items": [...],
      "totalAmount": 199.99,
      "paymentScreenshot": "firebase-storage-url",
      "status": "pending",
      "createdAt": timestamp
    }
  },
  "admin": {
    "username": "admin",
    "password": "admin123",
    "email": "admin@beverlyshop.com",
    "createdAt": timestamp
  }
}
```

## Customization

### Adding New Products
Use the Admin Dashboard to add new products:
1. Click on the BeverlyShop logo and login
2. Navigate to "Product Management" tab
3. Click "Add New Product"
4. Fill in the details and either provide an image URL or upload an image file
5. Images uploaded via file will be stored in Firebase Storage

### Updating Admin Credentials
Admin credentials are stored in Firebase Realtime Database. To change them:
1. Access your Firebase Console
2. Navigate to Realtime Database
3. Update the `admin` node with new credentials

**Note**: In a production environment, passwords should be properly hashed.

### Changing Themes
DaisyUI supports multiple themes. Change the `data-theme` attribute in the `<html>` tag:
```html
<html lang="en" data-theme="dark">
```

Available themes: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter

### Modifying Styles
- Custom CSS is included in the `<style>` tag in `index.html`
- TailwindCSS classes can be modified directly in the HTML
- DaisyUI component classes provide pre-built components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future development:
- User authentication with Firebase Auth
- Enhanced order tracking and management
- Email notifications for orders
- Product search with Firebase queries
- Wishlist feature
- Product reviews and ratings submission
- Multiple product images
- Size and color variants
- Discount codes and coupons
- Password hashing for admin credentials
- Role-based access control

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using HTML, CSS, and JavaScript