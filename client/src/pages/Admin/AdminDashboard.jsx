import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Statistic,
  Table,
  Tag,
  message,
  Button,
} from "antd";

import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import { Link, Navigate, useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { getDashboardStats } from "../../services/adminDashboardService";

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await getDashboardStats();

      setData(res.data.data);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Order",
      render: (_, record) =>
        `#${record._id.slice(-8)}`,
    },

    {
      title: "Customer",
      render: (_, record) =>
        `${record.user?.firstName || ""} ${
          record.user?.lastName || ""
        }`,
    },

    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (amount) => `₹${amount}`,
    },

    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (status) => (
        <Tag>{status}</Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";

        if (status === "Delivered") {
          color = "green";
        }

        if (status === "Cancelled") {
          color = "red";
        }

        if (status === "Confirmed") {
          color = "orange";
        }

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString(),
    },
  ];

  if (!data) {
    return (
      <MainLayout>
        <Title level={2}>
          Admin Dashboard
        </Title>

        <p>
          {loading
            ? "Loading dashboard..."
            : "No dashboard data available."}
        </p>
      </MainLayout>
    );
  }

  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  } = data.statistics;

  const {
    confirmed,
    shipped,
    delivered,
    cancelled,
  } = data.orderStatus;

  return (
    <MainLayout>
      <Title level={2}>
        Admin Dashboard
      </Title>

      {/* Statistics */}

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading} 
            hoverable
            onClick={()=>navigate("/admin/users")}
            style={{ cursor: "pointer" }}  
          >
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading}
            hoverable
            onClick={()=>navigate("/admin/products")}
            style={{cursor: "pointer"}}
            >
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading}
            hoverable
            onClick={()=>navigate("/admin/orders")}
            >
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Status */}

      <Title level={4}>
        Order Status
      </Title>

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 30 }}
      >
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Confirmed"
              value={confirmed}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Shipped"
              value={shipped}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Delivered"
              value={delivered}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={cancelled}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}

      <Title level={4}>
        Quick Actions
      </Title>

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 30 }}
      >
        <Col>
          <Link to="/admin/users">
            <Button type="primary">
              Manage Users
            </Button>
          </Link>
        </Col>

        <Col>
          <Link to="/admin/products">
            <Button>
              Manage Products
            </Button>
          </Link>
        </Col>

        <Col>
          <Link to="/admin/orders">
            <Button>
              Manage Orders
            </Button>
          </Link>
        </Col>

        <Col>
          <Link to="/admin/categories">
            <Button>
              Manage Categories
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Recent Orders */}

      <Title level={4}>
        Recent Orders
      </Title>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data.recentOrders}
        loading={loading}
        pagination={false}
        scroll={{ x: 800 }}
      />
    </MainLayout>
  );
};

export default AdminDashboard;