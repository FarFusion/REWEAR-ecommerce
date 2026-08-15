import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Tag,
  Divider,
  message,
} from "antd";
import { useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { getOrder } from "../../services/orderService";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await getOrder(id);

      setOrder(res.data.data);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Spin size="large" />
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <Title level={3}>
          Order not found
        </Title>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>
        Order Details
      </Title>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Text strong>Order ID</Text>
            <br />
            <Text>{order._id}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Status</Text>
            <br />
            <Tag color="blue">
              {order.status}
            </Tag>
          </Col>

          <Col span={12}>
            <Text strong>Payment</Text>
            <br />
            <Tag>
              {order.paymentStatus}
            </Tag>
          </Col>

          <Col span={12}>
            <Text strong>Order Date</Text>
            <br />
            <Text>
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </Text>
          </Col>
        </Row>
      </Card>

      <Card title="Products">
        {order.items.map((item) => (
          <div
            key={item.product?._id || item.title}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <Text strong>
                {item.title}
              </Text>

              <br />

              <Text type="secondary">
                ₹{item.price} ×{" "}
                {item.quantity}
              </Text>
            </div>

            <Text strong>
              ₹
              {item.price *
                item.quantity}
            </Text>
          </div>
        ))}

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <Title level={4}>
            Total
          </Title>

          <Title level={4}>
            ₹{order.totalAmount}
          </Title>
        </div>
      </Card>

      <Card
        title="Shipping Address"
        style={{ marginTop: 20 }}
      >
        <Text strong>
          {order.shippingAddress.firstName}{" "}
          {order.shippingAddress.lastName}
        </Text>

        <br />

        <Text>
          {order.shippingAddress.address}
        </Text>

        <br />

        <Text>
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.state} -{" "}
          {order.shippingAddress.pincode}
        </Text>

        <br />

        <Text>
          Phone:{" "}
          {order.shippingAddress.phone}
        </Text>
      </Card>
    </MainLayout>
  );
};

export default OrderDetails;