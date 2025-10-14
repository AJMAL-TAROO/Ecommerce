# Screenshot Upload Flow Diagram

## Complete Flow Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER CHECKOUT PROCESS                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Customer   │
│  Opens Cart  │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Clicks Checkout │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Checkout Modal Opens (index.html)   │
│                                       │
│  • Payment Screenshot Upload Field   │
│    (id="payment-screenshot")          │
│  • Customer Name Input                │
│  • Phone Number Input                 │
│  • Delivery Address Input             │
└──────┬───────────────────────────────┘
       │
       │  Customer fills form and uploads screenshot
       │
       ▼
┌────────────────────────────────────┐
│  Customer Clicks "Place Order"     │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  handleCheckoutSubmit() (app.js:531)                         │
│                                                               │
│  1. Capture screenshot file:                                 │
│     const screenshot = document.getElementById(              │
│       'payment-screenshot').files[0]                         │
│                                                               │
│  2. Validate form fields                                     │
│  3. Show notification: "Uploading payment screenshot..."     │
│  4. Prepare orderData object                                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  firebaseService.saveOrder(orderData)                        │
│  (firebase-service.js:315)                                   │
│                                                               │
│  1. Create new order reference                               │
│  2. Generate order ID                                        │
│  3. Check if screenshot exists                               │
└──────┬───────────────────────────────────────────────────────┘
       │
       │  if screenshot exists
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  uploadPaymentScreenshot(file)                               │
│  (firebase-service.js:395)                                   │
│                                                               │
│  1. Generate filename: payments/{timestamp}_{filename}       │
│  2. Create Firebase Storage reference                        │
│  3. Upload file to Firebase Storage                          │
│  4. Wait for upload (with 30s timeout)                       │
│  5. Get download URL                                         │
│  6. Return URL                                               │
└──────┬───────────────────────────────────────────────────────┘
       │
       │  screenshotUrl obtained
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Save Order to Firebase Realtime Database                       │
│                                                                  │
│  order = {                                                       │
│    orderId: "...",                                              │
│    customerName: "...",                                         │
│    customerPhone: "...",                                        │
│    customerAddress: "...",                                      │
│    items: [...],                                                │
│    totalAmount: 199.99,                                         │
│    paymentScreenshot: screenshotUrl,  ← Screenshot URL saved!  │
│    status: "pending",                                           │
│    createdAt: timestamp                                         │
│  }                                                              │
└──────┬──────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────┐
│  Order Complete!       │
│  • Clear cart          │
│  • Close modal         │
│  • Show success msg    │
└────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN VIEW ORDER DETAILS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    Admin     │
│  Logs In     │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Opens Orders    │
│ Dashboard Tab   │
└──────┬──────────┘
       │
       ▼
┌────────────────────────────┐
│  Clicks "View Details" on  │
│  an order                  │
└──────┬─────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  viewOrderDetails(orderId) (app.js:1472)                     │
│                                                               │
│  1. Find order in allOrders array                            │
│  2. Get order.paymentScreenshot URL                          │
│  3. Check if URL is from Firebase Storage                    │
└──────┬───────────────────────────────────────────────────────┘
       │
       │  if URL includes 'firebasestorage.googleapis.com'
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  convertToBlobUrl(firebaseUrl) (app.js:1631) ← NEW METHOD!  │
│                                                               │
│  1. Fetch image from Firebase URL                            │
│  2. Convert response to blob                                 │
│  3. Create local blob URL                                    │
│  4. Return blob URL                                          │
│                                                               │
│  Purpose: CSP (Content Security Policy) compatibility        │
└──────┬───────────────────────────────────────────────────────┘
       │
       │  screenshotUrl (blob URL or original URL)
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Display Order Details Modal                                 │
│                                                               │
│  • Order Information                                         │
│  • Customer Information                                      │
│  • Order Items List                                          │
│  • Payment Screenshot:                                       │
│    <img src="${screenshotUrl}" />  ← Screenshot displays!   │
│    [Open in New Tab] button                                  │
└──────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE STORAGE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

firebase-storage-bucket/
└── payments/
    ├── 1710345678901_payment_proof.png
    ├── 1710345789012_screenshot.jpg
    └── 1710345890123_juice_mcb_payment.png


┌─────────────────────────────────────────────────────────────────────────────┐
│                       FIREBASE REALTIME DATABASE                             │
└─────────────────────────────────────────────────────────────────────────────┘

{
  "orders": {
    "order_id_1": {
      "orderId": "order_id_1",
      "customerName": "John Doe",
      "customerPhone": "+1234567890",
      "customerAddress": "123 Main Street",
      "items": [...],
      "totalAmount": 199.99,
      "paymentScreenshot": "https://firebasestorage.googleapis.com/v0/b/ecommerce-66dcb.firebasestorage.app/o/payments%2F1710345678901_payment_proof.png?alt=media&token=...",
      "status": "pending",
      "createdAt": 1710345678901
    }
  }
}


┌─────────────────────────────────────────────────────────────────────────────┐
│                              KEY METHODS                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  handleCheckoutSubmit()        Location: js/app.js:531                  │
│  • Captures screenshot file from input                                  │
│  • Validates form                                                       │
│  • Calls firebaseService.saveOrder()                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  saveOrder()                   Location: js/firebase-service.js:315     │
│  • Uploads screenshot to Firebase Storage                               │
│  • Saves order with screenshot URL to Firebase Database                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  uploadPaymentScreenshot()     Location: js/firebase-service.js:395     │
│  • Uploads file to Firebase Storage                                     │
│  • Returns download URL                                                 │
│  • 30-second timeout protection                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  viewOrderDetails()            Location: js/app.js:1472                 │
│  • Retrieves order from database                                        │
│  • Converts Firebase URL to blob URL                                    │
│  • Displays order details including screenshot                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  convertToBlobUrl()            Location: js/app.js:1631 ← FIXED!        │
│  • Fetches image from Firebase Storage                                  │
│  • Converts to blob URL for CSP compatibility                           │
│  • Graceful fallback to original URL on error                           │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                          ERROR HANDLING                                      │
└─────────────────────────────────────────────────────────────────────────────┘

If screenshot upload fails:
├─ Order is still saved (without screenshot URL)
├─ Error logged to console
└─ User sees generic error message

If blob URL conversion fails:
├─ Original Firebase URL is used
├─ Error logged to console
└─ Screenshot may still display (browser-dependent)

If order submission times out:
├─ User sees error notification
├─ Submit button is re-enabled
└─ User can retry

```

## Summary

✅ **Capture** → Customer uploads screenshot via file input
✅ **Upload** → Screenshot uploaded to Firebase Storage
✅ **Save** → URL saved in order database
✅ **Retrieve** → Order fetched with screenshot URL
✅ **Convert** → URL converted to blob for CSP compliance
✅ **Display** → Screenshot shown in order details modal
