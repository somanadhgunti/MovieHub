MovieHub - Online Movie Ticket Booking System

Updated Software Architecture Documentation

1\. System Architecture

1.1 High-Level Architecture





┌─────────────────────────────────────────────────────────────────┐

│                         CLIENT LAYER                             │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │   React.js   │  │   React.js   │  │   React.js   │          │

│  │   (Admin)    │  │  (Customer)  │  │  (Public)    │          │

│  │  Context API │  │  Context API │  │  Context API │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │ HTTPS/REST API + WebSocket

&#x20;                             │

┌─────────────────────────────────────────────────────────────────┐

│                      API GATEWAY LAYER                           │

│              (Spring Boot REST Controllers)                      │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │ Security     │  │ CORS Config  │  │ Exception    │          │

│  │ Filter       │  │              │  │ Handler      │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │

┌─────────────────────────────────────────────────────────────────┐

│                      BUSINESS LAYER                              │

│              (Spring Boot Service Layer)                         │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │ Movie Service│  │ Theatre Svc  │  │ Booking Svc  │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │ User Service │  │ Payment Svc  │  │ Ticket Svc   │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

│  ┌──────────────┐                                           │

│  │ Seat Lock   │                                           │

│  │ Scheduler   │                                           │

│  └──────────────┘                                           │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │

┌─────────────────────────────────────────────────────────────────┐

│                      DATA ACCESS LAYER                           │

│              (Spring Data JPA Repository)                        │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │ Movie Repo   │  │ Theatre Repo │  │ Booking Repo │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │ User Repo    │  │ Seat Repo    │  │ Ticket Repo  │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

│  ┌──────────────┐  ┌──────────────┐                       │

│  │ SeatLock Repo│  │ ShowSeat Repo│                       │

│  └──────────────┘  └──────────────┘                       │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │

┌─────────────────────────────────────────────────────────────────┐

│                      DATA STORAGE LAYER                          │

│                      MySQL Database                              │

└─────────────────────────────────────────────────────────────────┘

1.2 Architectural Patterns

Pattern: Layered Architecture (N-Tier)

Frontend: SPA with Context API (No Redux)

Backend: RESTful API with Service-Repository Pattern

Authentication: JWT Token-Based Authentication

Database: Relational Database with ORM (JPA/Hibernate)

Real-time: WebSocket for seat updates

Concurrency: Optimistic Locking for seat reservations

Background Processing: Scheduler for seat lock cleanup

1.3 Technology Stack Layers

Layer	Technology	Purpose

Presentation	React.js, React Router, Axios, Context API	UI, Routing, HTTP Client, State Management

API Layer	Spring Boot REST Controllers, WebSocket	Request/Response Handling, Real-time Updates

Security	Spring Security, JWT, Custom UserDetails	Authentication \& Authorization

Business Logic	Spring Boot Services, Scheduler	Business Rules \& Logic, Background Jobs

Data Access	Spring Data JPA, Hibernate	ORM \& Database Operations

Database	MySQL	Persistent Data Storage

Build Tool	Maven	Dependency Management \& Build

1 / 10 tasks done

Thought for 1s

2\. Frontend Folder Structure





moviehub-frontend/

├── public/

│   ├── index.html

│   ├── favicon.ico

│   └── manifest.json

├── src/

│   ├── assets/

│   │   ├── images/

│   │   ├── icons/

│   │   └── fonts/

│   ├── components/

│   │   ├── common/

│   │   │   ├── Header.jsx

│   │   │   ├── Footer.jsx

│   │   │   ├── Navbar.jsx

│   │   │   ├── LoadingSpinner.jsx

│   │   │   └── ErrorBoundary.jsx

│   │   ├── admin/

│   │   │   ├── AdminDashboard.jsx

│   │   │   ├── MovieManagement.jsx

│   │   │   ├── TheatreManagement.jsx

│   │   │   ├── ScreenManagement.jsx

│   │   │   ├── ShowManagement.jsx

│   │   │   ├── BookingManagement.jsx

│   │   │   └── AnalyticsDashboard.jsx

│   │   ├── customer/

│   │   │   ├── MovieCard.jsx

│   │   │   ├── MovieList.jsx

│   │   │   ├── MovieDetails.jsx

│   │   │   ├── SeatSelection.jsx

│   │   │   ├── BookingSummary.jsx

│   │   │   ├── PaymentForm.jsx

│   │   │   ├── ETicket.jsx

│   │   │   └── CustomerDashboard.jsx

│   │   └── auth/

│   │       ├── LoginForm.jsx

│   │       ├── RegisterForm.jsx

│   │       └── ProtectedRoute.jsx

│   ├── context/

│   │   ├── AuthContext.jsx

│   │   ├── MovieContext.jsx

│   │   └── BookingContext.jsx

│   ├── constants/

│   │   ├── roles.js

│   │   ├── apiEndpoints.js

│   │   └── seatTypes.js

│   ├── hooks/

│   │   ├── useAuth.js

│   │   ├── useMovies.js

│   │   ├── useBookings.js

│   │   └── useSeats.js

│   ├── layouts/

│   │   ├── AdminLayout.jsx

│   │   └── UserLayout.jsx

│   ├── pages/

│   │   ├── Home.jsx

│   │   ├── Movies.jsx

│   │   ├── MovieDetail.jsx

│   │   ├── Booking.jsx

│   │   ├── Payment.jsx

│   │   ├── Ticket.jsx

│   │   ├── Login.jsx

│   │   ├── Register.jsx

│   │   ├── ForgotPassword.jsx

│   │   ├── AdminDashboard.jsx

│   │   ├── CustomerDashboard.jsx

│   │   ├── Profile.jsx

│   │   ├── Unauthorized.jsx

│   │   └── NotFound.jsx

│   ├── routes/

│   │   └── AppRoutes.jsx

│   ├── services/

│   │   ├── api.js

│   │   ├── authService.js

│   │   ├── movieService.js

│   │   ├── theatreService.js

│   │   ├── showService.js

│   │   ├── bookingService.js

│   │   ├── paymentService.js

│   │   └── ticketService.js

│   ├── utils/

│   │   ├── axiosConfig.js

│   │   ├── tokenUtils.js

│   │   ├── dateUtils.js

│   │   └── validation.js

│   ├── App.jsx

│   ├── App.css

│   ├── index.js

│   └── index.css

├── package.json

├── .env

├── .env.production

└── README.md

2 / 10 tasks done

Thought for 1s

3\. Backend Folder Structure





moviehub-backend/

├── src/

│   ├── main/

│   │   ├── java/

│   │   │   └── com/

│   │   │       └── moviehub/

│   │   │           ├── MovieHubApplication.java

│   │   │           ├── config/

│   │   │           │   ├── CorsConfig.java

│   │   │           │   ├── PasswordEncoderConfig.java

│   │   │           │   ├── SwaggerConfig.java

│   │   │           │   └── WebSocketConfig.java

│   │   │           ├── security/

│   │   │           │   ├── SecurityConfig.java

│   │   │           │   ├── JwtAuthenticationFilter.java

│   │   │           │   ├── JwtTokenProvider.java

│   │   │           │   └── CustomUserDetailsService.java

│   │   │           ├── controller/

│   │   │           │   ├── AuthController.java

│   │   │           │   ├── MovieController.java

│   │   │           │   ├── TheatreController.java

│   │   │           │   ├── ScreenController.java

│   │   │           │   ├── ShowController.java

│   │   │           │   ├── SeatController.java

│   │   │           │   ├── BookingController.java

