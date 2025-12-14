## Sweet Shop Management System

A full-stack application for managing a sweet shop with user authentication, inventory management, and a modern React frontend.


## Technology Stack

### Backend

1. Java 21
2. SpringBoot 3.5.8
3. PostgreSQL (Database)
4. Spring Security (Authentication)
5. JWT with Modern Security Practices
6. JUnit 5 & Mockito (Testing)

### Frontend

1. React18
2. Tailwind CSS (Styling)
3. Lucide React (Icons)

### Database Setup

1. Install PostgreSQL and start the service
2. Create the database:

```bash
CREATE DATABASE sweetshop;
```

### Backend Setup

1. Clone the repository and navigate to the project directory
2. Build the project:

```bash
mvn clean install
```
3. Start the application:

```bash
mvn spring-boot:run
```

### Frontend Setup

1. Create a new React app:

```bash
npx create-react-app sweet-shop-frontend
cd sweet-shop-frontend
```

2. Install dependencies:
```bash
npm install lucide-react
```

3. Start the frontend:
```bash
npm start
```

### Configuration

Update application.properties:

```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/tms_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

Application runs at: http://localhost:8080

## Database Schema

![ER Diagram]()


## Key Features

### Backend

1. User registration and authentication
2. JWT token-based security
3. RESTful API endpoints
4. PostgreSQL database integration
5. CRUD operations for sweets
6. Search and filter functionality
7. Role-based access control (Admin features)

### Backend

1. User registration and login forms
2. Dashboard displaying all sweets
3. Search and filter by name, category, and price range
4. Purchase button (disabled when out of stock)
5. Add, update, and delete sweets forms
6. Restock functionality
7. Responsive design
