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
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        background: "#fff",
        padding: "0 40px",
        borderBottom: "1px solid #f0f0f0",
        height: 70,
      }}
    >
      {/* LOGO */}

      <Link
        to="/"
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#1677ff",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        ReWear
      </Link>

      {/* SEARCH */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Search
          placeholder="Search refurbished products..."
          allowClear
          style={{
            width: "100%",
            maxWidth: 500,
          }}
          onSearch={handleSearch}
        />
      </div>

      {/* RIGHT SIDE */}

      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* WISHLIST */}

        <Link to={token ? "/wishlist" : "/login"}>
          <Badge
            count={wishlistCount}
            size="small"
          >
            <HeartOutlined
              style={{
                fontSize: 24,
                color: "#000",
              }}
            />
          </Badge>
        </Link>

        {/* CART */}

        <Link to={token ? "/cart" : "/login"}>
          <Badge
            count={cartCount}
            size="small"
          >
            <ShoppingCartOutlined
              style={{
                fontSize: 24,
                color: "#000",
              }}
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
              style={{
                cursor: "pointer",
              }}
            />
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button type="primary">
              Login
            </Button>
          </Link>
        )}
      </div>
    </Header>
  );
};

export default Navbar;