import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getCategories } from "../../services/categoryService";
import { createProduct } from "../../services/productService";
import api from "../../services/api";

const { Title } = Typography;
const { TextArea } = Input;

const SellProduct = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data.data || []);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // -----------------------------
      // 1. Create Product
      // -----------------------------
      const productResponse = await createProduct({
        title: values.title,
        description: values.description,
        category: values.category,
        brand: values.brand,
        condition: values.condition,
        price: values.price,
        originalPrice: values.originalPrice,
        location: values.location,
        stock: values.stock,
      });

      const product = productResponse.data.data;

      // -----------------------------
      // 2. Upload Images
      // -----------------------------
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append("images", file.originFileObj);
        });

        await api.post(
          `/products/${product._id}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      message.success("Product listed successfully!");

      form.resetFields();
      setFileList([]);

      navigate("/user/products");
    } catch (error) {
      console.error(error);
      console.log("STATUS:", error.response?.status);
      console.log("RESPONSE:", error.response?.data);

      message.error(
        error.response?.data?.message ||
          "Failed to list product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "20px 0 60px",
        }}
      >
        <Title level={2}>
          Sell an Item
        </Title>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          Add your product details and list it on ReWear.
        </p>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            {/* Product title */}
            <Form.Item
              label="Product Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter product title",
                },
              ]}
            >
              <Input
                placeholder="e.g. iPhone 13 128GB"
                size="large"
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter product description",
                },
              ]}
            >
              <TextArea
                rows={5}
                placeholder="Describe the product, its condition, accessories, defects, etc."
              />
            </Form.Item>

            {/* Category */}
            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please select a category",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select category"
                options={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
              />
            </Form.Item>

            {/* Brand */}
            <Form.Item
              label="Brand"
              name="brand"
            >
              <Input
                placeholder="e.g. Apple, Samsung, Nike"
                size="large"
              />
            </Form.Item>

            {/* Condition */}
            <Form.Item
              label="Condition"
              name="condition"
              rules={[
                {
                  required: true,
                  message: "Please select condition",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select condition"
                options={[
                  {
                    value: "Excellent",
                    label: "Excellent",
                  },
                  {
                    value: "Good",
                    label: "Good",
                  },
                  {
                    value: "Fair",
                    label: "Fair",
                  },
                ]}
              />
            </Form.Item>

            {/* Selling Price */}
            <Form.Item
              label="Selling Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please enter selling price",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0}
                style={{ width: "100%" }}
                prefix="₹"
                placeholder="Selling price"
              />
            </Form.Item>

            {/* Original Price */}
            <Form.Item
              label="Original Price"
              name="originalPrice"
            >
              <InputNumber
                size="large"
                min={0}
                style={{ width: "100%" }}
                prefix="₹"
                placeholder="Original price"
              />
            </Form.Item>

            {/* Location */}
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please enter location",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. Delhi"
              />
            </Form.Item>

            {/* Stock */}
            <Form.Item
              label="Quantity"
              name="stock"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: "Please enter quantity",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={1}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Images */}
            <Form.Item
              label="Product Images"
            >
              <Upload
                listType="picture-card"
                multiple
                maxCount={5}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                }}
                accept="image/*"
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>
                      Upload
                    </div>
                  </div>
                )}
              </Upload>

              <p
                style={{
                  color: "#888",
                  marginTop: 8,
                }}
              >
                You can upload up to 5 images.
              </p>
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                List Product
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellProduct;