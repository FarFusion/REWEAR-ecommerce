import { useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../../services/authService";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      message.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: email.trim(),
      });

      message.success(
        response.data.message ||
          "Password reset OTP sent."
      );

      navigate(
        `/reset-password?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to send reset OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        maxWidth: 450,
        margin: "60px auto",
      }}
    >
      <Title level={2}>
        Forgot Password
      </Title>

      <Text>
        Enter your email address and we'll send you
        a password reset OTP.
      </Text>

      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        size="large"
        style={{ marginTop: 25 }}
      />

      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleSubmit}
        style={{ marginTop: 20 }}
      >
        Send OTP
      </Button>

      <Button
        type="link"
        block
        onClick={() => navigate("/login")}
        style={{ marginTop: 10 }}
      >
        Back to Login
      </Button>
    </Card>
  );
};

export default ForgotPassword;