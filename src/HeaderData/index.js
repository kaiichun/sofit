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

export default function HeaderData({ title, page = "", text = "" }) {
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],

    queryFn: getCartItems,
  });

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
            to="/data-client"
            variant={page === "Client" ? "light" : "subtle"}
          >
            Client
          </Button>

          <Button
            component={Link}
            to="/sales-package"
            variant={page === "Packages" ? "light" : "subtle"}
          >
            Packages
          </Button>
          <Button
            component={Link}
            to="/sales-product"
            variant={page === "Products" ? "light" : "subtle"}
          >
            Products
          </Button>
          <Button
            component={Link}
            to="/data-wages"
            variant={page === "Wages" ? "light" : "subtle"}
          >
            Wages
          </Button>
        </Group>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="30px" />
    </div>
  );
}
