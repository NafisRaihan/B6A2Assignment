# Deployment Guide

## Option 1: Deploy to Render (Recommended - Includes Free PostgreSQL)

### Step 1: Create Account
1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `vehicle-rental-db`
3. Database: `vehicle_rental`
4. User: `vehicle_rental_user`
5. Region: Choose closest to you
6. Plan: **Free**
7. Click "Create Database"
8. **IMPORTANT**: Copy the "External Database URL" - you'll need this!

### Step 3: Initialize Database Schema
1. Once database is created, go to database dashboard
2. Click "Connect" → Copy the PSQL command
3. On your local terminal, run:
```bash
# Connect to your Render database
psql <paste-the-connection-string-here>

# Then paste the entire schema from database/schema.sql
# Or you can run:
psql <connection-string> < database/schema.sql
```

### Step 4: Deploy Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `NafisRaihan/B6A2Assignment`
3. Configure:
   - **Name**: `vehicle-rental-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   DATABASE_URL=<paste your External Database URL from Step 2>
   JWT_SECRET=<generate a random string - use: openssl rand -base64 32>
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=10
   ```

5. Click "Create Web Service"

### Step 5: Get Your Live URL
- Once deployed, you'll see your URL: `https://vehicle-rental-api-xxxx.onrender.com`
- Copy this URL and update your README.md

---

## Option 2: Deploy to Railway (Alternative)

### Step 1: Create Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `NafisRaihan/B6A2Assignment`

### Step 3: Add PostgreSQL
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will create and link the database automatically

### Step 4: Initialize Database
1. Click on PostgreSQL service → "Data" tab → "Query"
2. Paste the content from `database/schema.sql` and execute

### Step 5: Configure Web Service
1. Click on your web service
2. Go to "Settings" → Add these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<random-secret-key>
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=10
   ```
3. Note: DATABASE_URL is automatically added by Railway

### Step 6: Configure Build
1. Settings → "Deploy" 
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`

### Step 7: Deploy
1. Click "Deploy"
2. Your URL will be: `https://your-project.up.railway.app`

---

## Option 3: Deploy to Vercel + Neon Database

### Step 1: Create Neon Database
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up (free tier)
3. Create new project: "vehicle-rental"
4. Copy the connection string (starts with `postgresql://`)

### Step 2: Initialize Database
```bash
psql "<your-neon-connection-string>" < database/schema.sql
```

### Step 3: Deploy to Vercel
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login and deploy:
```bash
cd /Users/nafisraihan/Desktop/Last\ Try/B6A2Assignment
vercel login
vercel
```

3. Add environment variables:
```bash
vercel env add DATABASE_URL
# Paste your Neon connection string

vercel env add JWT_SECRET
# Enter a random secret

vercel env add NODE_ENV
# Enter: production

vercel env add JWT_EXPIRES_IN
# Enter: 7d

vercel env add BCRYPT_SALT_ROUNDS
# Enter: 10
```

4. Deploy to production:
```bash
vercel --prod
```

---

## Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://your-deployment-url.com/
```
Should return:
```json
{
  "message": "Vehicle Rental System API",
  "status": "running"
}
```

### 2. Test Signup
```bash
curl -X POST https://your-deployment-url.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 3. Test Login
```bash
curl -X POST https://your-deployment-url.com/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Create Admin User (Important!)
After deployment, create an admin user via database:
```sql
INSERT INTO users (name, email, password_hash, role) 
VALUES (
  'Admin',
  'admin@example.com',
  -- Use bcrypt to hash 'admin123' - you can use an online bcrypt generator
  '$2b$10$YourHashedPasswordHere',
  'admin'
);
```

Or use the signup endpoint and then update the role in database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Common Issues & Solutions

### Issue 1: "Database connection failed"
- Check DATABASE_URL is correctly set
- Verify database is running
- Check if schema is initialized

### Issue 2: "JWT secret missing"
- Add JWT_SECRET environment variable
- Generate with: `openssl rand -base64 32`

### Issue 3: "Build failed"
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies are in package.json

### Issue 4: "SSL connection error"
- For Render/Railway/Neon: SSL is required
- Make sure `ssl: { rejectUnauthorized: false }` is in config

---

## Quick Deploy Summary

**Fastest Option**: Render
1. Create Render account
2. Create PostgreSQL database (free)
3. Run schema initialization
4. Deploy from GitHub
5. Add environment variables
6. Done! Get your URL

**Your Live URL Format**:
- Render: `https://vehicle-rental-api-xxxx.onrender.com`
- Railway: `https://your-project.up.railway.app`
- Vercel: `https://your-project.vercel.app`

