import { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";



const { Title, Paragraph } = Typography;

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section
        style={{
          padding: "80px 40px",
          borderRadius: 16,
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          marginBottom: 60,
        }}
      >
        <Row
          align="middle"
          gutter={[40, 40]}
        >
          <Col xs={24} md={14}>
            <Title
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                marginBottom: 20,
              }}
            >
              Give Products
              <br />
              a Second Life.
            </Title>

            <Paragraph
              style={{
                fontSize: 18,
                maxWidth: 600,
                color: "#555",
              }}
            >
              Buy quality pre-owned products at affordable prices
              and give useful items a new home with ReWear.
            </Paragraph>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              <Link to="/products">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                >
                  Shop Now
                </Button>
              </Link>

              <Link to="/sell">
                <Button size="large">
                  Sell an Item
                </Button>
              </Link>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div
              style={{
                height: 300,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, #86efac, #22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 70,
                fontWeight: 700,
              }}
            >
              ReWear
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Hero;