# Image Upload Setup - Cloudinary

## Quick Setup (Free Tier)

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up with your email
3. Verify your email

### Step 2: Get Your Cloudinary Details
1. Go to https://cloudinary.com/console/settings/upload
2. Find your **Cloud Name** (looks like: `ab12345cd`)
3. Create an **Unsigned Upload Preset**:
   - Go to https://cloudinary.com/console/settings/upload#unsigned_mode
   - Click "Create unsigned preset"
   - Name it: `greenmarket_unsigned`
   - Save it

### Step 3: Update Frontend Code
Once you have your Cloud Name, update this line in `greenmarket-frontend/src/pages/AddItem.jsx`:

```javascript
// Line ~107 in AddItem.jsx - Replace 'greenmarket' with your actual Cloud Name
const cloudinaryResponse = await fetch(
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',  // ← Change here
  {
    method: 'POST',
    body: cloudinaryData
  }
);
```

### Features Enabled:
✅ Upload up to 3 images per item
✅ Images stored in Cloudinary (free tier: 25GB storage)
✅ Automatic image optimization
✅ Works without backend file upload infrastructure

### Limits:
- Free tier: 25GB storage, 25 uploads/hour
- Max file size: 100MB per file
- Supported formats: JPG, PNG, GIF, WEBP, etc.

### Test It Out:
1. Go to your app's "Donate Item" page
2. Fill in the form and add images
3. Click "Donate Item"
4. Images will upload to Cloudinary and be stored in the database

## Troubleshooting:
- If images don't upload: Check your Cloud Name is correct
- If upload preset error: Make sure you created the unsigned preset with exact name `greenmarket_unsigned`
- To debug: Check browser console (F12) for fetch errors
