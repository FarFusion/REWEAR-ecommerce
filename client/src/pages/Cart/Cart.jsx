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
        err.response?.data?.message || "Failed to update quantity"
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
        err.response?.data?.message || "Failed to update quantity"
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
        err.response?.data?.message || "Failed to remove item"
        );
    }
    };

  if (!items || items.length === 0) {
    return (
      <MainLayout>
        <Empty description="Your cart is empty" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <Title level={2}>Shopping Cart</Title>

        <List
            dataSource={items}
            renderItem={(item) => (
            <Card
                key={item._id}
                style={{ marginBottom: 16 }}
            >
                <List.Item
                actions={[
                    <Space key="qty">
                    <Button
                        onClick={() => decreaseQty(item)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </Button>

                    <strong>{item.quantity}</strong>

                    <Button
                        onClick={() => increaseQty(item)}
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
                    title={item.product.title}
                    description={`₹${item.product.price}`}
                />
                </List.Item>
            </Card>
            )}
        />

        <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate("/checkout")}
        >
            Proceed to Checkout
        </Button>

    </MainLayout>
  );
};

export default Cart;