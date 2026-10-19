# Database & Backend Setup Guide

## Prerequisites

- PostgreSQL 12+ installed
- Java 21+ installed
- Maven installed

## Step 1: Create PostgreSQL Database

1. **Start PostgreSQL Service** (if not already running)
   - Windows: PostgreSQL should be running as a service
   - Or start it manually if needed

2. **Create the database using psql:**

   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE onlinevoting;

   # Verify creation
   \l

   # Exit psql
   \q
   ```

## Step 2: Configure Database Credentials

Copy `backend/.env.example` to `backend/.env`, then set `DB_PASSWORD` to your PostgreSQL password and replace `JWT_SECRET` with a long random value. The `.env` file is ignored by Git; do not commit it.

## Step 3: Start the Backend

1. Navigate to the backend folder:

   ```bash
   cd backend
   source .env
   ```

2. Build the project:

   ```bash
   mvn clean install
   ```

3. Run the application:

   ```bash
   mvn spring-boot:run
   ```

   Or if you prefer using Java:

   ```bash
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

4. **Expected Output:**
   - The server should start on `http://localhost:8080`
   - You should see "Started OnlineVotingApplication"
   - Log messages showing Hibernate creating/updating database tables

## Step 4: Start the Frontend

1. In a new terminal, navigate to the frontend folder:

   ```bash
   cd my-app
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open browser to `http://localhost:5173` (or the URL shown in terminal)

## Step 5: Test the Connection

1. **Create a new account:**
   - Go to http://localhost:5173/vote/register
   - Fill in the form with test data
   - Submit

2. **Check if data is saved in database:**

   ```bash
   # Connect to database
   psql -U postgres -d onlinevoting

   # Check tables
   \dt

   # Check users
   SELECT * FROM "user";

   # Exit
   \q
   ```

## Troubleshooting

### Backend won't start - "Connection refused"

- **Issue**: PostgreSQL not running or credentials wrong
- **Solution**:
  - Ensure PostgreSQL service is running
  - Check username/password in `application.yml`
  - Verify database exists

### Frontend can't connect to backend

- **Issue**: Backend not running on port 8080
- **Solution**:
  - Ensure backend is started first
  - Check if port 8080 is already in use
  - Check browser console for errors (F12)

### CORS errors

- **Issue**: Frontend trying to access backend from different origin
- **Solution**:
  - This should be handled by backend CORS configuration
  - Check that backend is running before frontend

### Port 5173 already in use

- **Solution**: Kill the process or use a different port:
  ```bash
  npm run dev -- --port 3000
  ```

## Default Test Account (After Setup)

After running the backend, you can create a test account or use the data initializer if available.

## Next Steps

1. ✅ Setup complete
2. Register a test user
3. Create an election (Admin panel)
4. Add candidates
5. Cast votes and view results
