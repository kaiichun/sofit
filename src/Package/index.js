import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Title,
  Grid,
  Card,
  Badge,
  Text,
  Group,
  Space,
  Image,
  Container,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../api/products";
import { fetchPackage, deletePackage } from "../api/package";
import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../Header";

function Package() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState([]);

  const { isLoading, data: packages } = useQuery({
    queryKey: ["packages"],

    queryFn: () => fetchPackage(currentUser ? currentUser.token : ""),
  });

  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],

    queryFn: getCartItems,
  });

  useEffect(() => {
    let newList = packages ? [...packages] : [];
    // filter by category
    if (category !== "") {
      newList = newList.filter((p) => p.category === category);
    }
    const total = Math.ceil(newList.length / perPage);
    // convert the total number into array
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "price":
        newList = newList.sort((a, b) => {
          return a.price - b.price;
        });
        break;
      default:
        break;
    }
    // do pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);

    setCurrentpackages(newList);
  }, [packages, category, sort, perPage, currentPage]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (packages && packages.length > 0) {
      packages.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [packages]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Packages"],
      });
      notifications.show({
        title: "Product is Deleted Successfully",
        color: "red",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Added to Cart",
        color: "green",
      });
    },
  });

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity;
    });
    return total;
  }, [cart]);

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "Admin HQ" ||
        cookies.currentUser.role === "Admin Branch")
      ? true
      : false;
  }, [cookies]);

  return (
    <Container size="100%">
      <Header page="home" />
      <Group position="apart">
        <Title order={3} align="center">
          packages
        </Title>
        {isAdmin && (
          <Button component={Link} to="/product_add" color="green">
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Category</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">No Sorting</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(parseInt(event.target.value));
            // reset it back to page 1
            setCurrentPage(1);
          }}
        >
          <option value="6">6 Per Page</option>
          <option value="10">10 Per Page</option>
          <option value={9999999}>All</option>
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentProducts
          ? currentProducts.map((product) => {
              return (
                <Grid.Col key={product._id} lg={4} md={6} sm={6} xs={6}>
                  <Card withBorder shadow="sm" p="20px">
                    <Card.Section>
                      <Image
                        src={"http://localhost:2019/" + product.productImage}
                        height={220}
                        alt="Norway"
                      />
                    </Card.Section>
                    <Title order={5}>{product.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">${product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Button
                      fullWidth
                      onClick={() => {
                        // pop a messsage if user is not logged in
                        if (cookies && cookies.currentUser) {
                          addToCartMutation.mutate(product);
                        } else {
                          notifications.show({
                            title: "Please login to proceed",
                            message: (
                              <>
                                <Button
                                  color="red"
                                  onClick={() => {
                                    navigate("/login");
                                    notifications.clean();
                                  }}
                                >
                                  Click here to login
                                </Button>
                              </>
                            ),
                            color: "red",
                          });
                        }
                      }}
                    >
                      Add To Cart
                    </Button>
                    {isAdmin && (
                      <>
                        <Space h="20px" />
                        <Group position="apart">
                          <Button
                            component={Link}
                            to={"/product_edit/" + product._id}
                            color="blue"
                            size="xs"
                            radius="50px"
                          >
                            Edit
                          </Button>
                          <Button
                            color="red"
                            size="xs"
                            radius="50px"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: product._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
      <Space h="40px" />
      <div>
        <span
          style={{
            marginRight: "10px",
          }}
        >
          Page {currentPage} of {totalPages.length}
        </span>
        {totalPages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
      <Space h="40px" />
    </Container>
  );
}

export default Package;
