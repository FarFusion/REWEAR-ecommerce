import { useEffect, useState } from "react";

import ProductForm from "../../components/admin/ProductForm";

import { getCategories } from "../../services/categoryService";

import {
  createProduct,
  updateProduct,
} from "../../services/productService";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Form,
  Modal,
} from "antd";

import MainLayout from "../../layouts/MainLayout";
import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import "./AdminProducts.css";





const Products = () => {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);


 async function loadCategories() {
  try {
    const res = await getCategories();
    setCategories(res.data.data);
  } catch (err) {
    message.error("Failed to load categories");
  }
}

async function handleSubmit(values) {
  try {
    if (editing) {
      await updateProduct(editing._id, values);
      message.success("Product updated");
    } else {
      await createProduct(values);
      message.success("Product created");
    }

    form.resetFields();
    setEditing(null);
    setOpen(false);

    loadProducts();
  } catch (err) {
    message.error("Operation failed");
  }
}

  async function loadProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch {
      message.error("Failed to load products");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      message.success("Product deleted");
      loadProducts();
    } catch {
      message.error("Delete failed");
    }
  }

  const columns = [
    {
      title: "Image",
      render: (_, record) => (
        <img
          src={
            record.images?.[0]?.url ||
            "https://placehold.co/80x80"
          }
          alt={record.title}
          width={70}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Condition",
      dataIndex: "condition",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          
          <Button
            onClick={() => {
                setEditing(record);

                form.setFieldsValue({
                ...record,
                category: record.category?._id,
                });

                setOpen(true);
            }}
            >
            Edit
         </Button>

          <Popconfirm
            title="Delete product?"
            onConfirm={() =>
              handleDelete(record._id)
            }
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
      <div className="admin-products">
        <div className="admin-products-header">
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            Add Product
          </Button>
        </div>

        <div className="admin-products-table">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={products}
            scroll={{ x: 800 }}
          />
        </div>

        <Modal
          open={open}
          footer={null}
          destroyOnHidden
          onCancel={() => {
            setOpen(false);
            setEditing(null);
            form.resetFields();
          }}
          title={editing ? "Edit Product" : "Add Product"}
          width="min(700px, 95vw)"
        >
          <ProductForm
            form={form}
            categories={categories}
            onFinish={handleSubmit}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Products;