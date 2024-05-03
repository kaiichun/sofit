import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Title,
  Grid,
  Card,
  Badge,
  Text,
  TextInput,
  Group,
  Space,
  Image,
  Container,
  Button,
  Modal,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../api/products";
import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../Header";

function Products() {
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
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isLoading, data: products } = useQuery({
    queryKey: ["products"],

    queryFn: () => fetchProducts(currentUser ? currentUser.token : ""),
  });

  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],

    queryFn: getCartItems,
  });

  useEffect(() => {
    let newList = products ? [...products] : [];
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

    if (searchTerm) {
      newList = newList.filter(
        (i) => i.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      );
    }

    setCurrentProducts(newList);
  }, [products, category, sort, perPage, searchTerm, currentPage]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [products]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
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
          Products
        </Title>
        {isAdmin && (
          <Button component={Link} to="/product_add" color="green">
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group position="apart" mb="lg">
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
        <TextInput
          value={searchTerm}
          placeholder="Search"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
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
                      <Badge color="green">MYR {product.price}</Badge>
                      <Badge color="red">Store: {product.store}</Badge>
                      <Badge color="yellow">Category: {product.category}</Badge>
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
                      disabled={product.store === 0}
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
                              setProductIdToDelete(product._id);
                              setShowModal(true);
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
        <Modal
          centered
          overlayOpacity={0.55}
          overlayBlur={3}
          title="Confirm Deletion Products"
          opened={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <Divider />
          <Space h="10px" />
          <Group>
            <Text>Are you sure you want to delete this</Text>
            <Text c="red" fw={500}>
              {products && (
                <Text c="red" fw={500}>
                  {
                    products.find(
                      (product) => product._id === productIdToDelete
                    )?.name
                  }
                </Text>
              )}
            </Text>
            <Text>product?</Text>
          </Group>

          <Space h="20px" />
          <Group position="right">
            <Button
              color="red"
              size="sm"
              onClick={() => {
                deleteMutation.mutate({
                  id: productIdToDelete,
                  token: currentUser ? currentUser.token : "",
                });
                setShowModal(false);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Group>
        </Modal>
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

export default Products;
