import { useEffect, useMemo, useState } from "react";
import { Row, Col, Pagination, Spin, Empty, message } from "antd";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import ProductFilters from "../../components/product/ProductFilters";
import ProductGrid from "../../components/product/ProductGrid";

import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // URL → filters
  const filters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());

    return {
      ...params,
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 12,
    };
  }, [searchParams]);

  // filters → URL
  const setFilters = (updater) => {
    const nextFilters =
      typeof updater === "function"
        ? updater(filters)
        : updater;

    const params = {};

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params[key] = String(value);
      }
    });

    setSearchParams(params);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  async function loadCategories() {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      message.error("Failed to load categories");
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);

      const res = await getProducts(filters);

      setProducts(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  return (
    <MainLayout>
      <Row gutter={[24, 24]}>
        {/* Filters */}
        <Col xs={24} md={6}>
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
          />
        </Col>

        {/* Products */}
        <Col xs={24} md={18}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 80,
              }}
            >
              <Spin size="large" />
            </div>
          ) : products.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <>
              <ProductGrid products={products} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <Pagination
                  current={filters.page}
                  pageSize={filters.limit}
                  total={total}
                  showSizeChanger
                  pageSizeOptions={["8", "12", "24", "48"]}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Products;