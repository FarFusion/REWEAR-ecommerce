# ReWear – Used & Refurbished E-Commerce Platform

ReWear is a full-stack e-commerce web application built using the MERN stack. The platform is designed for buying and selling used and refurbished products through a role-based marketplace.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based authorization
* Separate access for customers, sellers, and administrators

### Product Management

* Browse available products
* View detailed product information
* Product categories
* Product creation and management
* Product ownership validation
* Product filtering and search functionality

### Shopping Features

* Add products to cart
* Update cart quantities
* Remove products from cart
* Wishlist functionality
* Persistent user-specific cart and wishlist state

### Orders

* Place orders
* View orders
* View individual order details
* Protected order functionality

### Reviews

* Product reviews
* Review management
* User-specific review functionality

### Admin Features

* Protected admin routes
* Role-based administrative access
* Product and category management
* Dashboard functionality

## Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router
* Ant Design
* Axios
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* REST API

## Project Structure

```text
REWEAR-ecommerce/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── ...
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/FarFusion/REWEAR-ecommerce.git
cd REWEAR-ecommerce
```

### 2. Install frontend dependencies

```bash
cd client
npm i
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm i
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=your_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=your_CLOUDINARY_API_SECRET

EMAIL_USER=your_mail
EMAIL_PASS=you_mail_pass
```

Use your own values for the environment variables.

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🔐 Authentication

ReWear uses JWT-based authentication.

After successful login, the authentication token is used to authorize protected API requests.

The backend verifies the JWT and uses role-based authorization to control access to protected resources.

## 🔄 Application Flow

```text
React Frontend
      │
      │ Axios / REST API
      ▼
Express.js Server
      │
      ├── Authentication
      ├── Authorization
      ├── Products
      ├── Categories
      ├── Cart
      ├── Wishlist
      ├── Orders
      └── Reviews
      │
      ▼
MongoDB
```

## 🎯 Project Objective

The objective of ReWear is to provide a structured online marketplace for used and refurbished products while implementing real-world e-commerce functionality such as authentication, authorization, product management, shopping cart, wishlist, orders, and reviews.

## 🔮 Future Improvements

* Online payment gateway integration
* Product image optimization
* Seller dashboard improvements
* Product ratings and analytics
* Cloud deployment

## 👨‍💻 Developer

**Mohammad Farhan**

GitHub: [FarFusion](https://github.com/FarFusion)
