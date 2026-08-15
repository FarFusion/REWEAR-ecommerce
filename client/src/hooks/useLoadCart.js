import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setCart } from "../features/cart/cartSlice";
import { getCart } from "../services/cartService";

export default function useLoadCart() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCart();

        dispatch(
          setCart({
            items: res.data.data?.items || [],
          })
        );
      } catch (err) {
        console.error(
          "Cart loading failed:",
          err.response?.status,
          err.response?.data || err.message
        );

        dispatch(
          setCart({
            items: [],
          })
        );
      }
    };

    if (localStorage.getItem("token")) {
      loadCart();
    }
  }, [dispatch]);
}