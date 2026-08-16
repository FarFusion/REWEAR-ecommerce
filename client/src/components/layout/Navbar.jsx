import {
  Layout,
  Input,
  Badge,
  Avatar,
  Dropdown,
  Button,
} from "antd";

import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  PlusOutlined,
  HomeOutlined,
  ShopOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const cartItems = useSelector(
    (state) => state.cart.items
  );
  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  const handleSearch = (value) => {
    const keyword = value.trim();

    if (!keyword) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?keyword=${encodeURIComponent(keyword)}`
    );
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },

    {
      key: "products",
      icon: <ShopOutlined />,
      label: <Link to="/products">Products</Link>,
    },

    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },

    {
      key: "orders",
      label: <Link to="/orders">Orders</Link>,
    },
  ];

  // User menu
  if (user?.role === "user") {
    menuItems.push({
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: (
        <Link to="/user/dashboard">
          My Dashboard
        </Link>
      ),
    });

    menuItems.push({
      key: "sell",
      icon: <PlusOutlined />,
      label: (
        <Link to="/sell">
          Sell an Item
        </Link>
      ),
    });
  }

  // Admin menu
  if (user?.role === "admin") {
    menuItems.push({
      key: "admin",
      icon: <DashboardOutlined />,
      label: (
        <Link to="/admin/dashboard">
          Admin Dashboard
        </Link>
      ),
    });
  }

  menuItems.push({
    type: "divider",
  });

  menuItems.push({
    key: "logout",
    label: (
      <span onClick={handleLogout}>
        Logout
      </span>
    ),
  });

  return (
    <Header className="navbar">
      <div className="navbar-top">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          ReWear
        </Link>

        {/* DESKTOP SEARCH */}

        <div className="navbar-search navbar-search-desktop"
        >
          <Search
            placeholder="Search refurbished products..."
            allowClear
            onSearch={handleSearch}
          />
        </div>

        {/* RIGHT SIDE */}

        <div className="navbar-actions">
          {/* WISHLIST */}

          <Link to={token ? "/wishlist" : "/login"}>
            <Badge count={wishlistCount} size="small">
              <HeartOutlined className="navbar-icon"/>
            </Badge>
          </Link>

          {/* CART */}

          <Link to={token ? "/cart" : "/login"}>
            <Badge count={cartCount} size="small">
              <ShoppingCartOutlined     className="navbar-icon"
              />
            </Badge>
          </Link>

          {/* USER */}

          {token ? (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
            >
              <Avatar
                icon={<UserOutlined />}
                className="navbar-avatar"
              />
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary" className="navbar-login">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* MOBILE SEARCH */}

      <div className="navbar-search navbar-search-mobile">
        <Search
          placeholder="Search products"
          allowClear
          onSearch={handleSearch}
        />
      </div>  
    </Header>
  );
};

export default Navbar;