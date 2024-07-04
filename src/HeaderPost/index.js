import {
  Group,
  Space,
  Title,
  Divider,
  Button,
  Text,
  Badge,
  Avatar,
} from "@mantine/core";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart, getCartItems } from "../api/cart";

export default function HeaderPost({ title, page = "", text = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],

    queryFn: getCartItems,
  });

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity; // Accumulate the quantity of each item
    });
    return total;
  }, [cart]);

  return (
    <div className="header">
      <Space h="30px" />
      <Group position="apart">
        <div></div>
        <Group position="right">
          <Button
            component={Link}
            to="/all-post"
            w={100}
            variant={page === "publish" ? "light" : "subtle"}
          >
            Publish
          </Button>
          <Button
            component={Link}
            to="/draft-post"
            w={100}
            variant={page === "draft" ? "light" : "subtle"}
          >
            Draft
          </Button>
        </Group>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="30px" />
    </div>
  );
}
