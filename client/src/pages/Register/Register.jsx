import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      setLoading(true);

      const response = await registerUser(values);

      message.success(
        response.message || "Registration successful."
      );

      // Store email temporarily for OTP verification
      navigate(
        `/verify-otp?email=${encodeURIComponent(values.email)}`
      );

    } catch (error) {
      message.error(
        error.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        maxWidth: 500,
        margin: "40px auto",
      }}
    >
      <Title level={2}>Create Account</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegister}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please enter your first name.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please enter your last name.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email.",
            },
            {
              type: "email",
              message: "Please enter a valid email.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter a password.",
            },
            {
              min: 6,
              message:
                "Password must be at least 6 characters.",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Register
        </Button>
      </Form>
    </Card>
  );
};

export default Register;