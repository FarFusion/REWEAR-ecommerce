import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Empty,
  Spin,
  message,
  Tag,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const { Title, Text } = Typography;

const MyProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/my-products");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);

      message.error(
        error.response?.data?.message ||
          "Failed to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "30px 20px 60px",
      }}
    >
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
            My Products
          </Title>

          <Text type="secondary">
            Manage the products you have listed on ReWear.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate("/sell")}
        >
          Add Product
        </Button>
      </div>

      {/* Empty */}

      {products.length === 0 ? (
        <Card>
          <Empty description="You haven't listed any products yet.">
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
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={product._id}
            >
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
                        background: "#f5f5f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
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

                <Text
                  strong
                  style={{
                    fontSize: 18,
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  ₹
                  {product.price?.toLocaleString("en-IN")}
                </Text>

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

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 15,
                  }}
                >
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() =>
                      navigate(`/products/${product._id}`)
                    }
                  />

                  <Button
                    icon={<EditOutlined />}
                    onClick={() =>
                      navigate(
                        `/sell/edit/${product._id}`
                      )
                    }
                  />

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
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MyProducts;