│   │   │           │   ├── PaymentController.java

│   │   │           │   ├── TicketController.java

│   │   │           │   └── AdminDashboardController.java

│   │   │           ├── service/

│   │   │           │   ├── impl/

│   │   │           │   │   ├── AuthServiceImpl.java

│   │   │           │   │   ├── MovieServiceImpl.java

│   │   │           │   │   ├── TheatreServiceImpl.java

│   │   │           │   │   ├── ScreenServiceImpl.java

│   │   │           │   │   ├── ShowServiceImpl.java

│   │   │           │   │   ├── SeatServiceImpl.java

│   │   │           │   │   ├── BookingServiceImpl.java

│   │   │           │   │   ├── PaymentServiceImpl.java

│   │   │           │   │   ├── TicketServiceImpl.java

│   │   │           │   │   └── DashboardServiceImpl.java

│   │   │           │   ├── AuthService.java

│   │   │           │   ├── MovieService.java

│   │   │           │   ├── TheatreService.java

│   │   │           │   ├── ScreenService.java

│   │   │           │   ├── ShowService.java

│   │   │           │   ├── SeatService.java

│   │   │           │   ├── BookingService.java

│   │   │           │   ├── PaymentService.java

│   │   │           │   ├── TicketService.java

│   │   │           │   └── DashboardService.java

│   │   │           ├── repository/

│   │   │           │   ├── UserRepository.java

│   │   │           │   ├── MovieRepository.java

│   │   │           │   ├── TheatreRepository.java

│   │   │           │   ├── ScreenRepository.java

│   │   │           │   ├── ShowRepository.java

│   │   │           │   ├── SeatRepository.java

│   │   │           │   ├── ShowSeatRepository.java

│   │   │           │   ├── SeatLockRepository.java

│   │   │           │   ├── BookingRepository.java

│   │   │           │   ├── BookingSeatRepository.java

│   │   │           │   ├── PaymentRepository.java

│   │   │           │   └── TicketRepository.java

│   │   │           ├── entity/

│   │   │           │   ├── User.java

│   │   │           │   ├── Movie.java

│   │   │           │   ├── Theatre.java

│   │   │           │   ├── Screen.java

│   │   │           │   ├── Show.java

│   │   │           │   ├── Seat.java

│   │   │           │   ├── ShowSeat.java

│   │   │           │   ├── SeatLock.java

│   │   │           │   ├── Booking.java

│   │   │           │   ├── BookingSeat.java

│   │   │           │   ├── Payment.java

│   │   │           │   └── Ticket.java

│   │   │           ├── dto/

│   │   │           │   ├── request/

│   │   │           │   │   ├── LoginRequest.java

│   │   │           │   │   ├── RegisterRequest.java

│   │   │           │   │   ├── MovieRequest.java

│   │   │           │   │   ├── TheatreRequest.java

│   │   │           │   │   ├── ScreenRequest.java

│   │   │           │   │   ├── ShowRequest.java

│   │   │           │   │   ├── BookingRequest.java

│   │   │           │   │   └── PaymentRequest.java

│   │   │           │   └── response/

│   │   │           │       ├── AuthResponse.java

│   │   │           │       ├── MovieResponse.java

│   │   │           │       ├── TheatreResponse.java

│   │   │           │       ├── ScreenResponse.java

│   │   │           │       ├── ShowResponse.java

│   │   │           │       ├── BookingResponse.java

│   │   │           │       ├── PaymentResponse.java

│   │   │           │       ├── TicketResponse.java

│   │   │           │       └── DashboardResponse.java

│   │   │           ├── exception/

│   │   │           │   ├── ResourceNotFoundException.java

│   │   │           │   ├── SeatAlreadyBookedException.java

│   │   │           │   ├── InvalidBookingException.java

│   │   │           │   ├── PaymentFailedException.java

│   │   │           │   └── GlobalExceptionHandler.java

│   │   │           ├── enums/

│   │   │           │   ├── Role.java

│   │   │           │   ├── SeatType.java

│   │   │           │   ├── SeatStatus.java

│   │   │           │   ├── BookingStatus.java

│   │   │           │   ├── PaymentStatus.java

│   │   │           │   └── PaymentMethod.java

│   │   │           ├── scheduler/

│   │   │           │   └── SeatLockCleanupScheduler.java

│   │   │           ├── websocket/

│   │   │           │   └── SeatUpdateWebSocketHandler.java

│   │   │           └── util/

│   │   │               ├── SeatGenerationUtil.java

│   │   │               ├── QRCodeGenerator.java

│   │   │               └── EmailService.java

│   │   └── resources/

│   │       ├── application.properties

│   │       ├── application-dev.properties

│   │       ├── application-prod.properties

│   │       └── data.sql

│   └── test/

│       └── java/

│           └── com/

│               └── moviehub/

│                   ├── service/

│                   ├── controller/

│                   └── repository/

├── pom.xml

├── .gitignore

└── README.md

3 / 10 tasks done

Thought for 1s

4\. Database Entities

4.1 User Entity





Table: users

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- username (VARCHAR, UNIQUE, NOT NULL)

\- email (VARCHAR, UNIQUE, NOT NULL)

\- password (VARCHAR, NOT NULL)

\- role (ENUM: ADMIN, CUSTOMER)

\- firstName (VARCHAR)

\- lastName (VARCHAR)

\- phoneNumber (VARCHAR)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

\- enabled (BOOLEAN, DEFAULT: true)

4.2 Movie Entity





Table: movies

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- title (VARCHAR, NOT NULL)

\- description (TEXT)

\- genre (VARCHAR)

\- language (VARCHAR)

\- duration (INT) - in minutes

\- releaseDate (DATE)

\- rating (DECIMAL)

\- posterUrl (VARCHAR)

\- trailerUrl (VARCHAR)

\- cast (TEXT)

\- director (VARCHAR)

\- status (ENUM: NOW\_SHOWING, COMING\_SOON, ENDED)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.3 Theatre Entity





Table: theatres

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- name (VARCHAR, NOT NULL)

\- address (VARCHAR)

\- city (VARCHAR)

\- state (VARCHAR)

\- zipCode (VARCHAR)

\- phoneNumber (VARCHAR)

\- email (VARCHAR)

\- totalScreens (INT)

\- amenities (TEXT)

\- status (ENUM: ACTIVE, INACTIVE)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.4 Screen Entity





Table: screens

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- theatreId (BIGINT, FK -> theatres.id)

\- screenNumber (INT, NOT NULL)

\- name (VARCHAR)

\- totalRows (INT)

\- totalColumns (INT)

\- totalSeats (INT)

\- screenType (ENUM: 2D, 3D, IMAX, 4DX)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.5 Show Entity





Table: shows

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- movieId (BIGINT, FK -> movies.id)

\- screenId (BIGINT, FK -> screens.id)

\- showDate (DATE, NOT NULL)

\- startTime (TIME, NOT NULL)

\- endTime (TIME)

\- basePrice (DECIMAL, NOT NULL)

\- status (ENUM: SCHEDULED, CANCELLED, COMPLETED)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.6 Seat Entity (Template)





Table: seats

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- screenId (BIGINT, FK -> screens.id)

\- rowNumber (VARCHAR, NOT NULL)

\- seatNumber (INT, NOT NULL)

\- seatType (ENUM: STANDARD, PREMIUM, VIP, RECLINER)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.7 ShowSeat Entity (Instance)





Table: show\_seats

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- showId (BIGINT, FK -> shows.id)

\- seatId (BIGINT, FK -> seats.id)

