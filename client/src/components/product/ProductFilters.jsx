import { Card, Select, Input, InputNumber, Button, Space } from "antd";

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
    <Card title="Filters">
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

      <br />
      <br />

      {/* Category */}
      <Select
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

      <br />
      <br />

      {/* Brand */}
      <Input
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

      <br />
      <br />

      {/* Condition */}
      <Select
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

      <br />
      <br />

      {/* City */}
      <Input
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

      <br />
      <br />

      {/* Price */}
      <Space.Compact style={{ width: "100%" }}>
        <InputNumber
          placeholder="Min price"
          style={{ width: "50%" }}
          min={0}
          value={filters.minPrice}
          onChange={(value) =>
            updateFilter("minPrice", value)
          }
        />

        <InputNumber
          placeholder="Max price"
          style={{ width: "50%" }}
          min={0}
          value={filters.maxPrice}
          onChange={(value) =>
            updateFilter("maxPrice", value)
          }
        />
      </Space.Compact>

      <br />
      <br />

      {/* Sort */}
      <Select
        style={{ width: "100%" }}
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

      <br />
      <br />

      <Button block onClick={resetFilters}>
        Reset Filters
      </Button>
    </Card>
  );
};

export default ProductFilters;