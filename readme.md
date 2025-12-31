# Learning Management System (LMS)

A comprehensive Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js), featuring real-time communication, course management, and a responsive design embedded with PWA capabilities.

## 🚀 Features

-   **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and secure cookie storage.
-   **Role-Based Access**: Specialized views and capabilities for students and administrators.
-   **Real-time Chat**: Integrated socket.io for instant messaging between users.
-   **Course Management**: Create, update, and manage course content (implied).
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS, optimized for mobile and desktop.
-   **PWA Support**: Installable as a native-like app on mobile devices.
-   **Dark/Light Mode**: User-preference persistence for theme selection.
-   **Interactive Dashboard**: Analytics and visualization using Recharts.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (powered by [Vite](https://vitejs.dev/))
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Real-time Communication**: [Socket.IO Client](https://socket.io/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **HTTP Client**: Axios

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
-   **Authentication**: JWT, BCryptJS
-   **Real-time Communication**: [Socket.IO](https://socket.io/)
-   **Email Service**: [Nodemailer](https://nodemailer.com/)

## 📂 Project Structure

```bash
lms/
├── backend/         # Node.js/Express API server
│   ├── config/      # Database and other configurations
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API route definitions
│   ├── utils/       # Utility functions
│   └── index.js     # Entry point
├── frontend/        # React application
│   ├── public/      # Static assets
│   ├── src/         # Source code
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views
│   │   ├── redux/      # State slices and store
│   │   └── App.jsx     # Main component
│   └── vite.config.js
└── README.md        # Project documentation
```

## ⚡ Installation & Setup

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Rampravsh/lms.git
cd lms
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
# Add other necessary variables (e.g., mailer config) here
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or the port specified by Vite).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