\- status (ENUM: AVAILABLE, BOOKED, RESERVED, MAINTENANCE)

\- price (DECIMAL)

\- version (INT, DEFAULT: 0) - For optimistic locking

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.8 SeatLock Entity





Table: seat\_locks

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- showSeatId (BIGINT, FK -> show\_seats.id)

\- userId (BIGINT, FK -> users.id)

\- lockedAt (TIMESTAMP, NOT NULL)

\- expiresAt (TIMESTAMP, NOT NULL)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.9 Booking Entity





Table: bookings

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- userId (BIGINT, FK -> users.id)

\- showId (BIGINT, FK -> shows.id)

\- bookingNumber (VARCHAR, UNIQUE, NOT NULL)

\- totalSeats (INT)

\- totalAmount (DECIMAL)

\- bookingStatus (ENUM: PENDING, CONFIRMED, CANCELLED, EXPIRED)

\- cancellationReason (TEXT)

\- bookingTime (TIMESTAMP)

\- expiryTime (TIMESTAMP)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.10 BookingSeat Entity





Table: booking\_seats

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- bookingId (BIGINT, FK -> bookings.id)

\- showSeatId (BIGINT, FK -> show\_seats.id)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.11 Payment Entity





Table: payments

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- bookingId (BIGINT, FK -> bookings.id)

\- paymentAmount (DECIMAL, NOT NULL)

\- paymentMethod (ENUM: CREDIT\_CARD, DEBIT\_CARD, UPI, NET\_BANKING, WALLET)

\- paymentGateway (VARCHAR)

\- paymentStatus (ENUM: PENDING, SUCCESS, FAILED, REFUNDED)

\- transactionId (VARCHAR, UNIQUE)

\- paymentTime (TIMESTAMP)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4.12 Ticket Entity





Table: tickets

\- id (BIGINT, PK, AUTO\_INCREMENT)

\- bookingId (BIGINT, FK -> bookings.id)

\- ticketNumber (VARCHAR, UNIQUE, NOT NULL)

\- qrCode (VARCHAR)

\- showSeatId (BIGINT, FK -> show\_seats.id)

\- ticketStatus (ENUM: VALID, USED, CANCELLED, EXPIRED)

\- issuedAt (TIMESTAMP)

\- validUntil (TIMESTAMP)

\- createdAt (TIMESTAMP)

\- updatedAt (TIMESTAMP)

4 / 10 tasks done

Thought for 1s

5\. Entity Relationships

5.1 Entity Relationship Diagram (ERD)





┌─────────────┐         ┌─────────────┐         ┌─────────────┐

│    User     │         │   Theatre   │         │   Movie     │

├─────────────┤         ├─────────────┤         ├─────────────┤

│ id (PK)     │         │ id (PK)     │         │ id (PK)     │

│ username    │         │ name        │         │ title       │

│ email       │         │ address     │         │ description │

│ password    │         │ city        │         │ genre       │

│ role        │         │ state       │         │ language    │

│ firstName   │         │ zipCode     │         │ duration    │

│ lastName    │         │ phoneNumber │         │ releaseDate │

│ phoneNumber │         │ email       │         │ rating      │

│ createdAt   │         │ createdAt   │         │ posterUrl   │

│ updatedAt   │         │ updatedAt   │         │ trailerUrl  │

└──────┬──────┘         └──────┬──────┘         │ cast        │

&#x20;      │                       │                 │ director    │

&#x20;      │ 1                    │ 1               │ status      │

&#x20;      │                       │                 │ createdAt   │

&#x20;      │ N                    │ N               │ updatedAt   │

&#x20;      │                       │                 └──────┬──────┘

&#x20;      ▼                       ▼                        │

┌─────────────┐         ┌─────────────┐                │ 1

│  Booking    │         │   Screen    │                │

├─────────────┤         ├─────────────┤                │ N

│ id (PK)     │         │ id (PK)     │                │

│ userId (FK) │◄────────│ theatreId   │                ▼

│ showId (FK) │         │ screenNumber│         ┌─────────────┐

│ bookingNo   │         │ totalRows   │         │    Show     │

│ totalSeats  │         │ totalCols   │         ├─────────────┤

│ totalAmount │         │ totalSeats  │         │ id (PK)     │

│ status      │         │ screenType  │         │ movieId(FK) │

│ cancelReason│         │ createdAt   │         │ screenId(FK)│

│ bookingTime │         │ updatedAt   │         │ showDate    │

│ expiryTime  │         └──────┬──────┘         │ startTime   │

│ createdAt   │                │                │ endTime     │

│ updatedAt   │                │ 1              │ basePrice   │

└──────┬──────┘                │                │ status      │

&#x20;      │                       │ N              │ createdAt   │

&#x20;      │ 1                     │                │ updatedAt   │

&#x20;      │                       │                └──────┬──────┘

&#x20;      │ N                     ▼                       │ 1

&#x20;      │               ┌─────────────┐                │

&#x20;      │               │    Seat     │                │ N

&#x20;      │               ├─────────────┤                │

&#x20;      │               │ id (PK)     │                ▼

&#x20;      │               │ screenId(FK)│         ┌─────────────┐

&#x20;      │               │ rowNumber   │         │  ShowSeat   │

&#x20;      │               │ seatNumber  │         ├─────────────┤

&#x20;      │               │ seatType    │         │ id (PK)     │

&#x20;      │               │ createdAt   │         │ showId (FK) │

&#x20;      │               │ updatedAt   │         │ seatId (FK) │

&#x20;      │               └──────┬──────┘         │ status      │

&#x20;      │                      │                │ price       │

&#x20;      │                      │ 1              │ version     │

&#x20;      │                      │                │ createdAt   │

&#x20;      │                      │ N              │ updatedAt   │

&#x20;      │                      ▼                └──────┬──────┘

&#x20;      │               ┌─────────────┐                │ 1

&#x20;      │               │  SeatLock   │                │

&#x20;      │               ├─────────────┤                │ N

&#x20;      │               │ id (PK)     │                │

&#x20;      │               │ showSeatId  │                ▼

&#x20;      │               │ userId (FK) │         ┌─────────────┐

&#x20;      │               │ lockedAt    │         │ BookingSeat │

&#x20;      │               │ expiresAt   │         ├─────────────┤

&#x20;      │               │ createdAt   │         │ id (PK)     │

&#x20;      │               │ updatedAt   │         │ bookingId   │

&#x20;      │               └─────────────┘         │ showSeatId  │

&#x20;      │                                        │ createdAt   │

&#x20;      │ 1                                     │ updatedAt   │

&#x20;      │                                       └──────┬──────┘

&#x20;      │ N                                            │

&#x20;      ▼                                             │

┌─────────────┐                               ┌──────┴──────┐

│  Payment    │                               │   Ticket    │

├─────────────┤                               ├─────────────┤

│ id (PK)     │                               │ id (PK)     │

│ bookingId   │◄──────────────────────────────│ bookingId   │

│ amount      │                               │ ticketNo    │

│ method      │                               │ qrCode      │

│ gateway     │                               │ showSeatId  │

│ status      │                               │ status      │

│ transaction │                               │ issuedAt    │

│ paymentTime │                               │ validUntil  │

│ createdAt   │                               │ createdAt   │

│ updatedAt   │                               │ updatedAt   │

└─────────────┘                               └─────────────┘

5.2 Relationship Details

Entity 1	Relationship	Entity 2	Cardinality	Description

User	has many	Booking	1:N	One user can make multiple bookings

Theatre	has many	Screen	1:N	One theatre has multiple screens

Screen	has many	Seat	1:N	One screen has multiple seat templates

Screen	has many	Show	1:N	One screen can host multiple shows

Movie	has many	Show	1:N	One movie can have multiple shows

Show	has many	ShowSeat	1:N	One show has multiple seat instances

Seat	has many	ShowSeat	1:N	One seat template creates multiple seat instances

ShowSeat	has many	SeatLock	1:N	One show seat can have multiple lock records (historical)

ShowSeat	has many	BookingSeat	1:N	One show seat can be in multiple bookings (cancelled)

ShowSeat	has one	Ticket	1:1	One show seat has one active ticket

Show	has many	Booking	1:N	One show can have multiple bookings

Booking	has one	Payment	1:1	One booking has one payment

Booking	has many	BookingSeat	1:N	One booking has multiple booking seats

BookingSeat	has one	ShowSeat	N:1	One booking seat references one show seat

Booking	has many	Ticket	1:N	One booking generates multiple tickets

SeatLock	has one	User	N:1	One seat lock belongs to one user

SeatLock	has one	ShowSeat	N:1	One seat lock references one show seat

5.3 Cascade Operations

User → Booking: CASCADE DELETE (when user is deleted, bookings are deleted)

Theatre → Screen: CASCADE DELETE

Screen → Seat: CASCADE DELETE

Screen → Show: CASCADE DELETE

Movie → Show: CASCADE DELETE

Show → ShowSeat: CASCADE DELETE

Show → Booking: CASCADE DELETE

Booking → Payment: CASCADE DELETE

Booking → BookingSeat: CASCADE DELETE

Booking → Ticket: CASCADE DELETE

SeatLock: No cascade (historical records retained)

5.4 Optimistic Locking

ShowSeat entity includes version field for optimistic locking

When updating ShowSeat status, version is checked and incremented

Prevents concurrent booking conflicts

On version mismatch, operation fails with exception

5 / 10 tasks done

Thought for 1s

6\. API Modules

6.1 Authentication Module

Base Path: /api/auth



Endpoint	Method	Description	Request Body	Response	Auth Required

/register	POST	Register new user	RegisterRequest	AuthResponse	No

/login	POST	User login	LoginRequest	AuthResponse (JWT)	No

/logout	POST	User logout	-	Message	Yes

/refresh	POST	Refresh JWT token	RefreshTokenRequest	AuthResponse	No

/profile	GET	Get user profile	-	UserResponse	Yes

/profile	PUT	Update user profile	UpdateProfileRequest	UserResponse	Yes

/forgot-password	POST	Request password reset	ForgotPasswordRequest	Message	No

/reset-password	POST	Reset password	ResetPasswordRequest	Message	No

6.2 Movie Module

Base Path: /api/movies



Endpoint	Method	Description	Request Body	Response	Auth Required

/	GET	Get all movies (paginated)	Query params	Page	No

/{id}	GET	Get movie by ID	-	MovieResponse	No

/	POST	Create new movie	MovieRequest	MovieResponse	Yes (Admin)

/{id}	PUT	Update movie	MovieRequest	MovieResponse	Yes (Admin)

/{id}	DELETE	Delete movie	-	Message	Yes (Admin)

/now-showing	GET	Get now showing movies	-	List	No

/coming-soon	GET	Get coming soon movies	-	List	No

/search	GET	Search movies	Query params	List	No

6.3 Theatre Module

Base Path: /api/theatres



Endpoint	Method	Description	Request Body	Response	Auth Required

/	GET	Get all theatres	Query params	Page<	No

/{id}	GET	Get theatre by ID	-	TheatreResponse	No

/	POST	Create new theatre	TheatreRequest	TheatreResponse	Yes (Admin)

/{id}	PUT	Update theatre	TheatreRequest	TheatreResponse	Yes (Admin)

/{id}	DELETE	Delete theatre	-	Message	Yes (Admin)

/{id}/screens	GET	Get screens by theatre	-	List<	No

/city/{city}	GET	Get theatres by city	-	List<	No

6.4 Screen Module

Base Path: /api/screens



Endpoint	Method	Description	Request Body	Response	Auth Required

/	GET	Get all screens	Query params	Page<	No

/{id}	GET	Get screen by ID	-	ScreenResponse	No

/	POST	Create new screen	ScreenRequest	ScreenResponse	Yes (Admin)

/{id}	PUT	Update screen	ScreenRequest	ScreenResponse	Yes (Admin)

/{id}	DELETE	Delete screen	-	Message	Yes (Admin)

/{id}/seats	GET	Get seat template for screen	-	List<	No

/{id}/generate-seats	POST	Generate seat template	-	Message	Yes (Admin)

6.5 Show Module

Base Path: /api/shows



Endpoint	Method	Description	Request Body	Response	Auth Required

/	GET	Get all shows	Query params	Page<	No

/{id}	GET	Get show by ID	-	ShowResponse	No

/	POST	Create new show	ShowRequest	ShowResponse	Yes (Admin)

/{id}	PUT	Update show	ShowRequest	ShowResponse	Yes (Admin)

/{id}	DELETE	Delete show	-	Message	Yes (Admin)

/movie/{movieId}	GET	Get shows by movie	-	List<	No

/theatre/{theatreId}	GET	Get shows by theatre	-	List<	No

/screen/{screenId}	GET	Get shows by screen	-	List<	No

/{id}/show-seats	GET	Get show seats for show	-	List<	No

6.6 Seat Module

Base Path: /api/seats



Endpoint	Method	Description	Request Body	Response	Auth Required

/screen/{screenId}	GET	Get seat template	-	List<	No

/show/{showId}/available	GET	Get available show seats	-	List<	No

/lock	POST	Lock seats temporarily	LockSeatsRequest	LockResponse	Yes

/unlock	POST	Unlock seats	UnlockSeatsRequest	Message	Yes

/show/{showId}/layout	GET	Get seat layout with status	-	SeatLayoutResponse	No

6.7 Booking Module

Base Path: /api/bookings



Endpoint	Method	Description	Request Body	Response	Auth Required

/	GET	Get all bookings (admin)	Query params	Page<	Yes (Admin)

/my-bookings	GET	Get user bookings	Query params	Page<	Yes

/{id}	GET	Get booking by ID	-	BookingResponse	Yes

/	POST	Create new booking	BookingRequest	BookingResponse	Yes

/{id}	PUT	Update booking	BookingRequest	BookingResponse	Yes

/{id}/cancel	POST	Cancel booking	CancelBookingRequest	BookingResponse	Yes

/{id}/status	GET	Get booking status	-	StatusResponse	Yes

6.8 Payment Module

Base Path: /api/payments



Endpoint	Method	Description	Request Body	Response	Auth Required

/initiate	POST	Initiate payment	PaymentRequest	PaymentResponse	Yes

/process	POST	Process payment	ProcessPaymentRequest	PaymentResponse	Yes

/{id}	GET	Get payment by ID	-	PaymentResponse	Yes

/{id}/status	GET	Get payment status	-	StatusResponse	Yes

/booking/{bookingId}	GET	Get payment by booking	-	PaymentResponse	Yes

/{id}/refund	POST	Refund payment	-	PaymentResponse	Yes (Admin)

6.9 Ticket Module

Base Path: /api/tickets



Endpoint	Method	Description	Request Body	Response	Auth Required

/booking/{bookingId}	GET	Get tickets by booking	-	List	Yes

/{id}	GET	Get ticket by ID	-	TicketResponse	Yes

