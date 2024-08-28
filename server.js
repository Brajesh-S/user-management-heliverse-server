//server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
require("dotenv").config();

const app = express();

app.use(
    cors({
      origin: ["http://localhost:3001"],
      methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Import routes
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
