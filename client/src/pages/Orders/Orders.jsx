import { useEffect, useState } from "react";
import {
  Card,
  Empty,
  Spin,
  Typography,
  Tag,
  Button,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { getOrders } from "../../services/orderService";

const { Title, Text } = Typography;

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();

      setOrders(res.data.data);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load orders"
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

  if (!orders.length) {
    return (
      <MainLayout>
        <Title level={2}>My Orders</Title>

        <Empty description="You haven't placed any orders yet." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>My Orders</Title>

      {orders.map((order) => (
        <Card
          key={order._id}
          style={{ marginBottom: 20 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <div>
              <Text strong>
                Order #{order._id.slice(-8)}
              </Text>

              <br />

              <Text type="secondary">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </Text>
            </div>

            <Tag color="blue">
              {order.status}
            </Tag>
          </div>

          {order.items.map((item) => (
            <div
              key={item.product?._id || item.title}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 10,
              }}
            >
              <div>
                <Text strong>
                  {item.title}
                </Text>

                <br />

                <Text type="secondary">
                  Qty: {item.quantity}
                </Text>
              </div>

              <Text>
                ₹
                {item.price *
                  item.quantity}
              </Text>
            </div>
          ))}

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <Text strong>
              Total: ₹{order.totalAmount}
            </Text>

            <Button
              type="primary"
              onClick={() =>
                navigate(
                  `/orders/${order._id}`
                )
              }
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </MainLayout>
  );
};

export default Orders;