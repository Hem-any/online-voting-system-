# Online Voting System

A full-stack online voting application with a React frontend and a Spring Boot backend. Voters can register, view elections and candidates, cast a vote, and view results. Administrators can manage elections, candidates, and users.

## Features

- Voter registration and login
- JWT-based authentication
- Role-protected administrator tools
- Election and candidate management
- One vote per voter per election
- Election closing dates enforced by the backend
- Voting results and administrator statistics

## Technology Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA
- **Database:** PostgreSQL
- **Authentication:** JWT

## Requirements

Install these before running the project:

- Node.js and npm
- Java 21 or later
- Maven
- PostgreSQL

## Run Locally

### 1. Set up PostgreSQL

Start PostgreSQL and create the project database:

```sql
CREATE DATABASE onlinevoting;
