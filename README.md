# MovieHub – Online Movie Ticket Booking System

## 1. Project Title

**MovieHub – Full Stack Online Movie Ticket Booking Platform**

---

# 2. Problem Statement

Traditional movie ticket booking systems often face several challenges:

* Manual ticket booking causes long waiting times.
* Users cannot easily view available seats in real-time.
* Managing multiple theatres, screens, shows, and bookings becomes difficult.
* Lack of centralized booking history and ticket management.
* Seat conflicts can occur when multiple users try to book the same seat.
* Existing systems often lack role-based access and efficient ticket tracking.

Therefore, a scalable web-based movie ticket booking platform is required to automate theatre management, seat allocation, booking, and ticket generation.

---

# 3. Objective of the Project

The primary objective of MovieHub is to provide a secure and efficient online movie ticket booking platform where users can:

* Browse movies
* View available shows
* Select seats in real-time
* Book movie tickets
* Generate digital tickets
* Track booking history

The system also provides administrative control for managing:

* Movies
* Theatres
* Screens
* Shows
* Seats
* Users
* Tickets

---

# 4. Proposed Solution

MovieHub is developed as a Full Stack Web Application.

The system provides:

### Customer Features

* User Registration
* User Login
* Movie Browsing
* Show Selection
* Seat Selection
* Ticket Booking
* Digital Ticket Generation
* Booking History

### Admin Features

* Manage Movies
* Manage Theatres
* Manage Screens
* Manage Shows
* Monitor Bookings
* User Management

---

# 5. Technologies Used

## Frontend

* React.js
* React Router
* Axios
* Ant Design
* JavaScript
* HTML5
* CSS3

## Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate
* Spring Data JPA
* Maven

## Database

* MySQL

## Development Tools

* VS Code
* Postman / Thunder Client
* MySQL Workbench
* Git
* GitHub

---

# 6. System Architecture

User
↓
React Frontend
↓
REST APIs
↓
Spring Boot Backend
↓
Hibernate / JPA
↓
MySQL Database

Authentication Flow:

User Login
↓
JWT Token Generated
↓
Stored in Browser
↓
Sent in Authorization Header
↓
Spring Security Validates Token
↓
Access Granted

---

# 7. Database Design

Major Entities:

### User

Stores:

* Username
* Password
* Email
* Role
* Status

### Movie

Stores:

* Title
* Genre
* Language
* Duration
* Rating
* Description

### Theatre

Stores:

* Theatre Name
* Address
* Contact Information

### Screen

Stores:

* Screen Number
* Screen Type
* Seat Capacity

### Seat

Represents physical seats.

Example:

A1, A2, B1, B2

### Show

Represents a movie screening.

Contains:

* Movie
* Screen
* Date
* Time

### ShowSeat

Represents seat availability for a particular show.

Example:

Show 1 → A1 Available

Show 2 → A1 Available

Show 3 → A1 Available

This design prevents seat conflicts between shows.

### Booking

Stores:

* Booking Number
* Booking Time
* Total Amount
* Booking Status

### BookingSeat

Maps booked seats to a booking.

### Ticket

Stores:

* Ticket Number
* QR Code
* Ticket Status

---

# 8. Modules Explanation

## Module 1 – Authentication Module

Features:

* Register User
* Login User
* JWT Authentication
* Role-Based Authorization

Purpose:

Ensures secure access to the system.

---

## Module 2 – Movie Management Module

Features:

* Add Movie
* Update Movie
* Delete Movie
* View Movie Details

Purpose:

Allows movie catalog management.

---

## Module 3 – Theatre Management Module

Features:

* Create Theatre
* Manage Screens
* Configure Seating Layout

Purpose:

Manages theatre infrastructure.

---

## Module 4 – Show Management Module

Features:

* Create Shows
* Assign Movies
* Assign Screens
* Set Pricing

Purpose:

Schedules movie screenings.

---

## Module 5 – Seat Management Module

Features:

* Seat Generation
* Seat Availability Tracking
* Real-Time Status Updates

Statuses:

* AVAILABLE
* BOOKED
* RESERVED
* MAINTENANCE

Purpose:

Prevents double booking.

---

## Module 6 – Booking Module

Features:

* Select Seats
* Calculate Price
* Confirm Booking

Purpose:

Handles complete ticket reservation workflow.

---

## Module 7 – Ticket Generation Module

Features:

* Generate Ticket
* Generate QR Code
* Track Ticket Status

Purpose:

Provides digital ticket management.

---

# 9. Booking Workflow

User Login
↓
Browse Movies
↓
Select Movie
↓
Choose Show
↓
View Available Seats
↓
Select Seats
↓
Create Booking
↓
Generate Ticket
↓
View Ticket

---

# 10. Security Features

Implemented:

* JWT Authentication
* Spring Security
* Password Encryption
* Role-Based Access
* Protected REST APIs

Benefits:

* Secure User Sessions
* Unauthorized Access Prevention
* Token-Based Authentication

---

# 11. Results Achieved

Successfully Implemented:

✅ User Authentication

✅ JWT Security

✅ Movie Management

✅ Theatre Management

✅ Screen Management

✅ Seat Generation

✅ Show Seat Generation

✅ Booking Creation

✅ Ticket Generation

✅ Booking History

✅ React Frontend Integration

✅ Spring Boot REST APIs

---

# 12. Benefits of the System

For Users:

* Easy Ticket Booking
* Real-Time Seat Availability
* Digital Tickets
* Faster Experience

For Theatre Owners:

* Better Management
* Reduced Manual Work
* Improved Booking Tracking

For Administrators:

* Centralized Control
* Secure Operations
* Better Data Management

---

# 13. Future Enhancements

Planned Features:

* Online Payment Gateway
* Email Notifications
* SMS Notifications
* Ticket Cancellation
* Refund Management
* Analytics Dashboard
* Revenue Reports
* Movie Recommendations
* Cloud Deployment
* Mobile Application

---

# 14. Conclusion

MovieHub successfully automates the movie ticket booking process through a secure full-stack architecture. The platform integrates React, Spring Boot, Hibernate, JWT Security, and MySQL to provide a scalable and efficient solution for movie ticket reservation and theatre management.
