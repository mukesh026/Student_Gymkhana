# How to Run the Student Gymkhana Project

## Quick Start Guide

Follow these steps to run your project and demonstrate it working.

---

## Method 1: Using VS Code (Recommended)

### Step 1: Open Project in VS Code
1. Open **Visual Studio Code**
2. Go to `File` → `Open Folder`
3. Select `d:\Website\Student_Gymkhana`

### Step 2: Open Integrated Terminal
- Press **`Ctrl + ` `** (backtick key, below Esc)
- Or go to `Terminal` → `New Terminal`

### Step 3: Start Backend Server
In the terminal, type:
```bash
cd backend
npm start
```

**Expected Output:**
```
Server started at PORT 3300
Connection established
```

✅ **Keep this terminal running!**

### Step 4: Open Second Terminal
- Click the **`+`** button in the terminal panel (top-right corner)
- Or press **`Ctrl + Shift + ` `**

### Step 5: Start Frontend Server
In the new terminal, type:
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

Local:            http://localhost:3000
```

Your browser will automatically open to `http://localhost:3000`

---

## Method 2: Using Two Separate Command Prompts

### Terminal 1 - Backend
1. Press `Win + R`, type `cmd`, press Enter
2. Navigate to backend:
   ```cmd
   cd /d d:\Website\Student_Gymkhana\backend
   npm start
   ```
3. **Keep this window open**

### Terminal 2 - Frontend
1. Press `Win + R`, type `cmd`, press Enter
2. Navigate to frontend:
   ```cmd
   cd /d d:\Website\Student_Gymkhana\frontend
   npm start
   ```
3. Browser will open automatically

---

## Method 3: Using PowerShell

### Terminal 1 - Backend
```powershell
cd d:\Website\Student_Gymkhana\backend
npm start
```

### Terminal 2 - Frontend
```powershell
cd d:\Website\Student_Gymkhana\frontend
npm start
```

---

## ⚠️ Before Running - Prerequisites

### 1. Check Node.js Installation
Open terminal and run:
```bash
node --version
npm --version
```

**Expected:** Should show version numbers (e.g., v18.x.x, 9.x.x)

**If not found:**
- Download from: https://nodejs.org/
- Install LTS version
- Restart your computer
- Try again

### 2. Check MySQL is Running

**Option A: Using Services**
1. Press `Win + R`
2. Type `services.msc`
3. Press Enter
4. Look for "MySQL" or "MySQL80"
5. Status should be "Running"
6. If not, right-click → Start

**Option B: Using Command**
```powershell
Get-Service -Name MySQL* | Select-Object Name, Status
```

### 3. Verify Database Exists

Open MySQL command line or MySQL Workbench:
```sql
SHOW DATABASES;
```

You should see `gymkhana` in the list.

**If not:**
```sql
CREATE DATABASE gymkhana;
USE gymkhana;
SOURCE d:/Website/Student_Gymkhana/backend/database/database.sql;
```

### 4. Check Database Credentials

Open `backend/database/connection.js` and verify:
- **host**: "localhost" ✓
- **user**: "root" (or your MySQL username)
- **password**: "alpha" (or your MySQL password)

**Update if needed!**

---

## 🎯 What to Demonstrate

Once both servers are running, you can show:

### 1. Homepage (`http://localhost:3000`)
- Navigation menu
- Featured events
- Hero section

### 2. User Registration (`/signup`)
- Fill in:
  - Roll Number: `B22CS001`
  - Name: `Test User`
  - Email: `test@iitj.ac.in`
  - Password: `test123`
- Click Sign Up

### 3. Login (`/login`)
- Use the credentials you just created
- Or use existing user from database

### 4. Events Page (`/events`)
- View all events
- Filter by status (upcoming/ongoing/completed)

### 5. News & Stories (`/news-and-stories`)
- Browse campus news
- Read stories

### 6. Team Directory (`/team`)
- View team members
- See social media links

### 7. Notice Board (`/noticeboard`)
- Important announcements

### 8. Contact Form (`/contact`)
- Submit feedback

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart computer
- Try again

### Problem: "Cannot connect to MySQL"
**Solution:** MySQL is not running
- Start MySQL service (see Prerequisites section)
- Check credentials in `connection.js`

### Problem: "Port 3000 already in use"
**Solution:** Another app is using the port
- Close other applications
- Or change port in `package.json`

### Problem: "Module not found"
**Solution:** Dependencies not installed
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Problem: Backend starts but shows errors
**Solution:** Check the error message
- Usually database connection issue
- Verify MySQL is running
- Check credentials in `connection.js`

---

## 📹 Recording a Demo

### Option 1: Screen Recording
1. Press `Win + G` (Windows Game Bar)
2. Click record button
3. Navigate through the application
4. Stop recording
5. Video saved to `Videos/Captures` folder

### Option 2: Using OBS Studio
1. Download OBS Studio (free)
2. Add browser source
3. Record your demonstration
4. Export video

### Option 3: Browser Extension
- Use Loom or similar extensions
- Record browser tab
- Share link

---

## 🚀 Next Steps

After demonstrating locally, you can:

1. **Deploy to Production**
   - Frontend: Vercel, Netlify
   - Backend: Render, Railway
   - Database: PlanetScale, Railway

2. **Create Documentation**
   - Take screenshots
   - Add to README
   - Create user guide

3. **Share with Team**
   - Push to GitHub
   - Share demo video
   - Document features

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message in terminal
2. Look at `backend/logs/transactions.txt`
3. Check browser console (F12)
4. Verify all prerequisites are met

**Common Issues:**
- MySQL not running → Start MySQL service
- Wrong credentials → Update `connection.js`
- Port conflicts → Change ports
- Missing dependencies → Run `npm install`

---

**Good luck with your demonstration! 🎉**
