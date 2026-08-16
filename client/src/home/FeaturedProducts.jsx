import { useEffect, useState } from "react";
import { Col, Empty, Row, Spin, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import { getProducts } from "../services/productService";

import "./productSection.css";

const { Title } = Typography;

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProductLoading(true);

      const response = await getProducts({
        page: 1,
        limit: 8,
        sort: "rating",
      });

      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to load featured products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <section className="product-section">
      <div className="product-section-header">
        <Title className="section-title" level={2}>
          Featured Products
        </Title>

        <Link to="/products">
          View All <ArrowRightOutlined />
        </Link>
      </div>

      {productLoading ? (
        <div className="product-section-loading">
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <Empty description="No featured products available" />
      ) : (
        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={product._id}
            >
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default FeaturedProducts;