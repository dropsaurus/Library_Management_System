# Public Affirmation Library Management System

A comprehensive web-based library management system with support for books, users, events, and room bookings.

## Overview

The Public Affirmation Library Management System is a full-featured web application that manages library resources and user interactions. The system supports multiple user roles including customers, authors, employees, and administrators, with role-specific dashboards and functionalities.

## Features

- **User Management**

  - Multi-role system (Customer, Author, Employee, Admin)
  - User registration and authentication
  - Profile management
  - Password management

- **Book Management**

  - Book catalog with search functionality
  - Book rentals and returns
  - Book copies inventory tracking

- **Author System**

  - Author profiles
  - Seminar registrations
  - Author-specific dashboard

- **Event Management**

  - Seminars with speakers and topics
  - Exhibitions
  - Event registration and attendance tracking

- **Room Bookings**

  - Study room reservations
  - Room availability checking
  - Booking management

- **Payment Processing**
  - Multiple payment methods (Card, Cash, PayPal)
  - Invoice generation
  - Payment tracking

## Technology Stack

- **Frontend**

  - HTML5, CSS3, JavaScript
  - Responsive design with mobile support
  - Theme toggle (Light/Dark mode)

- **Backend**

  - PHP 8+ for API endpoints
  - PDO for database access
  - REST API architecture

- **Database**
  - MySQL/MariaDB
  - Normalized schema design
  - Stored procedures for complex operations

## File Structure

```
/
├── api/                  # API endpoints for data operations
├── config/               # Configuration files
├── css/                  # Stylesheets
├── database/             # Database scripts and documentation
├── js/                   # JavaScript files
├── pages/                # HTML pages for different modules
└── index.html            # Main entry point
```

## Installation

1. **Clone the repository**

   ```
   git clone https://github.com/yourusername/library_management.git
   cd library_management
   ```

2. **Database Setup**

   - Import the database schema using `JPN_PAL_DDL.sql`
   - Initialize data using `JPN_PAL_INSERT.sql`
   - Set up database connection in `config/db_connect.php`

3. **Web Server Configuration**

   - Configure your web server (Apache/Nginx) to point to the project directory
   - Ensure PHP 8+ is installed and configured
   - Set up appropriate permissions for file writing if needed

4. **Initialize Roles**

   - Run the `api/init_roles.php` script to set up user roles

5. **Access the Application**
   - Open your browser and navigate to the web server URL
   - Default admin credentials can be found in the installation notes

## User Roles

1. **Customer**

   - Browse books
   - Rent and return books
   - Book study rooms
   - Register for events

2. **Author**

   - Manage author profile
   - Register for seminars
   - View registered seminars

3. **Employee**

   - Manage books and inventory
   - Process rentals and returns
   - Manage room bookings
   - View customer information

4. **Administrator**
   - User management
   - Report generation
   - System configuration
   - All employee permissions

## API Documentation

The system includes over 70 API endpoints for various operations, including:

- Authentication endpoints (login, register, logout)
- Book management (search, rental, return)
- User management (profile, password)
- Event management (seminars, exhibitions)
- Room booking (availability, reservations)

Each API returns standardized JSON responses with appropriate HTTP status codes.

## Requirements

- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Web server (Apache/Nginx)
- Modern web browser with JavaScript enabled

## Database Schema

The database schema follows a normalized design with proper relationships between entities:

- User management (JPN_USER, JPN_ROLE, JPN_USER_ROLE)
- Book management (JPN_BOOK, JPN_COPY, JPN_RENTAL)
- Event management (JPN_EVENT, JPN_SEMINAR, JPN_EXHIBITION)
- Room management (JPN_ROOM, JPN_RESERVATION)

For a detailed schema description, refer to the `JPN_PAL_DDL.sql` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
