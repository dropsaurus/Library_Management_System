# Database Migration Documentation

## Overview

The library management system database schema has been updated to improve user management. This document outlines the key changes and the modifications made to API files for compatibility.

## Schema Changes

### User Management Updates

1. **New Tables Added**:
   - `JPN_ROLE`: Stores user roles (CUSTOMER, EMPLOYEE, AUTHOR, ADMIN)
   - `JPN_USER`: Central user table storing common user information
   - `JPN_USER_ROLE`: Maps users to their roles

2. **Modified Tables**:
   - `JPN_CUSTOMER`: Now only contains customer-specific fields (identification type/number)
   - `JPN_AUTHOR`: Now only contains author-specific fields (address information)
   - `JPN_EMPLOYEE`: Added for employee-specific information

3. **Password Storage**:
   - Changed from `PASSWORD_HASH` using PHP's `password_hash()` to SHA-256 binary hash stored in `U_PWD_HASH`
   - Uses `UNHEX(SHA2(password, 256))` for storage and `hash_equals()` for comparison

### New Stored Procedures

1. `SP_INSERT_JPN_USER_CUSTOMER`: Creates a user with the CUSTOMER role
2. `SP_INSERT_JPN_USER_AUTHOR`: Creates a user with the AUTHOR role
3. `SP_INSERT_JPN_USER_EMPLOYEE`: Creates a user with the EMPLOYEE role

## API File Modifications

### Authentication & User Management

1. **login.php**:
   - Updated to use the new user tables and join with roles
   - Added checks for author role for additional privileges
   - Changed password verification to use binary hash comparison

2. **register.php**:
   - Updated to use the new stored procedure `SP_INSERT_JPN_USER_CUSTOMER`
   - Simplified parameters to match the new procedure

3. **change_password.php**:
   - Updated to use `JPN_USER` table instead of `JPN_CUSTOMER`
   - Changed password update to use `UNHEX(SHA2())` for consistent hashing

4. **get_profile.php** and **update_profile.php**:
   - Updated field names to match the new `JPN_USER` table structure

### Book Management

1. **search_books.php** and **get_books.php**:
   - Updated JOIN clauses to include `JPN_USER` for author information
   - Modified queries to use `U_FNAME` and `U_LNAME` from `JPN_USER` instead of the removed author name fields

### Other API Files

1. **get_rentals_customer.php**:
   - Updated role check to use uppercase 'CUSTOMER' to match new schema

## Initialization

Added `init_roles.php` to initialize the `JPN_ROLE` table with the required roles for the application.

## Required Actions

1. Run the new `JPN_PAL_DDL.sql` script to create the updated database structure
2. Run `api/init_roles.php` to initialize the role data
3. Run the new `JPN_PAL_INSERT.sql` script to populate the database

## Testing

After migration, test the following functionality:
1. User registration
2. User login
3. Profile management
4. Password changing
5. Book searching and viewing
6. Rental management 