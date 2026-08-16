import { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import "./Hero.css";


const { Title, Paragraph } = Typography;

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="hero">
        <Row
          align="middle"
          gutter={[40, 40]}
        >
          {/* HERO CONTENT */}
          <Col xs={24} md={14}>
            <Title className="hero-title">
              Give Products
              <br />
              a Second Life.
            </Title>

            <Paragraph className="hero-description">
              Buy quality pre-owned products at affordable prices
              and give useful items a new home with ReWear.
            </Paragraph>

            <div className="hero-buttons">
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

          {/* HERO VISUAL */}
          <Col xs={24} md={10}>
            <div className="hero-visual">
              ReWear
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Hero;