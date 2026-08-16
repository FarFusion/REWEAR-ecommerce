import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Typography,
  Button,
  Tag,
  Spin,
  message,
  Rate,
  Form,
  Input,
  Card,
  Divider,
} from "antd";

import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

import MainLayout from "../../layouts/MainLayout";

import { getProduct } from "../../services/productService";

import {
  addToCart,
  getCart,
} from "../../services/cartService";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setCart } from "../../features/cart/cartSlice";
import { setWishlist } from "../../features/wishlist/wishlistSlice";
import {
  getReviews,
  createReview,
  deleteReview,
} from "../../services/reviewService";

import "./ProductDetails.css";




const { Title, Paragraph } = Typography;

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );


  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );  

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);


    useEffect(() => {
    if (id) {
        loadReviews();
    }
    }, [id]);




  // Check whether current product is already in wishlist
  const isWishlisted = wishlistItems.some(
    (item) => item.product?._id === product?._id
  );
  

  //load Reviews-----------
  const loadReviews = async () => {
    try {
        setReviewLoading(true);

        const res = await getReviews(id);

        setReviews(res.data.data || []);
    } catch (err) {
        message.error(
        err.response?.data?.message ||
            "Failed to load reviews"
        );
    } finally {
        setReviewLoading(false);
    }
  };

  const handleCreateReview = async (values) => {
    try {
        await createReview({
        productId: product._id,
        rating: values.rating,
        comment: values.comment,
        });

        message.success("Review added successfully");

        form.resetFields();

        await loadReviews();

        // Refresh product so averageRating/numReviews update
        const productRes = await getProduct(id);

        setProduct(productRes.data.data);
    } catch (err) {
        message.error(
        err.response?.data?.message ||
            "Failed to add review"
        );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
        await deleteReview(reviewId);

        message.success("Review deleted");

        await loadReviews();

        const productRes = await getProduct(id);

        setProduct(productRes.data.data);
    } catch (err) {
        message.error(
        err.response?.data?.message ||
            "Failed to delete review"
        );
    }
  };

  // -------------------------
  // Add to Cart
  // -------------------------
  const handleAddToCart = async () => {
    if (!product?._id) return;

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
      });

      const cart = await getCart();

      dispatch(
        setCart({
          items: cart.data.data.items,
        })
      );

      message.success("Added to cart");
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  };

  // -------------------------
  // Wishlist
  // -------------------------
  const handleWishlist = async () => {
    if (!product?._id) return;

    try {
      if (isWishlisted) {
        // Remove
        await removeFromWishlist(product._id);

        const wishlist = await getWishlist();

        dispatch(
          setWishlist(wishlist.data.data)
        );

        message.success("Removed from wishlist");
      } else {
        // Add
        await addToWishlist(product._id);

        const wishlist = await getWishlist();

        dispatch(
          setWishlist(wishlist.data.data)
        );

        message.success("Added to wishlist");
      }
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Wishlist operation failed"
      );
    }
  };

  // -------------------------
  // Load Product
  // -------------------------
  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);

      const res = await getProduct(id);

      setProduct(res.data.data);
      setSelectedImage(0);
    } catch (err) {
      message.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // Loading
  // -------------------------
  if (loading) {
    return (
      <MainLayout>
        <Spin size="large" />
      </MainLayout>
    );
  }

  // -------------------------
  // Product not found
  // -------------------------
  if (!product) {
    return (
      <MainLayout>
        Product not found.
      </MainLayout>
    );
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <MainLayout>
      <div className="product-details-page">
        {/* Product Information */}
        <Row
          gutter={[
            { xs: 0, md: 40 },
            { xs: 24, md: 40 },
          ]}
        >
          {/* Images */}
          <Col xs={24} md={10}>
            <div className="product-image-container">
              <Image
                width="100%"
                src={
                  product.images?.length
                    ? product.images[selectedImage]?.url
                    : "https://placehold.co/600x500?text=No+Image"
                }
                fallback="https://placehold.co/600x500?text=No+Image"
                className="product-main-image"
                preview
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={image.public_id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`product-thumbnail ${
                      selectedImage === index
                        ? "active"
                        : ""
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Product Information */}
          <Col xs={24} md={14}>
            <div className="product-info">
              <Title className="product-title">
                {product.title}
              </Title>

              {/* Rating */}
              <div className="product-rating">
                <Rate
                  disabled
                  allowHalf
                  value={product.averageRating || 0}
                />

                <span className="rating-value">
                  {product.averageRating
                    ? product.averageRating.toFixed(1)
                    : "No rating"}
                </span>

                <span className="review-count">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Tags */}
              <div className="product-tags">
                <Tag color="blue">
                  {product.condition}
                </Tag>

                <Tag>{product.brand}</Tag>
              </div>

              {/* Price */}
              <Title
                level={2}
                className="product-price"
              >
                ₹{product.price}
              </Title>

              {product.originalPrice && (
                <Paragraph className="original-price">
                  ₹{product.originalPrice}
                </Paragraph>
              )}

              {/* Description */}
              <Paragraph className="product-description">
                {product.description}
              </Paragraph>

              {/* Actions */}
              <div className="product-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>

                <Button
                  size="large"
                  icon={
                    isWishlisted ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={handleWishlist}
                >
                  {isWishlisted
                    ? "Remove from Wishlist"
                    : "Wishlist"}
                </Button>

                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate("/checkout")}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* Reviews */}
        <Card
          title={`Customer Reviews (${product.numReviews || 0})`}
          className="reviews-card"
        >
          {/* Write Review */}
          {token ? (
            <Card
              type="inner"
              title="Write a Review"
              className="write-review-card"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateReview}
              >
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a rating",
                    },
                  ]}
                >
                  <Rate />
                </Form.Item>

                <Form.Item
                  name="comment"
                  label="Your Review"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please write a review",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Share your experience with this product..."
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                >
                  Submit Review
                </Button>
              </Form>
            </Card>
          ) : (
            <Card
              type="inner"
              className="login-review-card"
            >
              Please login to write a review.
            </Card>
          )}

          {/* Reviews List */}
          {reviewLoading ? (
            <div className="reviews-loading">
              <Spin />
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              No reviews yet. Be the first to
              review this product!
            </div>
          ) : (
            reviews.map((review) => {
              const isOwner =
                currentUser &&
                review.user?._id === currentUser._id;

              return (
                <Card
                  key={review._id}
                  className="review-card"
                >
                  <div className="review-header">
                    <div>
                      <Typography.Text strong>
                        {review.user?.firstName}{" "}
                        {review.user?.lastName}
                      </Typography.Text>

                      <div className="review-rating">
                        <Rate
                          disabled
                          value={review.rating}
                        />
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        danger
                        type="text"
                        onClick={() =>
                          handleDeleteReview(
                            review._id
                          )
                        }
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  <Paragraph className="review-comment">
                    {review.comment}
                  </Paragraph>

                  {review.createdAt && (
                    <Typography.Text
                      type="secondary"
                      className="review-date"
                    >
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </Typography.Text>
                  )}
                </Card>
              );
            })
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProductDetails;