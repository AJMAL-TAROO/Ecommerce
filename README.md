# ShopHub - E-commerce Platform

A fully functional e-commerce platform built with HTML, CSS, JavaScript, TailwindCSS, and DaisyUI components. This project uses a mocked Firebase Realtime Database approach with a local JSON file for data storage.

## Features

- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🛍️ **Product Catalog**: Browse through a curated collection of products
- 🔍 **Category Filtering**: Filter products by categories (Electronics, Accessories, Sports, Home)
- 🛒 **Shopping Cart**: Add, remove, and update quantities of items in your cart
- 💰 **Real-time Cart Total**: See your total update as you add/remove items
- 📦 **Product Details**: View detailed information about each product
- ⭐ **Product Ratings**: See ratings and reviews for each product
- 💾 **Local Storage**: Cart persists across browser sessions
- 🎨 **Modern UI**: Beautiful interface using TailwindCSS and DaisyUI components
- ✅ **Stock Management**: Visual indicators for out-of-stock items

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styles and animations
- **JavaScript (ES6+)**: Application logic and interactivity
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on TailwindCSS
- **Font Awesome**: Icon library
- **LocalStorage API**: Client-side data persistence

## Project Structure

```
Ecommerce/
├── index.html          # Main HTML file
├── js/
│   └── app.js         # Application logic and functionality
├── data/
│   └── products.json  # Mock product database
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AJMAL-TAROO/Ecommerce.git
cd Ecommerce
```

2. Open with a local server (recommended):
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

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
- Confirm your order in the popup dialog
- Cart is cleared after successful checkout

## Mock Data Structure

The `products.json` file simulates a Firebase Realtime Database structure:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "category": "Category",
      "price": 99.99,
      "description": "Product description",
      "image": "image-url",
      "inStock": true,
      "rating": 4.5,
      "reviews": 100
    }
  ],
  "categories": ["All", "Electronics", "Accessories", "Sports", "Home"]
}
```

## Customization

### Adding New Products
Edit the `data/products.json` file and add new product objects following the existing structure.

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
- User authentication
- Real Firebase integration
- Payment gateway integration
- Order history
- Product search functionality
- Wishlist feature
- Product reviews and ratings submission
- Admin panel for product management
- Multiple product images
- Size and color variants
- Discount codes and coupons

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using HTML, CSS, and JavaScript