/{id}/qr	GET	Get QR code for ticket	-	QRCodeResponse	Yes

/{id}/validate	POST	Validate ticket	-	ValidationResponse	Yes (Admin)

/my-tickets	GET	Get user tickets	Query params	Page	Yes

/{id}/download	GET	Download e-ticket	-	PDF Response	Yes

6.10 Admin Dashboard Module

Base Path: /api/admin/dashboard



Endpoint	Method	Description	Request Body	Response	Auth Required

/analytics	GET	Get dashboard analytics	-	DashboardResponse	Yes (Admin)

/revenue	GET	Get revenue statistics	Query params	RevenueResponse	Yes (Admin)

/bookings	GET	Get booking statistics	Query params	BookingStatsResponse	Yes (Admin)

/movies	GET	Get movie statistics	-	MovieStatsResponse	Yes (Admin)

/theatres	GET	Get theatre statistics	-	TheatreStatsResponse	Yes (Admin)

users	GET	Get user statistics	-	UserStatsResponse	Yes (Admin)

/seat-locks	GET	Get active seat locks	-	List<	Yes (Admin)

6.11 WebSocket Endpoints

WebSocket Endpoint: /ws/seats



Message Types:



SEAT\_LOCKED: Notify clients when seats are locked

SEAT\_UNLOCKED: Notify clients when seats are unlocked

SEAT\_BOOKED: Notify clients when seats are booked

SHOW\_UPDATED: Notify clients when show details change

6 / 10 tasks done

Thought for 1s

7\. Booking Workflow

7.1 Complete Booking Flow Diagram





┌─────────────┐

│   Customer  │

└──────┬──────┘

&#x20;      │

&#x20;      │ 1. Browse Movies

&#x20;      ▼

┌─────────────┐

│ Movie List  │

└──────┬──────┘

&#x20;      │

&#x20;      │ 2. Select Movie

&#x20;      ▼

┌─────────────┐

│Movie Details│

└──────┬──────┘

&#x20;      │

&#x20;      │ 3. Select Show

&#x20;      ▼

┌─────────────┐

│Show Details │

└──────┬──────┘

&#x20;      │

&#x20;      │ 4. View Available ShowSeats

&#x20;      ▼

┌─────────────┐

│Seat Selection│

└──────┬──────┘

&#x20;      │

&#x20;      │ 5. Select ShowSeats

&#x20;      ▼

┌─────────────┐

│Lock ShowSeats│ (Database Lock)

└──────┬──────┘

&#x20;      │

&#x20;      │ 6. Review Booking

&#x20;      ▼

┌─────────────┐

│Booking Summary│

└──────┬──────┘

&#x20;      │

&#x20;      │ 7. Proceed to Payment

&#x20;      ▼

┌─────────────┐

│Payment Form │

└──────┬──────┘

&#x20;      │

&#x20;      │ 8. Process Payment

&#x20;      ▼

┌─────────────┐

│Payment Gateway│ (Simulation)

└──────┬──────┘

&#x20;      │

&#x20;      │ 9. Payment Success/Failure

&#x20;      ▼

┌─────────────┐

│Confirm Booking│

└──────┬──────┘

&#x20;      │

&#x20;      │ 10. Create BookingSeats

&#x20;      ▼

┌─────────────┐

│Update ShowSeat│ Status to BOOKED

└──────┬──────┘

&#x20;      │

&#x20;      │ 11. Generate E-Tickets

&#x20;      ▼

┌─────────────┐

│E-Ticket View │

└──────┬──────┘

&#x20;      │

&#x20;      │ 12. Send Confirmation

&#x20;      ▼

┌─────────────┐

│Booking Complete│

└─────────────┘

7.2 Booking State Machine





┌──────────┐

│ PENDING  │ (Initial State)

└────┬─────┘

&#x20;    │

&#x20;    │ Payment Initiated

&#x20;    ▼

┌──────────┐

│ PROCESSING│ (Payment in Progress)

└────┬─────┘

&#x20;    │

&#x20;    ├─────────────┐

&#x20;    │             │

&#x20;    │ Success     │ Failure

&#x20;    ▼             ▼

┌──────────┐  ┌──────────┐

│CONFIRMED │  │ CANCELLED│

└────┬─────┘  └──────────┘

&#x20;    │

&#x20;    │ User Cancels

&#x20;    ▼

┌──────────┐

│ CANCELLED│

└──────────┘

&#x20;

┌──────────┐

│ EXPIRED  │ (Timeout - 15 mins)

└──────────┘

7.3 Booking Process Steps

Step 1: Movie Selection



Customer browses movies by category (Now Showing, Coming Soon)

Filters by genre, language, rating

Views movie details (trailer, cast, director, synopsis, poster)

Step 2: Show Selection



Customer selects movie

System displays available shows (date, time, theatre, screen)

Customer filters by theatre, date, time

Customer selects specific show

Step 3: ShowSeat Selection



System loads ShowSeat instances for the show

Displays seat availability (Available, Booked, Reserved)

Customer selects ShowSeats (with price calculation)

System validates seat availability in real-time

Step 4: ShowSeat Locking



System creates SeatLock records for selected ShowSeats

Sets lock expiry timestamp (current + 10 minutes)

Updates ShowSeat status to RESERVED

Stores lock in database (no Redis)

WebSocket notification sent to all connected clients

Step 5: Booking Summary



System displays booking summary:

Movie details

Show details (theatre, screen, date, time)

Selected ShowSeats with prices

Total amount

Convenience fees

Tax breakdown

Step 6: Payment Processing



Customer selects payment method

Customer enters payment details

System validates payment details

System processes payment (simulated)

Payment gateway returns success/failure

Step 7: Booking Confirmation



If payment successful:

System confirms booking

Creates Booking record

Creates BookingSeat records linking booking to ShowSeats

Updates ShowSeat status to BOOKED

Deletes SeatLock records

Creates Payment record

Generates e-tickets for each ShowSeat

Generates QR codes for tickets

Sends confirmation email

WebSocket notification for seat updates

If payment failed:

System releases locked seats (delete SeatLock records)

Updates ShowSeat status back to AVAILABLE

Updates booking status to CANCELLED

Notifies customer of failure

Step 8: E-Ticket Generation



System generates unique ticket number for each ShowSeat

Generates QR code for each ticket

Sets ticket validity (show date + 24 hours)

Stores ticket in database

7.4 Booking Validation Rules

ShowSeat Availability: ShowSeats must be AVAILABLE at time of booking

Show Status: Show must be SCHEDULED (not CANCELLED or COMPLETED)

Booking Limit: Maximum 10 seats per booking

Time Limit: SeatLock expires after 10 minutes (handled by scheduler)

Payment Timeout: Payment must complete within 10 minutes

Cancellation Policy: Cancellation allowed up to 2 hours before show time

Refund Policy: Full refund if cancelled 24+ hours before show, 50% if 2-24 hours before

Optimistic Locking: ShowSeat version checked during status update

7 / 10 tasks done

Thought for 1s

8\. Seat Booking Workflow

8.1 Seat Selection Flow Diagram





┌─────────────┐

│  Select Show│

└──────┬──────┘

&#x20;      │

&#x20;      │ 1. Load Seat Template

&#x20;      ▼

┌─────────────┐

│ Fetch Screen│

│   Template  │

│   (Seat)    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 2. Generate ShowSeat Instances

&#x20;      ▼

┌─────────────┐

│ Create      │

│ ShowSeats   │

│ for Show    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 3. Check Existing Bookings

&#x20;      ▼

┌─────────────┐

