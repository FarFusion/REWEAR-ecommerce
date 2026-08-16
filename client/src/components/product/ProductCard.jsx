import { Card, Button, Image, Rate } from "antd";
import { Link } from "react-router-dom";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images?.[0]?.url ||
    "https://placehold.co/400x300?text=No+Image";

  return (
    <Card
      className="product-card"
      hoverable
      cover={
        <Image
          className="product-card-image"
          preview={false}
          alt={product.title}
          src={imageUrl}
          fallback="https://placehold.co/400x300?text=No+Image"
        />
      }
    >
      <div className="product-card-content">
        <h3 className="product-card-title">
          {product.title}
        </h3>

        <p className="product-card-condition">
          {product.condition}
        </p>

        <Rate
          className="product-card-rating"
          disabled
          allowHalf
          value={product.averageRating || 0}
        />

        <h2 className="product-card-price">
          ₹{product.price}
        </h2>

        <Link 
          to={`/products/${product._id}`}
          className="product-card-link"
        >
          <Button type="primary" block>
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProductCard;