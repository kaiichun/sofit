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

export default function HeaderClient({ title, page = "", text = "" }) {
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

  const isAdminB = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin Branch"
      ? true
      : false;
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin HQ"
      ? true
      : false;
  }, [cookies]);

  return (
    <div className="header">
      <Space h="30px" />
      <Group position="apart">
        <div></div>
        <Group position="right">
          <Button
            component={Link}
            to="/clients"
            variant={page === "clients" ? "light" : "subtle"}
          >
            Clients
          </Button>
          {(isAdminB || isAdminHQ) && (
            <Button
              component={Link}
              to="/add-client"
              variant={page === "AddMember" ? "light" : "subtle"}
            >
              Add Member
            </Button>
          )}
          <Button
            component={Link}
            to="/checkout-package"
            variant={page === "Package" ? "light" : "subtle"}
          >
            Package
          </Button>
          <Button
            component={Link}
            to="/client-orders-summary"
            variant={page === "Summary" ? "light" : "subtle"}
          >
            Summary
          </Button>
        </Group>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="30px" />
    </div>
  );
}
