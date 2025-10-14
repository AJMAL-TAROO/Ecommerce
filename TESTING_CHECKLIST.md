# Testing Guide for Firebase Checkout Integration

## Prerequisites

1. Firebase project must be configured with:
   - Realtime Database enabled
   - Storage enabled with public read rules for `payments/` folder
   - Correct Firebase credentials in `js/firebase-config.js`

2. Application should be served via HTTP/HTTPS (not `file://`)

## Test Scenarios

### Scenario 1: Successful Order with Screenshot

**Steps:**
1. Open the application in a browser
2. Add one or more products to cart (click "Add to Cart")
3. Click the cart icon (top right) to open cart drawer
4. Click "Checkout" button
5. Fill in all required fields:
   - Upload a payment screenshot (JPG/PNG, < 10MB)
   - Enter full name
   - Enter phone number
   - Enter delivery address
6. Click "Complete Order"

**Expected Results:**
- Button shows "Processing..." with spinner
- If image > 800KB, notification: "Compressing image for faster upload..."
- Cart clears and modal closes within 2 minutes
- Success notification: "Order placed successfully! We will contact you shortly for delivery."
- Cart count resets to 0

**Verify in Firebase Console:**
1. Go to Realtime Database → `orders` node
   - Should see new order with orderId
   - Contains: customerName, customerPhone, customerAddress, items, totalAmount
   - `paymentScreenshot` contains download URL
   - `status` is "pending"
   - `createdAt` timestamp is present

2. Go to Storage → `payments/` folder
   - Should see uploaded screenshot with timestamp prefix
   - File size should be optimized (typically < 1MB)

**Verify in Admin Dashboard:**
1. Triple-click the "DodoShop" logo OR press Ctrl+Shift+A
2. Login with: username: `admin`, password: `admin123`
3. Click "Orders" tab
4. Verify:
   - Order appears in list with correct details
   - Click "View Details" button
   - Payment screenshot displays correctly
   - Can open screenshot in new tab

### Scenario 2: Order with Large Screenshot (Compression Test)

**Steps:**
1. Prepare a large image (e.g., 5MB JPG from a smartphone)
2. Follow Scenario 1 steps but use the large image

**Expected Results:**
- Notification: "Compressing image for faster upload..."
- Image is automatically compressed before upload
- Upload completes successfully
- Console logs show: "Compression complete: XXXKB → YYYKB"

**Verify:**
- Check Firebase Storage - uploaded file should be smaller (typically < 1MB)
- Image quality should be acceptable

### Scenario 3: Invalid File Type

**Steps:**
1. Attempt to upload a PDF or text file as payment screenshot
2. Try to submit

**Expected Results:**
- Error notification: "Please upload a valid image file"
- Form does not submit
- Button remains enabled for retry

### Scenario 4: File Too Large

**Steps:**
1. Attempt to upload an image larger than 10MB
2. Try to submit

**Expected Results:**
- Error notification: "Image is too large (max 10MB). Please choose a smaller image."
- Form does not submit
- Button remains enabled for retry

### Scenario 5: Screenshot Upload Failure (Simulated)

**Steps:**
1. Temporarily disable internet connection after clicking "Complete Order"
2. Observe behavior

**Expected Results:**
- Order submission eventually times out (120 seconds)
- Error notification appears
- Button is re-enabled
- Can retry submission

**Note:** In production, if screenshot upload fails but order data saves:
- Warning notification: "Order placed successfully! Note: Payment screenshot upload failed..."
- Order saves to database without screenshot
- Admin sees error message in dashboard

### Scenario 6: Network Timeout

**Steps:**
1. Use browser dev tools to throttle network to "Slow 3G"
2. Submit order with payment screenshot
3. Wait for completion

**Expected Results:**
- Should complete within 120 seconds
- Progress logs visible in console
- Order saves successfully

### Scenario 7: Missing Required Fields

