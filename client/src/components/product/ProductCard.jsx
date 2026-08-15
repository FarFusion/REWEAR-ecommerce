import { Card, Button, Image, Rate } from "antd";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images?.[0]?.url ||
    "https://placehold.co/400x300?text=No+Image";

  return (
    <Card
      hoverable
      cover={
        <Image
          preview={false}
          alt={product.title}
          src={imageUrl}
          fallback="https://placehold.co/400x300?text=No+Image"
          style={{
            height: 220,
            width: "100%",
            objectFit: "cover",
          }}
        />
      }
    >
      <h3>{product.title}</h3>

      <p>{product.condition}</p>

      <Rate
        disabled
        allowHalf
        value={product.averageRating || 0}
        style={{ fontSize: 14 }}
      />

      <h2>₹{product.price}</h2>

      <Link to={`/products/${product._id}`}>
        <Button type="primary" block>
          View Details
        </Button>
      </Link>
    </Card>
  );
};

export default ProductCard;