│ Update ShowSeat│

│  Status     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 4. Render Seat Map

&#x20;      ▼

┌─────────────┐

│ Display Seat│

│   Layout    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 5. User Selects ShowSeats

&#x20;      ▼

┌─────────────┐

│ Highlight   │

│ Selected    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 6. Calculate Price

&#x20;      ▼

┌─────────────┐

│ Show Total  │

│   Price     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 7. Lock ShowSeats

&#x20;      ▼

┌─────────────┐

│ Create      │

│ SeatLock    │

│ Records     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 8. WebSocket Notification

&#x20;      ▼

┌─────────────┐

│ Notify All  │

│ Clients     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 9. Proceed to Booking

&#x20;      ▼

┌─────────────┐

│ Confirm     │

│  Booking    │

└─────────────┘

8.2 ShowSeat State Machine





┌──────────┐

│AVAILABLE │ (Default State)

└────┬─────┘

&#x20;    │

&#x20;    ├─────────────┐

&#x20;    │             │

&#x20;    │ Lock        │ Book

&#x20;    ▼             ▼

┌──────────┐  ┌──────────┐

│ RESERVED │  │  BOOKED  │

└────┬─────┘  └──────────┘

&#x20;    │

&#x20;    │ Timeout (Scheduler)

&#x20;    │ or Unlock

&#x20;    ▼

┌──────────┐

│AVAILABLE │

└──────────┘

&#x20;

┌──────────┐

│MAINTENANCE│ (Admin sets)

└──────────┘

8.3 Seat Layout Generation Algorithm

Step 1: Screen Template Creation



Admin defines screen dimensions (rows × columns)

Admin sets seat types for different sections:

Standard seats (middle section)

Premium seats (front rows)

VIP seats (back rows)

Recliner seats (premium section)

System creates Seat records (template)

Step 2: ShowSeat Generation



When a show is created, system clones Seat template

Creates ShowSeat instances for the specific show

Sets show-specific pricing (may vary by show time)

Initializes all ShowSeats as AVAILABLE

Sets version field to 0 for optimistic locking

Step 3: Real-Time Status Updates



WebSocket connection for real-time seat updates

When ShowSeat is locked/booked, status updates immediately

All connected clients receive update via WebSocket

Prevents double booking

8.4 ShowSeat Pricing Strategy

Seat Type	Base Price	Weekend Surcharge	Holiday Surcharge	Prime Time Surcharge

Standard	$10	+20%	+30%	+15%

Premium	$15	+20%	+30%	+15%

VIP	$25	+20%	+30%	+15%

Recliner	$35	+20%	+30%	+15%

Prime Time: 6 PM - 10 PM on weekdays Weekend: Friday 6 PM - Sunday 11 PM Holiday: National holidays and festival days



8.5 ShowSeat Locking Process

Phase 1: Initial Request







Client → Server: POST /api/seats/lock

Request Body:

{

&#x20; "showId": 123,

&#x20; "showSeatIds": \[456, 457, 458],

&#x20; "userId": 789

}

Phase 2: Server Validation



Check if show exists and is SCHEDULED

Check if all ShowSeats are AVAILABLE

Check if ShowSeats are not in MAINTENANCE

Check if user has no conflicting locks

Validate booking limit (max 10 seats)

Use optimistic locking: check version of each ShowSeat

Phase 3: Lock ShowSeats



Create SeatLock records for each ShowSeat

Update ShowSeat status to RESERVED

Increment ShowSeat version (optimistic locking)

Set lock expiry timestamp (current + 10 minutes)

Store in database (no Redis)

Phase 4: WebSocket Notification



Broadcast seat lock event to all connected clients

Message includes showId and locked showSeatIds

Clients update seat map in real-time

Phase 5: Response







Server → Client: 200 OK

Response Body:

{

&#x20; "lockId": "LOCK-123456",

&#x20; "expiryTime": "2024-01-15T14:30:00Z",

&#x20; "totalAmount": 45.00,

&#x20; "showSeats": \[

&#x20;   {"id": 456, "row": "A", "number": 1, "price": 15.00},

&#x20;   {"id": 457, "row": "A", "number": 2, "price": 15.00},

&#x20;   {"id": 458, "row": "A", "number": 3, "price": 15.00}

&#x20; ]

}

8.6 SeatLock Cleanup Scheduler

Scheduler Configuration



Runs every 1 minute

Checks for expired SeatLock records

Uses Spring @Scheduled annotation

Cleanup Process







1\. Query SeatLock records where expiresAt < NOW

2\. For each expired lock:

&#x20;  - Delete SeatLock record

&#x20;  - Update ShowSeat status from RESERVED to AVAILABLE

&#x20;  - Increment ShowSeat version

&#x20;  - Send WebSocket notification

3\. Log cleanup statistics

Scheduler Implementation







java

@Scheduled(fixedRate = 60000) // Every 1 minute

public void cleanupExpiredLocks() {

&#x20;   List<<SeatLock> expiredLocks = seatLockRepository

&#x20;       .findByExpiresAtBefore(LocalDateTime.now());

&#x20;   

&#x20;   for (SeatLock lock : expiredLocks) {

&#x20;       ShowSeat showSeat = lock.getShowSeat();

&#x20;       showSeat.setStatus(SeatStatus.AVAILABLE);

&#x20;       showSeatRepository.save(showSeat);

&#x20;       seatLockRepository.delete(lock);

&#x20;       

&#x20;       // WebSocket notification

&#x20;       webSocketHandler.notifySeatUnlocked(

&#x20;           showSeat.getShow().getId(),

&#x20;           showSeat.getId()

&#x20;       );

&#x20;   }

}

8.7 Concurrent Booking Prevention

Optimistic Locking Strategy



ShowSeat entity includes version field

On lock attempt:

Read ShowSeat with current version

Validate status is AVAILABLE

Update with incremented version

If version mismatch, retry or fail

Database Transaction



All ShowSeat updates in single transaction

Atomic operation for multiple ShowSeats

Rollback on any failure

Database-Level Constraints



Unique constraint on (showId, seatId) for ShowSeat

Check constraint for status transitions

Foreign key constraints for referential integrity

8.8 Seat Map Visualization

Frontend Rendering



Grid layout based on rows and columns from Seat template

Color coding:

Green: Available (ShowSeat status = AVAILABLE)

Red: Booked (ShowSeat status = BOOKED)

Yellow: Reserved (ShowSeat status = RESERVED by current user)

Orange: Reserved by others (ShowSeat status = RESERVED by other user)

Gray: Maintenance (ShowSeat status = MAINTENANCE)

Blue: Selected

Legend showing seat types and prices

Screen orientation indicator

Aisle gaps for visual separation

Interactive Features



Hover to show seat details (type, price)

Click to select/deselect

Filter by seat type

Auto-select best available seats

Accessibility features (wheelchair accessible seats)

WebSocket Integration



Client connects to /ws/seats endpoint

Subscribes to show-specific updates

Receives real-time seat status changes

Updates seat map without page refresh

8 / 10 tasks done

Thought for 1s

9\. Security Architecture

9.1 Authentication \& Authorization Flow





┌─────────────┐

│   Client    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 1. Login Request

&#x20;      ▼

┌─────────────┐

│   Spring    │

│  Security   │

│  Filter     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 2. Validate Credentials

&#x20;      ▼

┌─────────────┐

│ Custom User  │

│ Details Svc  │

└──────┬──────┘

&#x20;      │

&#x20;      │ 3. Generate JWT

&#x20;      ▼

┌─────────────┐

