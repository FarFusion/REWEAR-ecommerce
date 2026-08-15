import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setWishlist } from "../features/wishlist/wishlistSlice";
import { getWishlist } from "../services/wishlistService";

export default function useLoadWishlist() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function load() {
      try {
        const res = await getWishlist();

        dispatch(setWishlist(res.data.data));
      } catch (err) {}
    }

    if (localStorage.getItem("token")) {
      load();
    }
  }, []);
}