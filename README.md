# Hotel Management System

A full-stack, microservices-based Hotel Management System. This project includes a modern React frontend and several Spring Boot backend services, each responsible for a specific domain of hotel management.

---

## Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [Prerequisites](#prerequisites)
- [Setup & Running the System](#setup--running-the-system)
- [Example .env Files](#example-env-files)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
This system manages hotel operations using a microservices architecture.

**Key features:**
- JWT-based authentication and role-based access control
- Room and reservation management
- Inventory and staff management
- Payment processing
- Service discovery and API gateway

---

## System Architecture
```
+-------------------+      +-------------------+      +-------------------+
|                   |      |                   |      |                   |
|  Frontend (React) +----->+  Gateway Service  +----->+  Microservices    |
|                   |      |                   |      | (Auth, Reservation|
+-------------------+      +-------------------+      |  Inventory,       |
                                                      |  Payment)         |
                                                      +-------------------+
                                                             |
                                                      +-------------------+
                                                      | Eureka Server     |
                                                      +-------------------+
```
- **Frontend** communicates with the backend via the **Gateway Service**.
- **Gateway Service** routes requests to the appropriate microservice.
- **Eureka Server** provides service discovery for all backend services.

---

## Backend Details

### Common Features
- **Spring Boot**: All services are built with Spring Boot for rapid development and easy deployment.
- **Service Discovery**: All services register with Eureka for dynamic discovery.
- **API Gateway**: All external requests go through the gateway for routing and security.
- **JWT Security**: Auth and gateway enforce JWT-based authentication and role-based access.
- **Database**: Each service can have its own database schema (microservice DB pattern).
- **Configuration**: Each service has its own `application.properties` for port, DB, and Eureka config.

### Service-by-Service Details

#### 1. **auth-service**
- **Responsibilities**: User registration, login, JWT issuance, role management.
- **Endpoints**:  
  - `POST /auth/register` – Register a new user  
  - `POST /auth/login` – Authenticate and receive JWT  
  - `GET /auth/me` – Get current user info  
- **DB Tables**: `users`, `roles`, `user_roles`
- **Environment Variables**:  
  - `DB_URL`, `DB_USER`, `DB_PASS`  
  - `JWT_SECRET`, `JWT_EXPIRATION`

#### 2. **reservation-service**
- **Responsibilities**: Room management, reservation booking, availability checks.
- **Endpoints**:  
  - `GET /rooms` – List rooms  
  - `POST /reservations` – Book a room  
  - `GET /reservations/{id}` – Get reservation details  
- **DB Tables**: `rooms`, `reservations`, `guests`

#### 3. **Inventory-service**
- **Responsibilities**: Manage hotel inventory (supplies, amenities), staff management.
- **Endpoints**:  
  - `GET /items` – List inventory items  
  - `POST /items` – Add inventory item  
  - `GET /staff` – List staff  
- **DB Tables**: `items`, `staff`

#### 4. **payment-service**
- **Responsibilities**: Payment processing, transaction history.
- **Endpoints**:  
  - `POST /payments` – Process payment  
  - `GET /transactions` – List transactions  
- **DB Tables**: `payments`, `transactions`

#### 5. **gateway-service**
- **Responsibilities**: API gateway, request routing, security enforcement.
- **Config**:  
  - Routes requests to appropriate microservice  
  - Validates JWT tokens  
  - Handles CORS

#### 6. **eureka-server**
- **Responsibilities**: Service registry for all microservices.
- **Endpoints**:  
  - Web dashboard at `/` (default port 8761)

| Service            | Description                                      | Default Port |
|--------------------|--------------------------------------------------|--------------|
| **auth-service**   | Handles authentication, registration, JWT, roles | 8081         |
| **reservation-service** | Manages rooms, reservations, availability   | 8082         |
| **Inventory-service**   | Manages inventory items and staff           | 8083         |
| **payment-service**     | Handles payment processing and transactions | 8084         |
| **gateway-service**     | API gateway for routing and security        | 8080         |
| **eureka-server**       | Service registry for discovery              | 8761         |

---

## Frontend Details

### Tech Stack
- **React** (with TypeScript)
- **Material-UI** for modern, responsive UI
- **Axios** for API requests
- **React Router** for navigation
- **Context API** for global state (auth, user roles)
- **JWT** stored in localStorage/sessionStorage

### Main Features
- **Authentication**: Login, registration, JWT handling
- **Role-based UI**: Different dashboards for Owner, Manager, Receptionist
- **Room Management**: View, book, and manage rooms
- **Inventory Management**: View and manage inventory and staff
- **Payments**: Initiate and view payment transactions
- **Real-time Updates**: Uses polling or websockets (if implemented) for live data

### Project Structure
```
hotel-integrate/
  ├── src/
  │   ├── components/   # Reusable UI components
  │   ├── pages/        # Page-level components (Dashboard, Login, etc.)
  │   ├── services/     # API service modules (auth, reservation, etc.)
  │   ├── contexts/     # React Contexts (AuthContext, etc.)
  │   ├── theme.ts      # Material-UI theme config
  │   └── App.tsx       # Main app entry
  ├── public/
  ├── package.json
  └── .env              # API URL config
```

### Environment Variables
- `REACT_APP_API_URL` – Base URL for the API gateway (e.g., `http://localhost:8080`)

### Running the Frontend
```bash
cd hotel-integrate
npm install
npm start
```
- App runs at [http://localhost:3000](http://localhost:3000)
- Make sure backend gateway is running and accessible

---

## Prerequisites
- **Java 17+** (for backend services)
- **Maven 3.6+** (for backend services)
- **Node.js 14+** and **npm 6+** (for frontend)
- **MySQL** or another supported database (if used by services)
- (Optional) **Docker** and **docker-compose** for containerized setup

---

## Setup & Running the System

### 1. Backend Services

#### a. Start Eureka Server
```bash
cd eureka-server
./mvnw spring-boot:run
```

#### b. Start Each Microservice
Repeat for each service (`auth-service`, `reservation-service`, `Inventory-service`, `payment-service`, `gateway-service`):
```bash
cd <service-name>
./mvnw spring-boot:run
```
> **Note:**  
> - Ensure each service's `application.properties` is configured for the correct database, ports, and Eureka server URL.
> - Start the **gateway-service** last, after all other services are registered with Eureka.

#### c. Database Setup
- Create required databases and users in MySQL as needed.
- Update each service's `src/main/resources/application.properties` with your DB credentials.

### 2. Frontend
```bash
cd hotel-integrate
npm install
# Create a .env file with:
# REACT_APP_API_URL=http://localhost:8080
npm start
```
- The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Example .env Files

### Backend (e.g., `auth-service/src/main/resources/application.properties`)
```
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/authdb
spring.datasource.username=root
spring.datasource.password=yourpassword
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

### Frontend (`hotel-integrate/.env`)
```
REACT_APP_API_URL=http://localhost:8080
```

---

## Testing

### Backend
Each service can be tested individually:
```bash
cd <service-name>
./mvnw test
```

### Frontend
```bash
cd hotel-integrate
npm test
```

---

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

## License
This project is licensed under the MIT License.

---

## API Documentation
- Each backend service can expose Swagger/OpenAPI docs at `/swagger-ui.html` (if enabled).
- Use Postman or Swagger UI to explore and test endpoints.

---

> For production deployment, consider using Docker and docker-compose for orchestration.
> Add environment variable documentation for secrets, DB URLs, etc.
> For advanced users, add API documentation (Swagger/OpenAPI) for each service. 