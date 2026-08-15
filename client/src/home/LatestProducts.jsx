import { useEffect, useState } from "react";
import { Col, Empty, Row, Spin, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import { getProducts } from "../services/productService";

const { Title } = Typography;

const LatestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
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
      });

      setLatestProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to load latest products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <section style={{ marginBottom: 60 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Recently Added
        </Title>

        <Link to="/products">
          View All <ArrowRightOutlined />
        </Link>
      </div>

      {productLoading ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
          }}
        >
          <Spin size="large" />
        </div>
      ) : latestProducts.length === 0 ? (
        <Empty description="No products available" />
      ) : (
        <Row gutter={[24, 24]}>
          {latestProducts.map((product) => (
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

export default LatestProducts;