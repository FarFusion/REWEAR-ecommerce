import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Select,
  Typography,
  message,
} from "antd";

import MainLayout from "../../layouts/MainLayout";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/adminOrderService";

import "./AdminOrders.css";





const { Title } = Typography;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await getAllOrders();

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

  const handleStatusChange = async (
    id,
    type,
    value
  ) => {
        try {
        const updateData =
          type === "payment"
            ? { paymentStatus: value }
            : { status: value };

        await updateOrderStatus(
          id,
          updateData
        );

        message.success(
          type === "payment"
            ? "Payment status updated"
            : "Order status updated"
        );

        loadOrders();
      } catch (err) {
        message.error(
          err.response?.data?.message ||
            "Failed to update order"
        );
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
      render: (_, record) => (
        <>
          {record.user?.firstName}{" "}
          {record.user?.lastName}
          <br />
          {record.user?.email}
        </>
      ),
    },

    {
      title: "Products",
      render: (_, record) =>
        record.items?.map(
          (item) => (
            <div key={item._id}>
              {item.title} × {item.quantity}
            </div>
          )
        ),
    },

    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (amount) => `₹${amount}`,
    },

    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (status,record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) =>
            handleStatusChange(
              record._id,
              "payment",
              value
            )
          }
          options={[
            {
              label: "Pending",
              value: "Pending",
            },
            {
              label: "Paid",
              value: "Paid",
            },
            {
              label: "Failed",
              value: "Failed",
            },
            {
              label:"Refunded",
              value: "Refunded",
            }
          ]}
        />
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) =>
            handleStatusChange(
              record._id,
              "status",
              value
            )
          }
          options={[
            {
              label: "Confirmed",
              value: "Confirmed",
            },
            {
              label: "Shipped",
              value: "Shipped",
            },
            {
              label: "Delivered",
              value: "Delivered",
            },
            {
              label: "Cancelled",
              value: "Cancelled",
            },
          ]}
        />
      ),
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <MainLayout>
      <div className="admin-orders">
        <Title level={2} className="admin-orders-title">
          Order Management
        </Title>

        <div className="admin-orders-table">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={orders}
            loading={loading}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminOrders;