# GreenMarket Backend API

A Node.js/Express backend API for the UMC GreenMarket application with MySQL database integration.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management with UMN Crookston email validation
- **Item Management**: CRUD operations for marketplace items with search and filtering
- **Database**: MySQL with Sequelize ORM for robust data management
- **Security**: Input validation, password hashing, rate limiting, CORS protection
- **Email Validation**: Restricts access to @crk.umn.edu domain only

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd greenmarket-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database configuration
   DB_HOST=localhost
   DB_NAME=greenmarket
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_PORT=3306
   
   # JWT configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   
   # CORS configuration
   FRONTEND_URL=http://localhost:5173
   
   # Email domain validation
   ALLOWED_EMAIL_DOMAIN=crk.umn.edu
   ```

4. **Set up MySQL database:**
   ```sql
   CREATE DATABASE greenmarket;
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` and automatically create database tables.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (UMN email required)
- `POST /login` - User login
- `GET /me` - Get current user info
- `POST /logout` - Logout user
- `PUT /password` - Update password

### Users (`/api/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id/status` - Update user status (admin only)

### Items (`/api/items`)
- `GET /` - Get all items with filtering/pagination
- `GET /:id` - Get single item by ID
- `POST /` - Create new item (auth required)
- `PUT /:id` - Update item (owner only)
- `DELETE /:id` - Delete item (owner/admin only)
- `GET /user/:userId` - Get items by user

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@crk.umn.edu",
  "password": "password123",
  "role": "student"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@crk.umn.edu",
  "password": "password123"
}
```

### Create Item
```bash
POST /api/items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "MacBook Pro 2021",
  "description": "Excellent condition laptop, barely used",
  "price": 1200.00,
  "category": "electronics",
  "condition": "like-new",
  "contactMethod": "email"
}
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `firstName`, `lastName`
- `email` (Unique, @crk.umn.edu validation)
- `password` (Hashed)
- `phone`, `studentId`
- `role` (student, faculty, staff, admin)
- `isActive`, `lastLogin`
- `profileImage`
- `createdAt`, `updatedAt`

### Items Table
- `id` (Primary Key)
- `title`, `description`
- `price`, `category`, `condition`
- `images` (JSON array)
- `isAvailable`, `isFeatured`
- `tags` (JSON array)
- `location`, `contactMethod`
- `viewCount`
- `userId` (Foreign Key to Users)
- `createdAt`, `updatedAt`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevents spam and DoS attacks
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers middleware
- **Email Domain Validation**: Restricts to @crk.umn.edu only

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev

# Check logs
tail -f logs/app.log
```

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Verify database credentials in `.env`
3. Check if `greenmarket` database exists
4. Ensure MySQL user has proper permissions

### Authentication Issues
1. Verify JWT_SECRET is set in `.env`
2. Check token expiration settings
3. Ensure email matches @crk.umn.edu pattern

### Port Conflicts
Change PORT in `.env` file if 5000 is already in use.

## Contributing

1. Follow existing code structure and naming conventions
2. Add proper error handling and validation
3. Update API documentation for new endpoints
4. Test all endpoints before submitting changes

## License

MIT License - See LICENSE file for details