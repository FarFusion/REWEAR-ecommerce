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

import "./categorySection.css";



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
    <section className="category-section">
      <Title className="section-title" level={2}>Shop by Category</Title>

      {categoryLoading ? (
        <div className="category-loading">
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
                className="category-card"
              >
                <div className="category-icon">
                  <span>
                    {categoryIcons[category.name] || <ShopOutlined />}
                  </span>
                </div>

                <Title level={5} className="category-name"
                >
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