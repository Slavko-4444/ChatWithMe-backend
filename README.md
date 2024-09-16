# 🔒 Chat with Me - Backend API

This is the backend API for the **Chat with Me** real-time messenger app. It handles secure communication, user authentication, and real-time messaging using **Socket.IO**. Sensitive data, such as passwords and messages, are securely encrypted using **bcrypt**. The backend also features middleware that ensures only authorized users can access certain sensitive routes.

## 🚀 Features

- **Real-time Communication:** Powered by **Socket.IO** for live, bi-directional communication.
- **Data Encryption:** Sensitive data (passwords/messages) are encrypted using **bcrypt** for secure storage.
- **Authentication Middleware:** Ensures only authorized users can access protected routes.
- **Production Ready:** Dockerized for easy deployment in any environment.

## 🛠️ Tech Stack

- **Node.js** for server-side JavaScript
- **Socket.IO** for real-time communication
- **bcrypt** for encrypting sensitive data
- **Express.js** for API routing
- **Docker** for containerization

## 📂 Project Structure

```bash
config/            # Application configuration files
controller/        # Controllers for handling requests
Dockerfile         # Docker configuration
index.js           # Main entry point for the server
middleware/        # Custom middleware for route protection
models/            # Data models (User, Message)
node_modules/      # Node.js dependencies
package.json       # NPM dependencies and scripts
package-lock.json  # Lockfile for NPM
public/            # Static files
README.md          # Project documentation
routes/            # API route definitions
socket/            # Socket.IO event handling
```

# 🚀 Getting Started

### Prerequisites

- **Node.js** (version 14.x or later)
- **NPM** or **Yarn**
- **Docker** (optional for containerized environments)

## 🛠️ Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/chat-with-me-backend.git
   cd chat-with-me-backend
   ```

2. **Install dependencies and run**

   ```bash
   npm install
   npm start
   ```

Server is runing on http://localhost:5000

## 🐳 Docker Setup

You can also run the backend using Docker:

1. **Build the Docker image:**

   ```bash
    docker build -t chat-with-me-backend .
   ```

2. **Run the Docker container:**
   ```bash
    docker run -p 5000:5000 chat-with-me-backend
   ```
