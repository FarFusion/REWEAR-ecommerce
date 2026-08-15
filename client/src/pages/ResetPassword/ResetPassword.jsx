import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Space,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../../services/authService";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailFromUrl =
      searchParams.get("email");

    if (!emailFromUrl) {
      message.error("Email is required.");
      navigate("/forgot-password");
      return;
    }

    setEmail(emailFromUrl);
  }, [searchParams, navigate]);

  const handleReset = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter the 6-digit OTP.");
      return;
    }

    if (!newPassword) {
      message.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      message.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        otp,
        newPassword,
      });

      message.success(
        response.data.message ||
          "Password reset successfully."
      );

      navigate("/login");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to reset password."
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
        Reset Password
      </Title>

      <Text>
        Enter the OTP sent to:
      </Text>

      <br />

      <Text strong>
        {email}
      </Text>

      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginTop: 25,
        }}
      >
        <Input
          value={otp}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 6);

            setOtp(value);
          }}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          size="large"
          style={{
            textAlign: "center",
            letterSpacing: 8,
            fontSize: 22,
          }}
        />

        <Input.Password
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          placeholder="New password"
          size="large"
        />

        <Input.Password
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Confirm new password"
          size="large"
        />

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleReset}
        >
          Reset Password
        </Button>
      </Space>
    </Card>
  );
};

export default ResetPassword;