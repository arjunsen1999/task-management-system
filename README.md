# 💬 Real-Time Chat Application with Admin

A full-stack, real-time chat-enabled task management system with user authentication, admin interaction, and private messaging powered by Socket.IO. Build engaging, secure, and scalable communication experiences with a modern tech stack.

---

## ✨ Features

- **Real-Time Messaging**: Instant private messaging between users and admins using Socket.IO.
- **Task Management**: Organize and manage tasks with a user-friendly interface.
- **User Authentication**: Secure login with Google OAuth or JWT-based authentication.
- **Admin Dashboard**: Admins can monitor and interact with users in real-time.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
- **State Management**: Efficient data handling with Redux Toolkit and React Query.
- **Scalable Backend**: Powered by Node.js, Express.js, and MongoDB for robust performance.

---

## 🚀 Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development
  - [Redux Toolkit](https://redux-toolkit.js.org/) - Simplified state management
  - [React Query](https://react-query.tanstack.com/) - Data fetching and caching
  - [Socket.IO Client](https://socket.io/) - Real-time bidirectional communication

- **Backend**:
  - [Node.js](https://nodejs.org/) - JavaScript runtime for scalable server-side applications
  - [Express.js](https://expressjs.com/) - Fast and minimalist web framework
  - [MongoDB (Mongoose)](https://mongoosejs.com/) - NoSQL database with elegant schema modeling
  - [Socket.IO Server](https://socket.io/) - Real-time WebSocket communication

---


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance like MongoDB Atlas)
- [Git](https://git-scm.com/) for version control
- A Google OAuth client ID (if using Google OAuth)

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arjunsen1999/task-management-system.git
   cd [task-management-system]

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start the backend server
cd backend
npm run dev

# Start the frontend (in a new terminal)
cd frontend
npm run dev
