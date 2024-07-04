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

export default function Header({ title, page = "", text = "" }) {
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
            to="/product"
            w={100}
            variant={page === "product" ? "light" : "subtle"}
          >
            Product
          </Button>
          <Button
            component={Link}
            to="/cart"
            variant={page === "cart" ? "light" : "subtle"}
            w={100}
          >
            <FaShoppingCart
              style={{
                marginRight: "-5px",
                height: 20,
                width: 20,
              }}
            />
            {/* Cart total */}
            {/* Show the cart total only if the user is authenticated */}

            <Badge
              color="red"
              size={2}
              style={{
                marginTop: "3px",
                marginBottom: "15px",
                padding: 5,
              }}
            >
              {cartTotal}
            </Badge>
          </Button>
          <Button
            component={Link}
            to="/orders"
            w={100}
            variant={page === "orders" ? "light" : "subtle"}
          >
            Orders
          </Button>
        </Group>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="30px" />
    </div>
  );
}
