import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Select,
  Button,
  Popconfirm,
  Typography,
  message,
  Space,
} from "antd";

import MainLayout from "../../layouts/MainLayout";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/adminUserService";

const { Title } = Typography;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await getAllUsers();

      setUsers(res.data.data);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);

      message.success("User role updated");

      loadUsers();
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);

      message.success("User deleted");

      loadUsers();
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const columns = [
    {
      title: "Name",
      render: (_, record) =>
        `${record.firstName} ${record.lastName}`,
    },

    {
      title: "Email",
      dataIndex: "email",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => phone || "-",
    },

    {
      title: "Role",
      dataIndex: "role",
      render: (role) => {
        let color = "blue";

        if (role === "admin") {
          color = "red";
        } else if (role === "user") {
          color = "green";
        }

        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },

    {
      title: "Change Role",
      render: (_, record) => (
        <Select
          value={record.role}
          style={{ width: 120 }}
          onChange={(role) =>
            handleRoleChange(record._id, role)
          }
          options={[
            {
              label: "User",
              value: "user",
            },
            {
              label: "Admin",
              value: "admin",
            },
          ]}
        />
      ),
    },

    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
            onConfirm={() =>
              handleDelete(record._id)
            }
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <Title level={2}>User Management</Title>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={loading}
        scroll={{ x: 900 }}
      />
    </MainLayout>
  );
};

export default Users;