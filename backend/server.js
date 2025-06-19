/*import assignmentRoutes from "./routes/assignment.js";
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");  // Add the node-fetch module for the server-side fetch requests

dotenv.config(); // Load environment variables

const app = express();

// Connect to DB
connectDB();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created.");
}

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});



// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/learners", require("./routes/learnerRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/instructors", require("./routes/instructorRoutes"));
app.use("/api/exams", require("./routes/aiExamRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));
// Add this line with your other routes
app.use("/api/recaptcha", require("./routes/recaptchaRoutes"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/lecture", require("./routes/lecture"));
//app.use("/api/attempt", require("./routes/attempt"));
app.use('/api/attempts', require("./routes/attempt"));
app.use("/api/progress", require("./routes/progressRoutes")); // Make sure this line exists
//app.use('/api/lecture', lectureRoutes);
app.use("/api/assignment", assignmentRoutes);


// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong!" });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));*/






/*const express = require("express");
const connectDB = require("./config/db"); 
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const assignmentRoutes = require("./routes/assignment");
const submissionRoutes = require("./routes/submission.routes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const aiExamRoutes = require("./routes/aiExamRoutes");
const supportRoutes = require("./routes/supportRoutes");
const recaptchaRoutes = require("./routes/recaptchaRoutes");
const quizRoutes = require("./routes/quiz");
const lectureRoutes = require("./routes/lecture");
const attemptRoutes = require("./routes/attempt");
const progressRoutes = require("./routes/progressRoutes");

dotenv.config(); // Load environment variables

const app = express();

// Connect to MongoDB
connectDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created.");
}

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Use API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/exams", aiExamRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/recaptcha", recaptchaRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong!" });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));*/




const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const { Server } = require("socket.io");
const axios = require("axios");
const fetch = require("node-fetch");

const bodyParser = require('body-parser');
// Connect DB
const connectDB = require("./config/db");

// Routes
const assignmentRoutes = require("./routes/assignment");
const submissionRoutes = require("./routes/submission.routes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const aiExamRoutes = require("./routes/aiExamRoutes");
const supportRoutes = require("./routes/supportRoutes");
const recaptchaRoutes = require("./routes/recaptchaRoutes");
const quizRoutes = require("./routes/quiz");
const lectureRoutes = require("./routes/lecture");
const attemptRoutes = require("./routes/attempt");
const progressRoutes = require("./routes/progressRoutes");

// Chat routes
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const ChatRoom = require("./models/ChatRoom");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});



// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created.");
}
app.use("/uploads", express.static(uploadsDir));


// Increase body size limit
app.use(bodyParser.json({ limit: '10mb' })); // or more if needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// LMS API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/exams", aiExamRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/recaptcha", recaptchaRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

// Chat API routes
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.get("/api/chat", (req, res) => {
  res.send("chat API is running...");
});
// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Add this to your server.js or app.js file

// Enable mongoose debugging
mongoose.set('debug', true);

// If you're using Express, add this middleware to log request body
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send_message", ({ chatRoomId, message }) => {
    io.to(chatRoomId).emit("receive_message", message);
  });

  socket.on("typing", ({ chatRoomId, senderName }) => {
    socket.to(chatRoomId).emit("typing", senderName);
  });

  socket.on("stop_typing", ({ chatRoomId }) => {
    socket.to(chatRoomId).emit("stop_typing");
  });

  socket.on("read_message", ({ chatRoomId, userId }) => {
    io.to(chatRoomId).emit("read_message", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: "Something went wrong!" });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
