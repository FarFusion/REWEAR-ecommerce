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

import {
  verifyOTP,
  resendOTP,
} from "../../services/authService";

const { Title, Text } = Typography;

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendDisabled, setResendDisabled] =
    useState(false);

  const [countdown, setCountdown] =
    useState(0);


  // Get email from URL
  useEffect(() => {
    const emailFromUrl =
      searchParams.get("email");

    if (!emailFromUrl) {
      message.error(
        "Email is required for verification."
      );

      navigate("/register");

      return;
    }

    setEmail(emailFromUrl);
  }, [searchParams, navigate]);


  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);


  // Verify OTP
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await verifyOTP(
        {email,
        otp}
      );

      message.success(
        response.data.message ||
          "Email verified successfully."
      );

      navigate("/login");

    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };


  // Resend OTP
  const handleResend = async () => {
    try {
      setResendLoading(true);

      const response = await resendOTP({email});

      message.success(
        response.data.message ||
          "A new OTP has been sent."
      );

      setOtp("");

      // Disable resend for 30 seconds
      setCountdown(30);

      setResendDisabled(true);

    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to resend OTP."
      );
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <Card
      style={{
        maxWidth: 450,
        margin: "60px auto",
        textAlign: "center",
      }}
    >

      <Title level={2}>
        Verify Your Email
      </Title>

      <Text>
        We sent a 6-digit OTP to
      </Text>

      <br />

      <Text strong>
        {email}
      </Text>


      <div style={{ marginTop: 30 }}>

        <Input
          value={otp}
          onChange={(e) => {
            const value =
              e.target.value
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

      </div>


      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleVerify}
          disabled={otp.length !== 6}
        >
          Verify OTP
        </Button>


        <Button
          type="link"
          loading={resendLoading}
          disabled={resendDisabled}
          onClick={handleResend}
        >
          {resendDisabled
            ? `Resend OTP in ${countdown}s`
            : "Resend OTP"}
        </Button>

      </Space>

    </Card>
  );
};

export default VerifyOTP;