import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  Card,
  Button,
  Typography,
  Space,
  Empty,
  message,
} from "antd";

import MainLayout from "../../layouts/MainLayout";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";

import { setCart } from "../../features/cart/cartSlice";

import "./Cart.css";

const { Title } = Typography;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();

      dispatch(
        setCart({
          items: res.data.data.items || [],
        })
      );
    } catch (err) {
      console.error("Load cart error:", err);
      message.error("Failed to load cart");
    }
  };

  const increaseQty = async (item) => {
    try {
      await updateCartItem(
        item._id,
        item.quantity + 1
      );

      await loadCart();
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    try {
      await updateCartItem(
        item._id,
        item.quantity - 1
      );

      await loadCart();
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);

      message.success("Removed from cart");

      await loadCart();
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  if (!items || items.length === 0) {
    return (
      <MainLayout>
        <div className="cart-empty">
          <Empty description="Your cart is empty" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <Title level={2} className="cart-title">
          Shopping Cart
        </Title>

        <List
          className="cart-list"
          dataSource={items}
          renderItem={(item) => (
            <Card
              key={item._id}
              className="cart-item-card"
            >
              <List.Item
                className="cart-list-item"
                actions={[
                  <Space
                    key="qty"
                    className="cart-quantity"
                  >
                    <Button
                      onClick={() =>
                        decreaseQty(item)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>

                    <strong>{item.quantity}</strong>

                    <Button
                      onClick={() =>
                        increaseQty(item)
                      }
                    >
                      +
                    </Button>
                  </Space>,

                  <Button
                    key="remove"
                    danger
                    onClick={() =>
                      removeItem(item._id)
                    }
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <span className="cart-product-title">
                      {item.product.title}
                    </span>
                  }
                  description={
                    <span className="cart-product-price">
                      ₹{item.product.price}
                    </span>
                  }
                />
              </List.Item>
            </Card>
          )}
        />

        <div className="cart-checkout">
          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;