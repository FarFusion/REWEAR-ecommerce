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
      <Row gutter={40}>
        <Col xs={24} md={10}>
        {/* Main Image */}
        <div
            style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            padding: 10,
            background: "#fff",
            }}
        >
            <Image
            width="100%"
            height={450}
            src={
                product.images?.length
                ? product.images[selectedImage]?.url
                : "https://placehold.co/600x500?text=No+Image"
            }
            fallback="https://placehold.co/600x500?text=No+Image"
            style={{
                objectFit: "contain",
                borderRadius: 6,
            }}
            />
        </div>

        {/* Thumbnails */}
        {product.images?.length > 1 && (
            <div
            style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
                overflowX: "auto",
                paddingBottom: 5,
            }}
            >
            {product.images.map((image, index) => (
                <div
                key={image.public_id || index}
                onClick={() => setSelectedImage(index)}
                style={{
                    width: 75,
                    height: 75,
                    flexShrink: 0,
                    border:
                    selectedImage === index
                        ? "2px solid #1677ff"
                        : "1px solid #d9d9d9",
                    borderRadius: 6,
                    padding: 3,
                    cursor: "pointer",
                }}
                >
                <img
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                    }}
                />
                </div>
            ))}
            </div>
        )}
        </Col>

        <Col xs={24} md={14}>
          <Title>{product.title}</Title>

            <div style={{ marginBottom: 12 }}>
            <Rate
                disabled
                allowHalf
                value={product.averageRating || 0}
            />

            <span style={{ marginLeft: 10 }}>
                {product.averageRating
                ? product.averageRating.toFixed(1)
                : "No rating"}
            </span>

            <span
                style={{
                marginLeft: 8,
                color: "#888",
                }}
            >
                ({product.numReviews || 0} reviews)
            </span>
            </div>

          <Tag color="blue">
            {product.condition}
          </Tag>

          <Tag>
            {product.brand}
          </Tag>

          <Title level={2}>
            ₹{product.price}
          </Title>

          {product.originalPrice && (
            <Paragraph
              delete
              style={{
                fontSize: 18,
              }}
            >
              ₹{product.originalPrice}
            </Paragraph>
          )}

          <Paragraph>
            {product.description}
          </Paragraph>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
            }}
          >
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
                isWishlisted
                  ? <HeartFilled />
                  : <HeartOutlined />
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
              onClick={()=>navigate("/checkout")}
            >
              Buy Now
            </Button>

          </div>
        </Col>
      </Row>

      <Divider />

      <Card
        title={`Customer Reviews (${product.numReviews || 0})`}
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        {/* Write Review */}

        {token ? (
          <Card
            type="inner"
            title="Write a Review"
            style={{
              marginBottom: 25,
            }}
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
            style={{
              marginBottom: 25,
              textAlign: "center",
            }}
          >
            Please login to write a review.
          </Card>
        )}

        {/* Reviews List */}

        {reviewLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: 30,
            }}
          >
            <Spin />
          </div>
        ) : reviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 30,
              color: "#888",
            }}
          >
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
                style={{
                  marginBottom: 15,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <Typography.Text strong>
                      {review.user?.firstName}{" "}
                      {review.user?.lastName}
                    </Typography.Text>

                    <div
                      style={{
                        marginTop: 5,
                      }}
                    >
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

                <Paragraph
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  {review.comment}
                </Paragraph>

                {review.createdAt && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginTop: 10,
                      fontSize: 12,
                    }}
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
    </MainLayout>

  );
};

export default ProductDetails;