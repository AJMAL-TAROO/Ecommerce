# Manual Testing Guide - Screenshot Upload Fix

## Quick Test Checklist

### Prerequisites
- Open the website in a browser
- Open browser Developer Console (F12) to see logs
- Have test images ready (see below)

### Test Images Needed
1. **Small image** (< 500KB) - e.g., a small screenshot
2. **Medium image** (1-3MB) - e.g., a phone photo
3. **Large image** (5-10MB) - e.g., a high-res photo
4. **Very large image** (> 10MB) - e.g., a DSLR photo
5. **Non-image file** (e.g., a PDF or text file)

## Test Cases

### Test 1: Small Image Upload (< 500KB)
**Steps:**
1. Add any item to cart
2. Go to checkout
3. Upload a small screenshot (< 500KB)
4. Fill in name, phone, address
5. Click "Complete Order"

**Expected Results:**
- ✅ Console shows: "Image is already small enough, no compression needed"
- ✅ Button shows "Processing..." briefly
- ✅ Order completes successfully within 5-10 seconds
- ✅ Success notification appears
- ✅ Cart is cleared
- ✅ Modal closes

### Test 2: Medium Image Upload (1-3MB)
**Steps:**
1. Add any item to cart
2. Go to checkout
3. Upload a typical phone photo (1-3MB)
4. Fill in name, phone, address
5. Click "Complete Order"

**Expected Results:**
- ✅ Console shows: "Compressing image: [filename] Original size: X.XX MB"
- ✅ Console shows: "Compressed size: Y.YY MB at quality: 0.X"
- ✅ Console shows: "Image compressed from XXX KB to YYY KB"
- ✅ Button shows "Optimizing image..." for 1-3 seconds
- ✅ Button changes to "Processing..."
- ✅ Order completes successfully within 10-20 seconds
- ✅ Image size reduced by ~70-90%

### Test 3: Large Image Upload (5-10MB)
**Steps:**
1. Add any item to cart
2. Go to checkout
3. Upload a high-resolution photo (5-10MB)
4. Fill in name, phone, address
5. Click "Complete Order"

**Expected Results:**
- ✅ Console shows compression process (multiple quality attempts)
- ✅ Button shows "Optimizing image..." for 3-5 seconds
- ✅ Console shows significant size reduction
- ✅ Order completes successfully within 20-30 seconds
- ✅ Final uploaded file is ~500KB-1MB

### Test 4: Very Large Image (> 10MB)
**Steps:**
1. Add any item to cart
2. Go to checkout
3. Try to upload a very large image (> 10MB)
4. Fill in name, phone, address
5. Click "Complete Order"

**Expected Results:**
- ✅ Error notification appears immediately
- ✅ Message says: "Image is too large (max 10MB). Please choose a smaller image."
- ✅ Order is NOT submitted
- ✅ Button remains enabled
- ✅ User can fix and retry

### Test 5: Non-Image File
**Steps:**
1. Add any item to cart
2. Go to checkout
3. Try to upload a PDF or text file
4. Fill in name, phone, address
5. Click "Complete Order"

**Expected Results:**
- ✅ Error notification appears immediately
- ✅ Message says: "Please upload a valid image file"
- ✅ Order is NOT submitted
- ✅ Button remains enabled
- ✅ User can fix and retry

### Test 6: Verify in Admin Dashboard
**Steps:**
1. Complete an order with a screenshot
2. Log into admin dashboard
3. View the order

**Expected Results:**
- ✅ Order appears in dashboard
- ✅ Payment screenshot is visible
- ✅ Image loads quickly
- ✅ Image is clear and readable

### Test 7: Slow Connection Simulation
**Steps:**
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Add item to cart and go to checkout
5. Upload a medium image (2-3MB)
6. Complete order

**Expected Results:**
- ✅ Compression still works quickly (local process)
- ✅ Upload takes longer but completes within 90 seconds
- ✅ Console shows upload progress percentages
- ✅ Order completes successfully
- ✅ No timeout errors

## Console Logs to Verify

### Successful Upload Logs:
```
Image is already small enough, no compression needed
OR
Compressing image: photo.jpg Original size: 3.20 MB
Compressed size: 0.85 MB at quality: 0.8
Final compressed size: 0.85 MB
Image compressed from 3200 KB to 850 KB

Starting payment screenshot upload: photo.jpg Size: 891234
Storage reference created: payments/1234567890_photo.jpg
Upload progress: 25.0%
Upload progress: 50.0%
Upload progress: 75.0%
Upload progress: 100.0%
Upload successful: payments/1234567890_photo.jpg
Download URL obtained: https://...
Payment screenshot uploaded successfully: https://...
Order saved successfully to database
```

### Error Case Logs:
```
Image compression failed, using original: [error message]
OR
Upload timeout: Payment screenshot upload took too long
OR
Upload failed: storage/unauthorized Permission denied
```

## Performance Benchmarks

### Expected Upload Times (with good connection):
- **500KB file:** 2-5 seconds
- **1MB file:** 3-8 seconds
- **2MB file (compressed to 800KB):** 5-10 seconds
- **5MB file (compressed to 700KB):** 5-12 seconds

### With Slow Connection (3G):
- **Compressed file (500-1000KB):** 15-45 seconds
- Should complete within 90-second timeout

## Troubleshooting

### Issue: "Upload timeout" Error Still Occurs
**Possible Causes:**
- Very poor connection (< 1 Mbps)
- Firebase Storage rules not configured
- Image file is corrupted

**Solutions:**
1. Check Firebase Storage rules allow writes
2. Try with a different image
3. Check network connection speed
4. Look for additional error messages in console

### Issue: Image Compression Fails
**Symptoms:**
- Console shows "Image compression failed, using original"

**Impact:**
- Original file is used (slower upload but still works)
- May timeout on very slow connections

**Solutions:**
- Usually not a problem - fallback works
- If persistent, check browser compatibility

### Issue: Image Quality Too Low After Compression
**Solution:**
- This is expected for very large files
- Compression targets ~1MB max for upload speed
- Original quality is not needed for payment screenshots
- Screenshots remain readable and valid

## Success Criteria

All tests pass if:
- ✅ Small images upload quickly without compression
- ✅ Large images are compressed automatically (70-90% reduction)
- ✅ Very large files are rejected with clear error
- ✅ Non-image files are rejected with clear error
- ✅ Upload completes within timeout period
- ✅ Orders appear in admin dashboard with screenshots
- ✅ No console errors (warnings are OK)
- ✅ Button resets properly after success or error

## Reporting Issues

If any test fails, please report with:
1. Browser name and version
2. Test case that failed
3. Complete console logs
4. Screenshot of error message
5. Image file size that was tested
6. Network connection speed (if known)
