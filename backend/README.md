# Online Voting Backend

This Spring Boot backend supports the frontend app in `my-app`.

## Features

- PostgreSQL persistence
- JWT authentication
- Voter registration and login
- Election listing and results
- Vote casting with one-vote-per-election enforcement
- Admin-only election creation and toggling

## Project Structure

- `src/main/java/com/onlinevoting`
  - `config` - Spring Security configuration
  - `controller` - REST API controllers
  - `dto` - request/response object definitions
  - `entity` - JPA entities
  - `repository` - Spring Data JPA repositories
  - `security` - JWT and Spring Security support
  - `service` - business logic
- `src/main/resources/application.yml` - database and JWT settings
- `pom.xml` - Maven dependencies and build config

## Running Locally

1. Install PostgreSQL.
2. Create database:

```sql
CREATE DATABASE onlinevoting;
CREATE USER postgres WITH PASSWORD '<choose-a-strong-local-password>';
GRANT ALL PRIVILEGES ON DATABASE onlinevoting TO postgres;
```

3. Copy `.env.example` to `.env` and set your local database password and a long random `JWT_SECRET`. Do not commit `.env`.

4. Build and run:

```bash
cd backend
source .env
mvn clean package
mvn spring-boot:run
```

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/elections`
- `GET /api/elections/results`
- `POST /api/vote` (authenticated voter)
- `POST /api/admin/elections` (admin only)
- `PATCH /api/admin/elections/{id}/toggle` (admin only)

## Frontend Integration

Set `VITE_API_URL=http://localhost:8080/api` in the frontend environment.

Then start the frontend normally from `my-app`.