│ JWT Provider│

└──────┬──────┘

&#x20;      │

&#x20;      │ 4. Return Token

&#x20;      ▼

┌─────────────┐

│   Client    │ (Store in localStorage)

└──────┬──────┘

&#x20;      │

&#x20;      │ 5. API Request with JWT

&#x20;      ▼

┌─────────────┐

│ JWT Auth    │

│  Filter     │

└──────┬──────┘

&#x20;      │

&#x20;      │ 6. Validate Token

&#x20;      ▼

┌─────────────┐

│  Security   │

│  Context    │

└──────┬──────┘

&#x20;      │

&#x20;      │ 7. Check Permissions

&#x20;      ▼

┌─────────────┐

│  Controller │

└─────────────┘

9.2 Security Package Structure

Package: com.moviehub.security







security/

├── SecurityConfig.java              // Main security configuration

├── JwtAuthenticationFilter.java     // JWT request filter

├── JwtTokenProvider.java            // JWT token generation/validation

└── CustomUserDetailsService.java    // User details load from database

9.3 SecurityConfig

Configuration Details



Extends WebSecurityConfigurerAdapter

Configures HTTP security rules

Sets up authentication entry points

Configures CORS

Disables CSRF for stateless API

Sets up JWT authentication filter

Security Rules



Public endpoints: /api/auth/\*\*, /api/movies/\*\* (GET), /api/theatres/\*\* (GET), /api/shows/\*\* (GET)

Admin endpoints: /api/admin/\*\*, /api/movies/\*\* (POST/PUT/DELETE), /api/theatres/\*\* (POST/PUT/DELETE)

Customer endpoints: /api/bookings/\*\*, /api/payments/\*\*, /api/tickets/my-tickets

All other endpoints: Require authentication

9.4 JwtAuthenticationFilter

Responsibilities



Extends OncePerRequestFilter

Extracts JWT from Authorization header

Validates token using JwtTokenProvider

Sets authentication in SecurityContext

Handles token expiration

Filter Chain







1\. Extract JWT from "Authorization: Bearer <token>" header

2\. If no token, continue to next filter

3\. If token present, validate using JwtTokenProvider

4\. If valid, extract username and authorities

5\. Create UsernamePasswordAuthenticationToken

6\. Set authentication in SecurityContext

7\. Continue to next filter

9.5 JwtTokenProvider

Responsibilities



Generate JWT tokens

Validate JWT tokens

Extract claims from tokens

Check token expiration

Token Configuration



Secret key: Stored in application.properties

Access token validity: 1 hour

Refresh token validity: 7 days

Algorithm: HS256

Methods



generateToken(UserDetails userDetails): Generate access token

generateRefreshToken(UserDetails userDetails): Generate refresh token

validateToken(String token): Validate token signature and expiration

getUsernameFromToken(String token): Extract username from token

getAuthoritiesFromToken(String token): Extract authorities from token

9.6 CustomUserDetailsService

Responsibilities



Implements UserDetailsService interface

Loads user details from database

Converts User entity to UserDetails

Handles user not found scenarios

Implementation







java

@Service

public class CustomUserDetailsService implements UserDetailsService {

&#x20;   

&#x20;   @Autowired

&#x20;   private UserRepository userRepository;

&#x20;   

&#x20;   @Override

&#x20;   public UserDetails loadUserByUsername(String username) 

&#x20;           throws UsernameNotFoundException {

&#x20;       User user = userRepository.findByUsername(username)

&#x20;           .orElseThrow(() -> new UsernameNotFoundException(

&#x20;               "User not found with username: " + username));

&#x20;       

&#x20;       return User.builder()

&#x20;           .username(user.getUsername())

&#x20;           .password(user.getPassword())

&#x20;           .authorities(getAuthorities(user.getRole()))

&#x20;           .accountLocked(!user.isEnabled())

&#x20;           .build();

&#x20;   }

&#x20;   

&#x20;   private Collection<? extends GrantedAuthority> getAuthorities(Role role) {

&#x20;       return Collections.singletonList(

&#x20;           new SimpleGrantedAuthority("ROLE\_" + role.name()));

&#x20;   }

}

9.7 JWT Token Structure

Access Token Payload







json

{

&#x20; "sub": "user123",

&#x20; "email": "user@example.com",

&#x20; "role": "CUSTOMER",

&#x20; "authorities": \["ROLE\_CUSTOMER"],

&#x20; "iat": 1705310400,

&#x20; "exp": 1705314000

}

Refresh Token Payload







json

{

&#x20; "sub": "user123",

&#x20; "tokenType": "REFRESH",

&#x20; "iat": 1705310400,

&#x20; "exp": 1705396800

}

9.8 Token Lifecycle

Token Type	Validity	Purpose	Storage

Access Token	1 hour	API authentication	localStorage

Refresh Token	7 days	Obtain new access token	HttpOnly Cookie

9.9 Role-Based Access Control (RBAC)

Roles



ADMIN: Full system access

Manage movies, theatres, screens, shows

View all bookings and payments

Access dashboard analytics

Manage users

View active seat locks

CUSTOMER: Limited access

View movies and shows

Book tickets

View own bookings

Cancel own bookings

Access own tickets

Permission Matrix



Resource	Admin	Customer	Public

Movies (Read)	✓	✓	✓

Movies (Write)	✓	✗	✗

Theatres (Read)	✓	✓	✓

Theatres (Write)	✓	✗	✗

Shows (Read)	✓	✓	✓

Shows (Write)	✓	✗	✗

Bookings (All)	✓	✗	✗

Bookings (Own)	✓	✓	✗

Payments (All)	✓	✗	✗

Payments (Own)	✓	✓	✗

Dashboard	✓	✗	✗

Seat Locks	✓	✗	✗

9.10 Security Configuration

Spring Security Configuration



Password encoding using BCrypt (strength: 10)

CORS configuration for frontend origin

CSRF disabled for stateless API

Session management: STATELESS

JWT authentication filter

Exception handling for 401/403

Security Headers



X-Content-Type-Options: nosniff

X-Frame-Options: DENY

X-XSS-Protection: 1; mode=block

Strict-Transport-Security: max-age=31536000

Content-Security-Policy: default-src 'self'

9.11 Input Validation

Validation Layers



Frontend: React form validation

Backend: JSR-303 Bean Validation

Database: Column constraints

Validation Rules



Email: Valid email format

Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special

Phone: 10-digit numeric

Username: Alphanumeric, 3-20 chars

Amount: Positive decimal

Date: Future dates only for bookings

9.12 API Security

Rate Limiting



Login endpoint: 5 attempts per 15 minutes per IP

Booking endpoint: 10 requests per minute per user

General API: 100 requests per minute per IP

Request Signing



Sensitive endpoints require additional verification

Payment requests include checksum validation

Booking requests include timestamp validation

SQL Injection Prevention



JPA/Hibernate parameterized queries

No raw SQL queries

Input sanitization

9.13 Data Protection

Sensitive Data Handling



Passwords: Never logged, hashed only

Payment details: Never stored, tokenized

PII: Encrypted at rest

JWT: Signed with secret key

Encryption



Password: BCrypt hashing

Database: AES-256 for sensitive fields

Transmission: TLS 1.3

9.14 Session Management

Session Timeout



Access token: 1 hour

Refresh token: 7 days

Inactivity timeout: 30 minutes

Remember me: 30 days

Token Refresh Flow







1\. Access token expires

2\. Client sends refresh token (HttpOnly cookie)

3\. Server validates refresh token

4\. Server generates new access token

5\. Server returns new access token

6\. Client updates stored token

9.15 Audit Logging

Logged Events



User login/logout

Failed authentication attempts

Booking creation/cancellation

Payment processing

Admin actions

API access (for sensitive endpoints)

Seat lock operations

Log Details



Timestamp

User ID

Action performed

IP address

User agent

Request/response data (sanitized)

9 / 10 tasks done

Thought for 1s

10\. Deployment Architecture

10.1 Deployment Architecture Diagram





┌─────────────────────────────────────────────────────────────────┐

│                         CLIENT LAYER                             │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │   Browser    │  │   Mobile     │  │   Desktop    │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │ HTTPS

&#x20;                             │

┌─────────────────────────────────────────────────────────────────┐

│                      WEB SERVER                                  │

│                    (Nginx / Apache)                              │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │   SSL/TLS    │  │   Static     │  │   Reverse    │          │

│  │ Termination  │  │   Files      │  │   Proxy      │          │

│  └──────────────┘  └──────────────┘  └──────────────┘          │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             │

&#x20;       ┌─────────────────────┴─────────────────────┐

&#x20;       │                                           │

┌───────▼────────┐                          ┌───────▼────────┐

│  FRONTEND       │                          │  BACKEND       │

│  (React SPA)    │                          │  (Spring Boot) │

│  ┌────────────┐ │                          │  ┌────────────┐ │

│  │  Build     │ │                          │  │  Tomcat    │ │

│  │  Files     │ │                          │  │  Embedded  │ │

│  └────────────┘ │                          │  └────────────┘ │

└────────────────┘                          └────────────────┘

&#x20;       │                                           │

&#x20;       │                                           │

&#x20;       └───────────────────┬───────────────────────┘

&#x20;                           │

&#x20;                           │

┌───────────────────────────▼───────────────────────┐

│                    DATABASE LAYER                    │

│  ┌──────────────┐  ┌──────────────┐              │

│  │   MySQL      │  │   File       │              │

│  │   Database   │  │   Storage    │              │

│  │  (Local/     │  │   (Local)    │              │

│  │   Remote)    │  │              │              │

│  └──────────────┘  └──────────────┘              │

└───────────────────────────────────────────────────┘

10.2 Environment Configuration

Development Environment



Local machine setup

H2 Database (in-memory) or MySQL local

Hot reload enabled

Debug mode active

CORS allows all origins

Staging Environment



On-premise server or VPS

MySQL Database

Production-like configuration

Test data seeded

Production Environment



On-premise server or VPS

MySQL Database

Nginx/Apache web server

SSL/TLS certificate

Basic monitoring enabled

10.3 Infrastructure Components

Frontend Deployment



Build: React production build (npm run build)

Hosting: Nginx/Apache serving static files

Domain: Configured in DNS

SSL: Let's Encrypt or self-signed certificate

CI/CD: GitHub Actions or manual deployment

Backend Deployment



Platform: JAR file deployment

Java Version: OpenJDK 17

Application Server: Embedded Tomcat (Spring Boot)

Process Management: Systemd service or Docker container

Port: 8080 (or configured port)

Database Deployment



MySQL 8.0

Storage: Local disk or network storage

Backup: mysqldump scripts or database backup tool

Replication: Optional read replica for reporting

WebSocket Support



Spring Boot WebSocket configuration

STOMP protocol for messaging

SockJS fallback for browser compatibility

Port: 8080 (same as HTTP)

10.4 CI/CD Pipeline

Frontend Pipeline







1\. Code Push to GitHub

2\. GitHub Actions Triggered

3\. Install Dependencies (npm ci)

4\. Run Tests (npm test)

5\. Build Production (npm run build)

6\. Deploy to web server (scp/rsync)

7\. Restart web server (if needed)

8\. Notify Team (email/Slack)

Backend Pipeline







1\. Code Push to GitHub

2\. GitHub Actions Triggered

3\. Build with Maven (mvn clean package)

4\. Run Unit Tests (mvn test)

5\. Run Integration Tests (mvn verify)

6\. Build JAR file

7\. Deploy to server (scp/rsync)

8\. Restart application (systemctl restart)

9\. Health Check Validation

10\. Database Migration (Flyway/Liquibase)

11\. Notify Team (email/Slack)

10.5 Monitoring \& Logging

Application Monitoring



Tool: Spring Boot Actuator

Metrics: CPU, Memory, JVM metrics

Custom Metrics: Booking rate, Payment success rate, API response time

Alerts: Manual monitoring or simple scripts

Logging



Tool: Logback (Spring Boot default)

Log Levels: ERROR, WARN, INFO, DEBUG

Log Storage: File system

Log Retention: 30 days

Structured Logging: JSON format (optional)

Sensitive Data: Masked in logs

Error Tracking



Tool: Application logs

Manual error review

Email notifications for critical errors

Uptime Monitoring



Tool: Simple ping script or external service

Endpoint checks every 5 minutes

Alert on downtime

Email notifications

10.6 Backup \& Disaster Recovery

Database Backup



Automated daily backups using cron job

mysqldump command for backup

7-day retention period

Backup storage: Local disk or external storage

Application Backup



Code: Git repository (GitHub)

Configuration: Application properties files

Static Assets: Backup of build files

Logs: Log files (30-day retention)

Disaster Recovery Plan



RTO (Recovery Time Objective): 24 hours

RPO (Recovery Point Objective): 24 hours

Backup location: Local or external storage

Recovery process: Manual restore from backup

10.7 Scalability Strategy

Horizontal Scaling



Backend: Multiple instances behind load balancer (optional)

Database: Read replicas for read-heavy queries (optional)

Static files: CDN (optional)

Vertical Scaling



Database: Server upgrade during low traffic

Application: Server upgrade based on load

Caching Strategy



API Response Caching: In-memory cache (optional)

Static Asset Caching: Browser cache headers

Database Query Caching: Hibernate second-level cache (optional)

Session Caching: In-memory or database session storage

Load Balancing



Algorithm: Round-robin (if using load balancer)

Health Checks: HTTP endpoint /actuator/health

Session Affinity: Sticky sessions disabled (stateless)

10.8 Security in Production

Network Security



Firewall rules restricting access

Only necessary ports open (80, 443, 22)

WAF rules (if using WAF)

Application Security



HTTPS only (TLS 1.2+)

HSTS enabled

Security headers configured

Dependency scanning (manual or automated)

Regular security updates

Data Security



Database encryption at rest (optional)

Encryption in transit (TLS)

Secrets management: Environment variables or encrypted config files

Regular security patches

10.9 Cost Estimation (Monthly)

Component	Specification	Cost (USD)

Frontend Hosting	VPS or shared hosting	$10-20

Backend Server	VPS (2GB RAM, 1 CPU)	$10-20

Database	MySQL on same server	Included

Domain Name	.com domain	$10-15

SSL Certificate	Let's Encrypt (Free)	$0

Backup Storage	External storage (optional)	$5-10

Monitoring	Basic tools (free)	$0

Total		$35-65/month

10.10 Deployment Options

Option 1: Single Server Deployment



Frontend and Backend on same server

MySQL on same server

Nginx as reverse proxy

Suitable for small-scale deployment

Cost-effective

Option 2: Docker Deployment



Frontend in Docker container

Backend in Docker container

MySQL in Docker container

Docker Compose for orchestration

Easy to manage and scale

Option 3: Traditional Deployment



Frontend deployed to web server directory

Backend deployed as JAR with systemd service

MySQL as system service

Traditional approach, easy to debug



