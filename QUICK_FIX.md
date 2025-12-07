# 🚀 QUICK DEPLOYMENT FIX

Your API is deployed at: `https://b6-a2-assignment-n56ds707m-nafis-raihans-projects.vercel.app/`
✅ Server is running
❌ Database not connected

## Fix in 5 Minutes - Use Neon (Free PostgreSQL)

### Step 1: Create Free Database
1. Go to [https://neon.tech](https://neon.tech)
2. Click "Sign Up" → Sign in with GitHub
3. Create new project:
   - Name: `vehicle-rental`
   - Region: Choose closest to you
   - Click "Create Project"

### Step 2: Get Connection String
1. On the Neon dashboard, you'll see "Connection string"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Initialize Database Schema
Open your terminal and run:
```bash
# Replace with YOUR connection string from Step 2
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require" < database/schema.sql
```

If you don't have `psql`, use Neon's SQL Editor:
1. Go to Neon dashboard → "SQL Editor"
2. Copy the entire content from `database/schema.sql`
3. Paste and click "Run"

### Step 4: Add to Vercel
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project `b6-a2-assignment`
3. Click on it → Go to "Settings" → "Environment Variables"
4. Add these variables:

```
DATABASE_URL = postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = your_super_secret_random_key_here_use_32_characters
NODE_ENV = production
JWT_EXPIRES_IN = 7d
BCRYPT_SALT_ROUNDS = 10
```

To generate JWT_SECRET, run in terminal:
```bash
openssl rand -base64 32
```

### Step 5: Redeploy
1. In Vercel dashboard → "Deployments" tab
2. Click "..." on the latest deployment → "Redeploy"
3. Wait 1-2 minutes

### Step 6: Test Your API
```bash
# Test 1: Health check
curl https://b6-a2-assignment-n56ds707m-nafis-raihans-projects.vercel.app/

# Test 2: Signup
curl -X POST https://b6-a2-assignment-n56ds707m-nafis-raihans-projects.vercel.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "customer"
  }'

# Test 3: Login
curl -X POST https://b6-a2-assignment-n56ds707m-nafis-raihans-projects.vercel.app/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Alternative: Use Render (Easier - Everything in One Place)

### Option A: Deploy Fresh on Render

1. **Go to [https://render.com](https://render.com)** → Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `vehicle-rental-db`
   - Database: `vehicle_rental`
   - Plan: Free
   - Click "Create Database"
   - **Copy the "External Database URL"**

3. **Initialize Database**
   ```bash
   # In your terminal, paste the External Database URL
   psql "postgresql://..." < database/schema.sql
   ```

4. **Deploy Web Service**
   - Click "New +" → "Web Service"
   - Connect repository: `NafisRaihan/B6A2Assignment`
   - Name: `vehicle-rental-api`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

5. **Add Environment Variables** (in Render)
   ```
   DATABASE_URL = <paste External Database URL>
   JWT_SECRET = <random 32 character string>
   NODE_ENV = production
   JWT_EXPIRES_IN = 7d
   BCRYPT_SALT_ROUNDS = 10
   ```

6. **Get Your URL**
   - After deployment: `https://vehicle-rental-api-xxxx.onrender.com`
   - Update your README.md with this URL

---

## Current Status Summary

✅ **What's Working:**
- GitHub repository: https://github.com/NafisRaihan/B6A2Assignment
- Vercel deployment: https://b6-a2-assignment-n56ds707m-nafis-raihans-projects.vercel.app/
- API server is running
- All routes are configured
- TypeScript compilation works

❌ **What Needs Fixing:**
- Database connection (no DATABASE_URL set in Vercel)
- Environment variables missing in Vercel

⏱️ **Time to Fix:** 5-10 minutes

🎯 **Recommended Action:** Follow "Step 1-6" above with Neon + Vercel

---

## After Deployment

### Create Admin User
Once deployed, create an admin user:

**Method 1: Via Database**
```sql
-- Connect to your database and run:
INSERT INTO users (name, email, password, phone, role) 
VALUES (
  'Admin',
  'admin@example.com',
  '$2b$10$YourBcryptHashedPassword',
  '0000000000',
  'admin'
);
```

**Method 2: Via API then Update**
1. Sign up as customer using the API
2. In database, run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### Test All Endpoints
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete API testing guide.

---

## Need Help?

Common Issues:
- **"Database connection error"** → DATABASE_URL not set or database not initialized
- **"JWT error"** → JWT_SECRET not set
- **"All fields required"** → Include name, email, password, phone, role in signup

