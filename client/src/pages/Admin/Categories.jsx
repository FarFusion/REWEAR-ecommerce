import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";

import MainLayout from "../../layouts/MainLayout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const res = await getCategories();
    setCategories(res.data.data);
  }

  async function handleSubmit(values) {
    try {
      if (editing) {
        await updateCategory(editing._id, values);
        message.success("Category updated");
      } else {
        await createCategory(values);
        message.success("Category created");
      }

      form.resetFields();
      setEditing(null);
      setOpen(false);

      loadCategories();
    } catch (err) {
      message.error("Operation failed");
    }
  }

  async function handleDelete(id) {
    await deleteCategory(id);

    message.success("Category deleted");

    loadCategories();
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record._id)}
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
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Add Category
      </Button>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={categories}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          editing
            ? "Edit Category"
            : "New Category"
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Category"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
          >
            Save
          </Button>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Categories;