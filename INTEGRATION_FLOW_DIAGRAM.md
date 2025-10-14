# Firebase Integration Flow Diagram

## Complete Order Submission Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT CHECKOUT                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   User fills form:      │
                    │   - Name                │
                    │   - Phone               │
                    │   - Address             │
                    │   - Payment Screenshot  │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Click "Complete Order" │
                    └─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         VALIDATION                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │  Check all fields filled│
                    │  Check file is image    │
                    │  Check file < 10MB      │
                    └─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      IMAGE COMPRESSION                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │  If file > 800KB:       │
                    │  - Resize to max 1920px │
                    │  - Compress to JPEG     │
                    │  - Target size: ~1MB    │
                    │  - Reduce 70-90% size   │
                    └─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FIREBASE INTEGRATION                             │
│                    (firebaseService.saveOrder)                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
        ┌─────────────────────┐     ┌─────────────────────┐
        │  FIREBASE STORAGE   │     │ REALTIME DATABASE   │
        │                     │     │                     │
        │  Upload Screenshot: │     │  Save Order Data:   │
        │  payments/          │     │  /orders/{id}       │
        │  timestamp_file.jpg │     │  - customerName     │
        │                     │     │  - customerPhone    │
        │  Get Download URL   │     │  - customerAddress  │
        └─────────────────────┘     │  - items[]          │
                    │               │  - totalAmount      │
                    │               │  - screenshot URL   │
                    └───────┬───────┴  - status: pending  │
                            │          │  - createdAt       │
                            ▼          └─────────────────────┘
                    ┌─────────────────────────┐
                    │   Order Saved!          │
                    │   Return orderId        │
                    └─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT RESPONSE                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │  Clear cart             │
                    │  Close modal            │
                    │  Show success message   │
                    │  Re-enable button       │
                    └─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │  Admin opens dashboard  │
                    │  Triple-click logo or   │
                    │  Ctrl+Shift+A           │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Login with credentials │
                    │  (admin/admin123)       │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Navigate to "Orders"   │
                    │  tab in dashboard       │
                    └─────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────┐
        │  firebaseService.getOrders()            │
        │  Fetch from /orders in Realtime DB      │
        └─────────────────────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────────────────────────────┐
        │  Display Orders with:                   │
        │  - Order statistics                     │
        │  - Customer details                     │
        │  - Items ordered                        │
        │  - Total amount                         │
        │  - Payment screenshot (from Storage)    │
        │  - Order status                         │
        │  - Status update controls               │
        └─────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      IF SCREENSHOT UPLOAD FAILS                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │  Store error message:   │
                    │  screenshotUploadError  │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Still save order data  │
                    │  to Realtime Database   │
                    │  (graceful degradation) │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Show warning to user:  │
                    │  "Order placed but      │
                    │   screenshot failed"    │
                    └─────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Admin sees error in    │
                    │  dashboard with details │
                    │  Can follow up manually │
                    └─────────────────────────┘
```

## Key Integration Points

1. **Client → Firebase Realtime Database**
   - Path: `/orders/{orderId}`
   - Data: Customer info, cart items, total, status, timestamps

2. **Client → Firebase Storage**
   - Path: `payments/{timestamp}_{filename}`
   - Data: Compressed payment screenshot (JPEG)

3. **Firebase → Admin Dashboard**
   - Real-time order display
   - Payment screenshot preview
   - Status management

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Database**: Firebase Realtime Database
- **Storage**: Firebase Storage
- **Image Processing**: HTML5 Canvas API
- **UI Framework**: DaisyUI + Tailwind CSS
