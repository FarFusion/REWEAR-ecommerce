import { Card, Select, Input, InputNumber, Button, Space } from "antd";

import "./ProductFilters.css";

const { Search } = Input;

const ProductFilters = ({
  filters,
  setFilters,
  categories = [],
}) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
  };

  return (
    <Card className="product-filters-card" title="Filters">
      <div className="product-filters">
        {/* Search */}
          <Search
              placeholder="Search products..."
              allowClear
              enterButton
              value={filters.keyword}
              onSearch={(value) =>
                  updateFilter("keyword", value || undefined)
              }
              onChange={(e) => {
                  if (!e.target.value) {
                  updateFilter("keyword", undefined);
                  }
              }}
          />

        {/* Category */}
        <Select
          className="filter-control"
          style={{ width: "100%" }}
          placeholder="Category"
          allowClear
          value={filters.category}
          onChange={(value) =>
            updateFilter("category", value)
          }
          options={categories.map((category) => ({
            value: category._id,
            label: category.name,
          }))}
        />

        {/* Brand */}
        <Input
          className="filter-control"
          placeholder="Brand"
          allowClear
          value={filters.brand}
          onChange={(e) =>
            updateFilter(
              "brand",
              e.target.value || undefined
            )
          }
        />

        {/* Condition */}
        <Select
          className="filter-control"
          style={{ width: "100%" }}
          placeholder="Condition"
          allowClear
          value={filters.condition}
          onChange={(value) =>
            updateFilter("condition", value)
          }
          options={[
            {
              value: "Excellent",
              label: "Excellent",
            },
            {
              value: "Good",
              label: "Good",
            },
            {
              value: "Fair",
              label: "Fair",
            },
          ]}
        />

        {/* City */}
        <Input
          className="filter-control"
          placeholder="City"
          allowClear
          value={filters.city}
          onChange={(e) =>
            updateFilter(
              "city",
              e.target.value || undefined
            )
          }
        />

        {/* Price */}
        <Space.Compact className="price-filter">
          <InputNumber
            placeholder="Min price"
            min={0}
            value={filters.minPrice}
            onChange={(value) =>
              updateFilter("minPrice", value)
            }
          />

          <InputNumber
            placeholder="Max price"
            min={0}
            value={filters.maxPrice}
            onChange={(value) =>
              updateFilter("maxPrice", value)
            }
          />
        </Space.Compact>

        {/* Sort */}
        <Select
          className="filter-control"
          placeholder="Sort by"
          allowClear
          value={filters.sort}
          onChange={(value) =>
            updateFilter("sort", value)
          }
          options={[
            {
              value: "priceAsc",
              label: "Price: Low to High",
            },
            {
              value: "priceDesc",
              label: "Price: High to Low",
            },
            {
              value: "rating",
              label: "Highest Rated",
            },
          ]}
        />

        <Button block onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default ProductFilters;