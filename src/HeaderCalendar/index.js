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

export default function HeaderCalendar({ title, page = "", text = "" }) {
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
            to="/calendar"
            w={100}
            variant={page === "Calendar" ? "light" : "subtle"}
          >
            Calendar View
          </Button>
          <Button
            component={Link}
            to="/calendar-table"
            w={100}
            variant={page === "Table" ? "light" : "subtle"}
          >
            Table View
          </Button>
        </Group>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="30px" />
    </div>
  );
}
