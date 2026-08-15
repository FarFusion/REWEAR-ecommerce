import { Form, Input, InputNumber, Select, Button, Upload, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { uploadImage } from "../../services/uploadService";

const { TextArea } = Input;

const ProductForm = ({
  form,
  categories,
  onFinish,
}) => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        const currentImages = form.getFieldValue("images") || [];
        setImages(currentImages);
    }, [form]);

    const handleUpload = async ({ file }) => {
        const data = new FormData();
        data.append("image", file);

        try {
            const res = await uploadImage(data);

            console.log("UPLOAD RESPONSE:", res.data);

            const currentImages =
            form.getFieldValue("images") || [];

            const urls = [
            ...currentImages,
            res.data.url,
            ];

            setImages(urls);
            form.setFieldValue("images", urls);

            message.success("Image uploaded");
        } catch (err) {
            console.error("UPLOAD ERROR:", err);
            message.error(
            err.response?.data?.message ||
                "Upload failed"
            );
        }
    };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Original Price"
        name="originalPrice"
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Brand"
        name="brand"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Condition"
        name="condition"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Excellent", value: "Excellent" },
            { label: "Good", value: "Good" },
            { label: "Fair", value: "Fair" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true }]}
      >
        <Select
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))}
        />
      </Form.Item>
    
        <Form.Item
            label="Images"
            name="images"
            >
            <>
                <Upload
                customRequest={handleUpload}
                showUploadList={false}
                >
                <Button icon={<UploadOutlined />}>
                    Upload Image
                </Button>
                </Upload>

                <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 15,
                    flexWrap: "wrap",
                }}
                >
                {images.map((img, index) => (
                    <Image
                    key={index}
                    src={img}
                    width={100}
                    />
                ))}
                </div>
            </>
        </Form.Item>


      <Button
        htmlType="submit"
        type="primary"
        block
      >
        Save Product
      </Button>
    </Form>
  );
};

export default ProductForm;