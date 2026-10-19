# 🎯 Online Voting System - Integration Test Guide

## ✅ System Status

**Backend**: Running on `http://localhost:8080`

- Spring Boot 3.2.5
- PostgreSQL Database Connected
- API Endpoints Active

**Frontend**: Running on `http://localhost:5174` (or 5173)

- React + Vite
- Connected to Backend via Axios

---

## 🚀 Quick Start Links

- **Main App**: http://localhost:5174
- **Backend API**: http://localhost:8080/api
- **Login Page**: http://localhost:5174/vote/login
- **Register Page**: http://localhost:5174/vote/register

---

## 📋 Complete Integration Test Steps

### Step 1: Test User Registration

1. Open http://localhost:5174/vote/register
2. Fill in the registration form:
   - **Name**: Test Voter
   - **Email**: test@example.com
   - **Password**: Choose a unique password with at least 12 characters.

3. **Expected Result**:
   - ✅ Account created successfully
   - ✅ Data saved to PostgreSQL database
   - ✅ Confirmation message displayed

**Verify in Database**:

```bash
psql -U postgres -d onlinevoting
SELECT * FROM "user";
```

---

### Step 2: Test User Login

1. Go to http://localhost:5174/vote/login
2. Enter credentials from Step 1:
   - **Email**: test@example.com
   - **Password**: Use the same unique password chosen during registration.

3. **Expected Result**:
   - ✅ JWT token received from backend
   - ✅ Token stored in localStorage
   - ✅ Redirected to /vote/dashboard
   - ✅ User data displayed in navbar

**Check Browser DevTools** (F12):

```javascript
// In Console:
localStorage.getItem("token"); // Should show JWT token
localStorage.getItem("voteUser"); // Should show user data
```

---

### Step 3: Test Election Management (Admin Panel)

1. Go to http://localhost:5174/admin
2. Navigate to **"Election Management"** tab

3. **Create Election**:
   - Click "New Election"
   - **Title**: Student Council 2026
   - **Description**: Vote for student council representatives
   - **End Date**: 2026-12-31
   - Click "Create Election"

4. **Expected Result**:
   - ✅ Election created in backend
   - ✅ Appears in elections list
   - ✅ Active status shown

**Verify in Database**:

```bash
psql -U postgres -d onlinevoting
SELECT * FROM elections;
```

---

### Step 4: Test Candidate Management

1. Still on Admin Panel, navigate to **"Candidate Management"** tab
2. Click "Add Candidate"

3. **Add Candidate**:
   - **Name**: Alice Johnson
   - **Role**: President
   - **Party**: Unity Party
   - **Election**: Student Council 2026 (select from dropdown)
   - **Bio**: Focused on campus improvements and student welfare
   - Click "Add Candidate"

4. **Add Second Candidate**:
   - **Name**: Bob Smith
   - **Role**: Vice President
   - **Party**: Progress Alliance
   - **Election**: Student Council 2026
   - **Bio**: Committed to transparency and inclusivity
   - Click "Add Candidate"

5. **Expected Result**:
   - ✅ Candidates appear in roster
   - ✅ Show vote counts (initially 0)
   - ✅ Can remove candidates

**Verify in Database**:

```bash
psql -U postgres -d onlinevoting
SELECT * FROM candidates;
```

---

### Step 5: Test Dashboard (Voter View)

1. Logout from admin (if different user)
2. Go to http://localhost:5174/vote/dashboard
3. Login with your test account

4. **Expected Result**:
   - ✅ Active elections displayed
   - ✅ Candidates for each election shown
   - ✅ Vote buttons visible for each candidate
   - ✅ Candidate cards display correctly

---

### Step 6: Test Voting

1. On Dashboard, for the Student Council election:
   - Click on **Alice Johnson** card
   - Status changes to "Selected" or highlights
   - Click **"Vote"** button

2. **Expected Result**:
   - ✅ Vote submitted to backend
   - ✅ Success message: "Your vote has been submitted successfully!"
   - ✅ Vote count updated for Alice Johnson
   - ✅ Cannot vote again for same election (on same user)

**Verify in Database**:

```bash
psql -U postgres -d onlinevoting
SELECT * FROM votes;
SELECT * FROM candidates;  -- Check updated vote counts
```

---

### Step 7: Test Results View

1. Navigate to **Results** tab in Admin panel

2. **Expected Result**:
   - ✅ Total votes counted
   - ✅ Elections tracked count matches
   - ✅ Candidate results displayed
   - ✅ Vote percentages calculated
   - ✅ Progress bars show vote distribution

---

### Step 8: Test API Endpoints Directly

Using curl or Postman:

**1. Get All Elections**:

```bash
curl http://localhost:8080/api/elections
```

**2. Login & Get Token**:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
   -d '{"email":"test@example.com","password":"<your-registration-password>"}'
```

**3. Cast Vote**:

```bash
curl -X POST http://localhost:8080/api/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"electionId":1,"candidateId":1}'
```

**4. Get Election Results**:

```bash
curl http://localhost:8080/api/elections/results
```

---

## 🔍 Troubleshooting

### Issue: "Cannot POST /api/auth/login"

- **Cause**: Backend not running
- **Solution**: Ensure backend is started: `java -jar backend-0.0.1-SNAPSHOT.jar`

### Issue: "Connection refused"

- **Cause**: PostgreSQL not running or credentials wrong
- **Solution**:
  - Check PostgreSQL is running
  - Verify database `onlinevoting` exists
  - Check credentials in `application.yml`

### Issue: CORS errors in browser console

- **Cause**: Frontend trying to access backend from different origin
- **Solution**:
  - Backend should have CORS configured
  - Check if backend is actually running on 8080

### Issue: Vote not saved after clicking "Vote"

- **Cause**: JWT token invalid or backend error
- **Solution**:
  - Check browser console for errors
  - Login again to refresh token
  - Check backend logs for detailed errors

### Issue: Port 5173/5174 already in use

- **Solution**:

```bash
# Kill the process or start on different port
npm run dev -- --port 3000
```

### Issue: Port 8080 already in use

- **Solution**:

```bash
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or configure different port in application.yml
server.port: 8081
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────┐
│   Frontend React    │
│   (5174/5173)       │
└────────┬────────────┘
         │
         │ HTTP/REST
         │ (Axios)
         ▼
┌─────────────────────┐
│  Spring Boot API    │
│   (8080)            │
└────────┬────────────┘
         │
         │ JDBC
         │
         ▼
┌─────────────────────┐
│   PostgreSQL DB     │
│   (localhost:5432)  │
└─────────────────────┘
```

---

## 📝 API Endpoints Summary

### Public Endpoints (No Auth Required)

- `GET /api/elections` - List all elections
- `GET /api/elections/results` - Get election results
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints (Requires JWT Token)

- `POST /api/vote` - Cast a vote

### Admin Endpoints (Requires Admin JWT Token)

- `POST /api/admin/elections` - Create election
- `PATCH /api/admin/elections/{id}/toggle` - Toggle election active/inactive
- `POST /api/admin/candidates` - Create candidate
- `GET /api/admin/candidates/election/{electionId}` - Get candidates for election
- `GET /api/admin/stats` - Get admin statistics

---

## 🎓 Key Features Connected

✅ **User Authentication**

- Registration with email/password
- JWT token-based authentication
- Secure password hashing

✅ **Election Management**

- Create multiple elections
- Set election dates
- Toggle election status

✅ **Candidate Management**

- Add candidates to elections
- Track vote counts
- Display candidate information

✅ **Voting System**

- One vote per user per election
- Secure vote submission
- Real-time vote counting

✅ **Results Tracking**

- Live vote counts
- Percentage calculations
- Result visualization

✅ **Database Persistence**

- All data persisted to PostgreSQL
- Proper relationships between entities
- Data consistency maintained

---

## 🔐 Security Features

✅ Spring Security configured
✅ JWT token authentication
✅ Password encryption (BCrypt)
✅ CORS enabled for frontend
✅ Protected routes on backend
✅ Token validation middleware

---

## Next Steps

1. ✅ **Completed**: Connect frontend with backend API
2. ✅ **Completed**: Database setup with PostgreSQL
3. ✅ **Completed**: Run integration tests
4. **Optional**: Add more admin features
5. **Optional**: Add email verification
6. **Optional**: Add rate limiting
7. **Optional**: Deploy to production

---

## 📞 Support

If you encounter issues:

1. Check backend logs
2. Check browser console (F12)
3. Verify database connection
4. Ensure all ports are available
5. Check credentials in configuration files
