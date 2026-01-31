// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import { verifyEmailConfig } from "./src/config/email.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Verify email configuration
verifyEmailConfig();

// Create Express app instance
const app = express();

// Define port (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
// Middleware functions run on every request before reaching your routes

// 1. CORS - Allows frontend (running on different port) to make requests
app.use(cors());

// 2. JSON Parser - Converts incoming JSON data to JavaScript objects
// Without this, req.body would be undefined
app.use(express.json());

// 3. URL Encoded Parser - Handles form data
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============
// Define API endpoints here

// Health check route - useful to verify server is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Stockavoo API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Mount authentication routes
// All routes in authRoutes will be prefixed with /api/auth
// Example: POST /api/auth/register, POST /api/auth/login
app.use("/api/auth", authRoutes);

// Mount user management routes
// All routes in userRoutes will be prefixed with /api/users
// Example: GET /api/users, POST /api/users, GET /api/users/me
app.use("/api/users", userRoutes);

// Test route to understand request/response
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "This is a test endpoint",
    explanation:
      "When you visit this URL, this JSON is sent back to the client",
  });
});

// Catch-all route for undefined endpoints (404 handler)
// In Express 5, we use a middleware without a path to catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

// ============ ERROR HANDLING ============
// Global error handler - catches any errors in the app
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Something went wrong!",
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Stockavoo API Server Running        ║
║   Port: ${PORT}                           ║
║   Environment: ${process.env.NODE_ENV || "development"}              ║
║   URL: http://localhost:${PORT}           ║
╚════════════════════════════════════════╝
  `);
});
