const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const http = require("http"); // Thêm http để tạo server HTTP
const { Server } = require("socket.io"); // Thêm Socket.io
const { swaggerUi, swaggerDocs } = require("./Swagger/swagger.js");
const cors = require("cors");
const socket = require("./controller/socket.js");
const app = express();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000", // hoặc IP thiết bị di động nếu đang dùng Expo
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Routes
const userroutes = require("./routes/index.js");
const recipe_routes = require("./routes/recipe.js");
const post_routes = require("./routes/post.js");
const cart_routes = require("./routes/cart.js");
const collection_routes = require("./routes/collection.js");
const conversation_routes = require("./routes/conversation.js");
const message_routes = require("./routes/message.js");
const friend_routes = require("./routes/friends.js");
const friendrequest_routes = require("./routes/friendrequest.js");
const logs_request = require("./routes/userLog.js");
const reviewRoutes = require("./routes/review.js");
const reportRoutes = require("./routes/report.js");
const reviewReportRoutes = require("./routes/reviewReport");

// const minio = require("./routes/minio.js");

app.use(cors());
app.use(userroutes);
app.use(recipe_routes);
app.use(post_routes);
app.use(cart_routes);
app.use(collection_routes);
app.use(conversation_routes);
app.use(message_routes);
app.use(friend_routes);
app.use(friendrequest_routes);
app.use(logs_request);
app.use(reviewRoutes);
app.use(reportRoutes);
app.use(reviewReportRoutes);
// app.use("/minio", minio);
// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// MongoDB connection
const uri = process.env.MONGO_URL;
mongoose.connect(uri).then(() => {
  console.log("Connected to MongoDB");
});
const server = http.createServer(app);
const io = socket(server);
server.listen(8081, () => {
  console.log("Server is running on port 8080");
});
