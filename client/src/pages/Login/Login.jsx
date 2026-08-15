import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await login(values);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data)
      );
      localStorage.setItem("role", res.data.data.role);

      message.success("Login successful");

      navigate("/");
    } catch (error) {
        const data = error.response?.data;

        if (data?.requiresVerification) {
          message.warning(
            "Please verify your email before logging in."
          );

          navigate(
            `/verify-otp?email=${encodeURIComponent(
              data.email
            )}`
          );

          return;
        }

        message.error(
          data?.message || "Login failed."
        );
      }
  };

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "60px auto",
      }}
    >
      <Title level={2}>Login</Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          block
        >
          Login
        </Button>

        <Button
          type="link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Button>

        <div style={{ marginTop: 15 }}>
          New user? <Link to="/register">Register</Link>
        </div>
      </Form>
    </Card>
  );
};

export default Login;