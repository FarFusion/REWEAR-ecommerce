import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Col,
  Empty,
  Row,
  Typography,
  Button,
  message,
} from "antd";

import MainLayout from "../../layouts/MainLayout";

import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import { setWishlist } from "../../features/wishlist/wishlistSlice";

import {
  getCart,
  addToCart,
} from "../../services/cartService";

import { setCart } from "../../features/cart/cartSlice";




const { Title } = Typography;

const Wishlist = () => {
  const dispatch = useDispatch();

  const items = useSelector(
    (state) => state.wishlist.items
  );

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
        await addToCart({
        productId,
        quantity: 1,
        });

        const res = await getCart();

        dispatch(
        setCart({
            items: res.data.data.items,
        })
        );

        message.success("Added to cart");
    } catch (err) {
        message.error(
        err.response?.data?.message ||
            "Failed to add to cart"
        );
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();

      dispatch(
        setWishlist(res.data.data)
      );
    } catch (err) {
      message.error("Failed to load wishlist");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

      const res = await getWishlist();

      dispatch(
        setWishlist(res.data.data)
      );

      message.success("Removed from wishlist");
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  if (!items.length) {
    return (
      <MainLayout>
        <Empty description="Your wishlist is empty" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>My Wishlist</Title>

      <Row gutter={[20, 20]}>
        {items.map((item) => {
          const product = item.product;

          return (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={item._id}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={
                      product.images?.[0] ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    style={{
                      height: 220,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Title level={4}>
                  {product.title}
                </Title>

                <p>
                  {product.condition}
                </p>

                <Title level={5}>
                  ₹{product.price}
                </Title>

                <Button
                    type="primary"
                    block
                    style={{ marginBottom: 10 }}
                    onClick={() =>
                        handleAddToCart(product._id)
                    }
                    >
                    Add to Cart
                </Button>

                <Button
                  danger
                  block
                  onClick={() =>
                    handleRemove(product._id)
                  }
                >
                  Remove
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </MainLayout>
  );
};

export default Wishlist;