import { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import {
  MobileOutlined,
  SkinOutlined,
  HomeOutlined,
  BookOutlined,
  TrophyOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  DesktopOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryService";

const { Title } = Typography;

const categoryIcons = {
  Electronics: <MobileOutlined />,
  Fashion: <SkinOutlined />,
  "Home & Furniture": <HomeOutlined />,
  Books: <BookOutlined />,
  Gaming: <DesktopOutlined />,
  "Sports & Fitness": <TrophyOutlined />,
  Automotive: <CarOutlined />,
  Music: <CustomerServiceOutlined />,
};

const CategorySection = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);

      const res = await getCategories();

      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <section style={{ marginTop: 50, marginBottom: 60 }}>
      <Title level={2}>Shop by Category</Title>

      {categoryLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          Loading categories...
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {categories.map((category) => (
            <Col
              xs={12}
              sm={8}
              md={6}
              lg={4}
              key={category._id}
            >
              <Card
                hoverable
                onClick={() =>
                  navigate(`/products?category=${category._id}`)
                }
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 16px",
                    borderRadius: "50%",
                    background: "#f0f5ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 40,
                      color: "#1677ff",
                    }}
                  >
                    {categoryIcons[category.name] || <ShopOutlined />}
                  </span>
                </div>

                <Title level={5} style={{ margin: 0 }}>
                  {category.name}
                </Title>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default CategorySection;