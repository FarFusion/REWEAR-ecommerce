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

import "./Orders.css";

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
        <div className="orders-loading">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!orders.length) {
    return (
      <MainLayout>
        <div className="orders-page">
          <Title level={2} className="orders-title">
            My Orders
          </Title>

          <div className="orders-empty">
            <Empty description="You haven't placed any orders yet." />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="orders-page">
        <Title level={2} className="orders-title">
          My Orders
        </Title>

        <div className="orders-list">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="order-card"
            >
              <div className="order-header">
                <div className="order-info">
                  <Text strong>
                    Order #{order._id.slice(-8)}
                  </Text>

                  <Text
                    type="secondary"
                    className="order-date"
                  >
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </Text>
                </div>

                <Tag color="blue">
                  {order.status}
                </Tag>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    key={
                      item.product?._id ||
                      item.title
                    }
                    className="order-item"
                  >
                    <div className="order-item-info">
                      <Text strong>
                        {item.title}
                      </Text>

                      <Text
                        type="secondary"
                        className="order-item-quantity"
                      >
                        Qty: {item.quantity}
                      </Text>
                    </div>

                    <Text className="order-item-price">
                      ₹
                      {item.price *
                        item.quantity}
                    </Text>
                  </div>
                ))}
              </div>

              <div className="order-divider" />

              <div className="order-footer">
                <Text strong className="order-total">
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;