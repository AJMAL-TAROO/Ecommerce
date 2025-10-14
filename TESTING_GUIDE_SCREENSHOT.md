# Manual Testing Guide for Screenshot Upload Functionality

## Prerequisites
- Firebase project must be properly configured
- Firebase Storage must have write permissions for authenticated users
- Application must be running on a local server or hosted environment

## Test Scenario 1: Complete Order with Screenshot

### Steps:
1. Open the application in a browser
2. Browse products and add at least one item to the cart
3. Click the cart icon to view cart
4. Click "Checkout" button
5. In the checkout modal:
   - Click "Choose File" for payment screenshot
   - Select an image file (PNG, JPG, etc.)
   - Enter customer name (e.g., "John Doe")
   - Enter phone number (e.g., "+1234567890")
   - Enter delivery address (e.g., "123 Main Street")
6. Click "Place Order" button
7. Wait for processing (should see "Uploading payment screenshot..." notification)

### Expected Results:
- ✅ Order submission should complete successfully
- ✅ Success notification: "Order placed successfully! We will contact you shortly for delivery."
- ✅ Cart should be cleared
- ✅ Checkout modal should close

### Browser Console Checks:
Open browser developer tools (F12) and check console for:
```
Uploading payment screenshot...
{fileName: "...", fileSize: ..., fileType: "..."}
Starting upload to path: payments/...
Upload completed successfully
Download URL obtained: https://firebasestorage.googleapis.com/...
Order saved successfully with ID: ... Screenshot URL: https://...
```

## Test Scenario 2: View Order Details with Screenshot

### Steps:
1. Click "Admin Login" button in navigation
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"
4. Navigate to "Orders" tab in admin dashboard
5. Find the order you just created
6. Click the eye icon (👁️) to view order details

### Expected Results:
- ✅ Order details modal should open
- ✅ Customer information should be displayed
- ✅ Order items should be listed
- ✅ Payment screenshot should be visible in the modal
- ✅ Screenshot should load and display correctly
- ✅ "Open in New Tab" button should be visible below screenshot

### Browser Console Checks:
No errors should appear. If blob URL conversion happens, you should see:
```
No errors (or if any, they should be handled gracefully)
```

## Test Scenario 3: Order Details - No Screenshot Alert

### Steps:
1. Create an order programmatically without a screenshot (for testing)
2. View order details in admin dashboard

### Expected Results:
- ✅ Order details modal should open
- ✅ Alert message should appear: "No payment screenshot available for this order."
- ✅ No broken image or errors

## Test Scenario 4: Screenshot Upload Timeout

### Steps:
1. Disable internet connection or throttle it heavily
2. Try to place an order with a screenshot
3. Wait for timeout (45 seconds)

### Expected Results:
- ✅ Error notification: "Error processing order. Please try again."
- ✅ Submit button should be re-enabled
- ✅ User can retry the order

### Browser Console Checks:
```
Error submitting order: Error: Order submission timeout
```

## Test Scenario 5: Invalid File Type

### Steps:
1. Try to upload a non-image file (e.g., PDF, TXT)
2. Submit the order

### Expected Results:
- HTML5 validation should prevent non-image files from being selected
- If somehow bypassed, the order should still process but may fail gracefully

## Firebase Verification

### Check Firebase Storage:
1. Go to Firebase Console
2. Navigate to Storage
3. Check the `payments/` folder
4. Verify that screenshot files are being uploaded with correct naming: `{timestamp}_{filename}`

### Check Firebase Database:
1. Go to Firebase Console
2. Navigate to Realtime Database
3. Check the `orders/` node
4. Verify that orders have the `paymentScreenshot` field populated with Firebase Storage URLs

Example order structure:
```json
{
  "orderId": "...",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerAddress": "123 Main Street",
  "items": [...],
  "totalAmount": 199.99,
  "paymentScreenshot": "https://firebasestorage.googleapis.com/v0/b/.../payments/1234567890_screenshot.png",
  "status": "pending",
  "createdAt": 1234567890000
}
```

## Troubleshooting

### Screenshot not uploading:
- Check Firebase Storage permissions
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure file size is reasonable (< 5MB recommended)

### Screenshot not displaying:
- Check if `convertToBlobUrl()` method exists in app.js
- Check browser console for CORS or CSP errors
- Verify the screenshot URL is correctly saved in the order
- Check if the image URL is accessible

### Upload timeout:
- Check internet connection
- Increase timeout value in firebase-service.js (line 409)
- Reduce image file size

## Success Criteria

All of the following should be true:
- ✅ Screenshots can be uploaded during checkout
- ✅ Screenshots are stored in Firebase Storage under `payments/` folder
- ✅ Screenshot URLs are saved in order records
- ✅ Screenshots are displayed in order details view
- ✅ No JavaScript errors in browser console
- ✅ User receives appropriate feedback during upload process
- ✅ Error handling works gracefully

## Known Limitations

1. **File Size**: Very large images (> 10MB) may timeout. Consider implementing image compression.
2. **Network**: Slow connections may cause timeouts. Consider increasing timeout values.
3. **CSP**: Some hosting platforms may have strict CSP policies. The blob URL conversion helps mitigate this.

## Next Steps for Production

1. **Image Compression**: Implement client-side image compression before upload
2. **Progress Indicator**: Show upload progress percentage
3. **Retry Logic**: Implement automatic retry for failed uploads
4. **Validation**: Add file size validation (max 5-10MB)
5. **Security**: Ensure Firebase Security Rules are properly configured