**Steps:**
1. Try to submit with empty name field
2. Try to submit with empty phone field
3. Try to submit with empty address field
4. Try to submit without screenshot

**Expected Results:**
- Error notification: "Please fill in all required fields"
- Form does not submit
- Highlights missing field

### Scenario 8: Admin Dashboard Orders Display

**Steps:**
1. Submit 2-3 test orders
2. Open admin dashboard (triple-click logo)
3. Login (admin/admin123)
4. Navigate to "Orders" tab

**Expected Results:**
- All orders display in table
- Order statistics show correct counts
- Can filter by status (All, Pending, Processing, Completed, Cancelled)
- Can search by customer name, phone, or order ID
- Click "View Details" shows full order with screenshot

### Scenario 9: Order Status Management

**Steps:**
1. Open admin dashboard
2. View order details
3. Update status (Pending → Processing → Completed)

**Expected Results:**
- Status updates in Realtime Database
- Statistics update immediately
- Changes persist after refresh

## Console Logs to Monitor

During successful order submission, you should see:

```
Submitting order: {name: "...", phone: "...", address: "...", items: 1, total: 79.99, screenshotSize: "234KB"}
Image is small enough, skipping compression
  OR
Compressing image for faster upload...
Compressed with quality 0.8: 512KB
Compression complete: 2048KB → 512KB

Saving order: -NXYZabc123
Attempting to upload payment screenshot...
Starting payment screenshot upload: payment.jpg Size: 524288
Storage reference created: payments/1697234567890_payment.jpg
Upload progress: 25.0%
Upload progress: 50.0%
Upload progress: 75.0%
Upload progress: 100.0%
Upload successful: payments/1697234567890_payment.jpg
Download URL obtained: https://firebasestorage.googleapis.com/...
Payment screenshot uploaded successfully: https://firebasestorage.googleapis.com/...
Order saved successfully to database
Order saved successfully: -NXYZabc123
```

## Common Issues & Solutions

### Issue: "Order submission timeout"
**Solution:** 
- Check internet connection
- Verify Firebase credentials
- Check Firebase Storage rules allow uploads
- Reduce image size

### Issue: "Failed to load orders in admin dashboard"
**Solution:**
- Check Firebase Realtime Database rules allow read access
- Verify admin is authenticated
- Check browser console for errors

### Issue: Screenshot not displaying in admin dashboard
**Solution:**
- Check Firebase Storage rules allow public read
- Verify download URL was saved to database
- Check image was actually uploaded to Storage

### Issue: Button stays in "Processing" state
**Solution:**
- This should be fixed with current implementation
- Button should reset within 120 seconds
- Check browser console for errors

## Performance Benchmarks

**Expected timings:**
- Small image (< 800KB): 5-15 seconds total
- Large image (2-5MB): 10-30 seconds (includes compression)
- Very large image (5-10MB): 20-60 seconds (includes compression)
- Order save to database: 1-2 seconds
- Screenshot upload: 3-15 seconds (depending on size and connection)

## Firebase Storage Rules (Recommended)

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /payments/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if true; // Restrict in production
    }
  }
}
```

## Firebase Database Rules (Recommended)

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true,
      "$orderId": {
        ".validate": "newData.hasChildren(['customerName', 'customerPhone', 'customerAddress', 'items', 'totalAmount', 'status', 'createdAt'])"
      }
    },
    "products": {
      ".read": true,
      ".write": true
    },
    "categories": {
      ".read": true,
      ".write": true
    },
    "admin": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Automated Testing

Run the included test script:

```bash
node /tmp/test-checkout-integration.js
```

This validates:
- ✓ compressImage method exists
- ✓ handleCheckoutSubmit is async
- ✓ Firebase saveOrder is called
- ✓ Image type validation exists
- ✓ File size validation exists (10MB)
- ✓ Button state management exists
- ✓ Order timeout handling exists (120 seconds)
- ✓ Error handling exists
- ✓ Image compression is called
