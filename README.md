# Sahyadri Canteen Food Ordering System

A full-stack web application for managing food orders in a campus canteen. The system enables users to place orders and track their status in real time, while administrators can manage and update orders through a dedicated dashboard.

---

## Live Application

Frontend: https://canteen-app-gilt.vercel.app/
Backend API: https://canteen-backend-yrmr.onrender.com

---

## Features

### User

* User registration and authentication
* Browse food items by category
* Add items to cart and place orders
* View order summary with total cost
* Real-time order status tracking
* Notification when order is ready

### Admin

* Secure admin login
* View all orders
* Update order status (Pending, Preparing, Ready, Completed)
* Remove completed orders
* Automatic refresh of incoming orders

---

## Technology Stack

Frontend:

* React (Vite)
* Tailwind CSS

Backend:

* Node.js
* Express.js

Database:

* MongoDB Atlas

Deployment:

* Vercel (Frontend)
* Render (Backend)

---

## Project Structure

```
canteen-app/
│
├── frontend/
└── backend/
```

---

## Installation and Setup

### Clone Repository

```
git clone https://github.com/Amithkumar2003/canteen-app.git
cd canteen-app
```

---

### Backend Setup

```
cd backend
npm install
```

Create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection_string
```

Run the server:

```
node server.js
```

---

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## Admin Access

Username: admin
Password: admin123

---

## Key Implementation Details

* RESTful API architecture
* MongoDB used for persistent storage
* Order tracking implemented using polling
* Clean separation of frontend and backend
* Fully deployed and accessible online

---

## Author

Amith Kumar
GitHub: https://github.com/Amithkumar2003

---

## License

This project is intended for educational purposes.
