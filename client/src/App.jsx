import { Routes, Route } from "react-router-dom";
import useLoadCart from "./hooks/useLoadCart";
import useLoadWishlist from "./hooks/useLoadWishlist";
import Profile from "./pages/Profile/Profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
// import Wishlist from "./pages/Wishlist/Wishlist";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/Orders/OrderDetails";
import AdminRoute from "./components/auth/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Categories from "./pages/Admin/Categories";
import AdminProducts from "./pages/Admin/Products";
import Wishlist from "./pages/whishlist/Wishlist";
import Checkout from "./pages/Checkout/Checkout";
import AdminOrders from "./pages/Admin/Orders";
import Users from "./pages/Admin/Users";
import SellProduct from "./pages/Sell/SellProduct";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import UserRoute from "./routes/UserRoute";
import MyProducts from "./pages/MyProducts/MyProducts";
import EditProduct from "./pages/EditProduct/EditProduct";
import MainLayout from "./layouts/MainLayout";

function App() {
  useLoadCart();
  useLoadWishlist();
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" 
        element={<ProductDetails />}
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <Categories />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />      

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />
      
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellProduct/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/user/dashboard"
        element={
          <UserRoute>
            <MainLayout>
              <UserDashboard />
            </MainLayout>           
          </UserRoute>
        }
      />

      <Route
        path="/user/products"
        element={
          <UserRoute>
            <MainLayout>
              <MyProducts />
            </MainLayout>  
          </UserRoute>
        }
      />

      <Route
        path="/sell/edit/:id"
        element={
          <UserRoute>
            <EditProduct />
          </UserRoute>
        }
      />

    </Routes>
    
  );
}

export default App;