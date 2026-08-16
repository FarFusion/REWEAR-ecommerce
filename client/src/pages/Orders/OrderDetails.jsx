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

import "./OrderDetails.css";

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
        <div className="order-details-loading">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="order-details-page">
          <Title level={3}>
            Order not found
          </Title>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="order-details-page">
        <Title
          level={2}
          className="order-details-title"
        >
          Order Details
        </Title>

        {/* Order Information */}
        <Card className="order-details-card order-info-card">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12}>
              <div className="order-detail-field">
                <Text strong>Order ID</Text>
                <Text className="order-id-text">
                  {order._id}
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div className="order-detail-field">
                <Text strong>Status</Text>
                <Tag color="blue">
                  {order.status}
                </Tag>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div className="order-detail-field">
                <Text strong>Payment</Text>
                <Tag>
                  {order.paymentStatus}
                </Tag>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div className="order-detail-field">
                <Text strong>Order Date</Text>
                <Text>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Products */}
        <Card
          title="Products"
          className="order-details-card"
        >
          <div className="order-products">
            {order.items.map((item) => (
              <div
                key={
                  item.product?._id ||
                  item.title
                }
                className="order-product"
              >
                <div className="order-product-info">
                  <Text strong>
                    {item.title}
                  </Text>

                  <Text
                    type="secondary"
                    className="order-product-price"
                  >
                    ₹{item.price} ×{" "}
                    {item.quantity}
                  </Text>
                </div>

                <Text
                  strong
                  className="order-product-total"
                >
                  ₹
                  {item.price *
                    item.quantity}
                </Text>
              </div>
            ))}
          </div>

          <Divider />

          <div className="order-details-total">
            <Title level={4}>Total</Title>

            <Title level={4}>
              ₹{order.totalAmount}
            </Title>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card
          title="Shipping Address"
          className="order-details-card shipping-address-card"
        >
          <div className="shipping-address">
            <Text strong>
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </Text>

            <Text>
              {order.shippingAddress.address}
            </Text>

            <Text>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </Text>

            <Text>
              Phone:{" "}
              {order.shippingAddress.phone}
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;