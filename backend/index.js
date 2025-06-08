import dotenv from "dotenv";
import { connection } from "./db/config.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();

// Create HTTP server and bind to Express app
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user id and socket
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Receive and forward messages
  socket.on("private_message", async ({ senderId, receiverId, message, token }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private_message", {
        senderId,
        message,
      });

    }

        

      // // Save message to database via your own REST API
      try {
        await axios.post(
          "http://localhost:4000/api/v1/chat",
          {
            receiver: receiverId,
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error saving message:", err.message);
      }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, sockId] of onlineUsers) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Start Server + DB
connection()
  .then(() => {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log({ message: "Database connection failed", error: err });
  });
