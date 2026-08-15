import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Empty,
  Spin,
  message,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import {
  ShoppingOutlined,
  HeartOutlined,
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

const { Title, Text } = Typography;

const UserDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDashboardData = async () => {
    try {
        setLoading(true);

        const [productsResponse, ordersResponse, wishlistResponse] =
        await Promise.all([
            api.get("/products/my-products"),
            api.get("/orders"),
            api.get("/wishlist"),
        ]);

        // My products
        setProducts(productsResponse.data.products || []);

        // Orders
        setOrdersCount(
        ordersResponse.data.orders?.length ||
        ordersResponse.data.data?.length ||
        0
        );

        // Wishlist
        setWishlistCount(
        wishlistResponse.data.wishlist?.length ||
        wishlistResponse.data.data?.length ||
        0
        );
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        message.error(
        error.response?.data?.message ||
            "Failed to load dashboard data."
        );
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setDeletingId(productId);

      await api.delete(`/products/${productId}`);

      message.success("Product deleted successfully.");

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error(error);

      message.error(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: "30px 20px" }}>
            {/* Header */}
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
                gap: 15,
                flexWrap: "wrap",
                }}
            >
                <div>
                <Title level={2} style={{ marginBottom: 5 }}>
                    Welcome, {user?.firstName || "User"} 👋
                </Title>

                <Text type="secondary">
                    Manage your products and account from here.
                </Text>
                </div>
            </div>

            {/* Statistics */}
            <Row gutter={[20, 20]} style={{ marginBottom: 35 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        hoverable
                            onClick={() => navigate("/user/products")}
                            style={{ cursor: "pointer" }}
                    >
                        <Statistic
                        title="My Products"
                        value={products.length}
                        prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card
                        hoverable
                        onClick={() => navigate("/orders")}
                        style={{ cursor: "pointer" }}
                    >
                        <Statistic
                        title="My Orders"
                        value={ordersCount}
                        prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card
                        hoverable
                        onClick={() => navigate("/wishlist")}
                        style={{ cursor: "pointer" }}
                    >
                        <Statistic
                        title="Wishlist"
                        value={wishlistCount}
                        prefix={<HeartOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Products */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
                >
                <Title level={3} style={{ margin: 0 }}>
                    My Listed Products
                </Title>

                <Space>
                    <Button
                        onClick={() => navigate("/user/products")}
                    >
                        View All
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/sell")}
                    >
                        Add Product
                    </Button>
                </Space>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                <Spin size="large" />
                </div>
            ) : products.length === 0 ? (
                <Card>
                <Empty
                    description="You haven't listed any products yet."
                >
                    <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/sell")}
                    >
                    List Your First Product
                    </Button>
                </Empty>
                </Card>
            ) : (
                <Row gutter={[20, 20]}>
                {products.map((product) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
                    <Card
                        hoverable
                        cover={
                        product.images?.length > 0 ? (
                            <img
                            src={product.images[0].url}
                            alt={product.title}
                            style={{
                                height: 220,
                                objectFit: "cover",
                            }}
                            />
                        ) : (
                            <div
                            style={{
                                height: 220,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "#f5f5f5",
                            }}
                            >
                            No Image
                            </div>
                        )
                        }
                    >
                        <Title
                        level={5}
                        ellipsis={{ rows: 2 }}
                        >
                        {product.title}
                        </Title>

                        <Text strong style={{ fontSize: 18 }}>
                        ₹{product.price?.toLocaleString("en-IN")}
                        </Text>

                        <div style={{ marginTop: 10 }}>
                        <Tag
                            color={
                            product.status === "Available"
                                ? "green"
                                : product.status === "Sold"
                                ? "red"
                                : "orange"
                            }
                        >
                            {product.status}
                        </Tag>
                        </div>
                       
                      <Space
                        style={{
                            marginTop: 15,
                            width: "100%",
                        }}
                        >
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() =>
                            navigate(`/products/${product._id}`)
                            }
                        >
                            View
                        </Button>

                        <Button
                            icon={<EditOutlined />}
                            onClick={() =>
                            navigate(`/sell/edit/${product._id}`)
                            }
                        >
                            Edit
                        </Button>
                        
                        
                        <Popconfirm
                            title="Delete this product?"
                            description="This action cannot be undone."
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                            handleDelete(product._id)
                            }
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                loading={deletingId === product._id}
                            />
                        </Popconfirm>
                      </Space>
                    </Card>
                    </Col>
                ))}
                </Row>
            )}
        </div>
  );
};

export default UserDashboard;