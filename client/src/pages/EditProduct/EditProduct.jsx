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
  Image,
  Space,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getCategories } from "../../services/categoryService";
import {
  getProduct,
  updateProduct,
} from "../../services/productService";
import api from "../../services/api";

const { Title } = Typography;
const { TextArea } = Input;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [id]);

  const loadProduct = async () => {
    try {
      setPageLoading(true);

      const response = await getProduct(id);

      const productData = response.data.data;

      setProduct(productData);

      form.setFieldsValue({
        title: productData.title,
        description: productData.description,
        category: productData.category?._id || productData.category,
        brand: productData.brand,
        condition: productData.condition,
        price: productData.price,
        originalPrice: productData.originalPrice,
        location: productData.location,
        stock: productData.stock,
      });
    } catch (error) {
      console.error(error);

      message.error(
        error.response?.data?.message ||
          "Failed to load product"
      );

      navigate("/user/products");
    } finally {
      setPageLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.data.data || []);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await updateProduct(id, {
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

      const updatedProduct = response.data.data;

      // Upload newly selected images
      if (fileList.length > 0) {
        const formData = new FormData();

        fileList.forEach((file) => {
          formData.append(
            "images",
            file.originFileObj
          );
        });

        await api.post(
          `/products/${id}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      message.success("Product updated successfully!");

      navigate(`/products/${updatedProduct._id}`);
    } catch (error) {
      console.error(error);

      message.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <MainLayout>
        <div style={{ padding: 40, textAlign: "center" }}>
          Loading product...
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "20px 0 60px",
        }}
      >
        <Title level={2}>Edit Product</Title>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          Update your product information.
        </p>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
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
              <Input placeholder="Enter product title" />
            </Form.Item>

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
                placeholder="Describe your product"
              />
            </Form.Item>

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
                placeholder="Select category"
                options={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Brand"
              name="brand"
            >
              <Input placeholder="Enter brand" />
            </Form.Item>

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
                placeholder="Select condition"
                options={[
                  {
                    value: "New",
                    label: "New",
                  },
                  {
                    value: "Like New",
                    label: "Like New",
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

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please enter price",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter selling price"
              />
            </Form.Item>

            <Form.Item
              label="Original Price"
              name="originalPrice"
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter original price"
              />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
            >
              <Input placeholder="Enter city/location" />
            </Form.Item>

            <Form.Item
              label="Stock"
              name="stock"
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Enter stock quantity"
              />
            </Form.Item>

            {/* Existing Images */}
            {product.images?.length > 0 && (
              <Form.Item label="Current Images">
                <Space wrap>
                  {product.images.map((image) => (
                    <Image
                      key={image.public_id || image.url}
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      src={image.url}
                    />
                  ))}
                </Space>
              </Form.Item>
            )}

            {/* New Images */}
            <Form.Item label="Add New Images">
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) =>
                  setFileList(fileList)
                }
                accept="image/*"
              >
                {fileList.length < 5 && (
                  <>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>
                      Upload
                    </div>
                  </>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: "100%" }}>
                <Button
                  onClick={() =>
                    navigate("/user/products")
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Update Product
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditProduct;