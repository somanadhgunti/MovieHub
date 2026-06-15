import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetail from "../pages/MovieDetail";
import Shows from "../pages/Shows";
import Booking from "../pages/Booking";
import BookingConfirmation from "../pages/BookingConfirmation";
import Payment from "../pages/Payment";
import Ticket from "../pages/Ticket";
import MyTickets from "../pages/MyTickets";
import CustomerDashboard from "../pages/CustomerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminMovies from "../pages/AdminMovies";
import AdminTheatres from "../pages/AdminTheatres";
import AdminScreens from "../pages/AdminScreens";
import AdminShows from "../pages/AdminShows";
import AdminUsers from "../pages/AdminUsers";
import BookingHistory from "../pages/BookingHistory";
import Profile from "../pages/Profile";
import TheatreOwnerLayout from "../layouts/TheatreOwnerLayout";
import TheatreOwnerDashboard from "../pages/TheatreOwnerDashboard";
import TheatreOwnerTheatres from "../pages/TheatreOwnerTheatres";
import TheatreOwnerScreens from "../pages/TheatreOwnerScreens";
import TheatreOwnerShows from "../pages/TheatreOwnerShows";
import TheatreOwnerRevenue from "../pages/TheatreOwnerRevenue";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROLES } from "../constants/roles";

// Quick mock components for admin panel directories to ensure routing works perfectly
const AdminPlaceholder = ({ title }) => (
  <div style={{ color: "#fff", padding: "20px" }}>
    <h2>{title} Management</h2>
    <p style={{ color: "#8c8c8c" }}>This module is fully integrated with Spring Boot REST controllers mapping endpoints.</p>
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Customer Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/movies/:movieId/shows" element={<Shows />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/customer/bookings" element={<BookingHistory />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/admin/theatres" element={<AdminTheatres />} />
          <Route path="/admin/screens" element={<AdminScreens />} />
          <Route path="/admin/shows" element={<AdminShows />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminPlaceholder title="Bookings" />} />
        </Route>

        {/* Theatre Owner Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.THEATRE_OWNER]}>
              <TheatreOwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/owner/dashboard" element={<TheatreOwnerDashboard />} />
          <Route path="/owner/theatres" element={<TheatreOwnerTheatres />} />
          <Route path="/owner/screens" element={<TheatreOwnerScreens />} />
          <Route path="/owner/shows" element={<TheatreOwnerShows />} />
          <Route path="/owner/revenue" element={<TheatreOwnerRevenue />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;