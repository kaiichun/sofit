import React, { useState, useEffect } from "react";
import {
  Container,
  Text,
  Space,
  Card,
  Grid,
  TextInput,
  NumberInput,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { IoImages } from "react-icons/io5";
import { API_URL } from "../api/data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addProduct, uploadProductImage } from "../api/products";
import { useCookies } from "react-cookie";

function ProductAdd() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState();
  const [store, setStore] = useState("");
  const [cost, setCost] = useState("");
  const [profit, setProfit] = useState("");
  const [commission, setCommission] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState(4);

  // create mutation
  const createMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      notifications.show({
        title: "New Product Added",
        color: "green",
      });
      navigate("/product");
    },
    onError: (error) => {
      // when this is an error in API call
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const calculateProfit = () => {
    const priceValue = parseFloat(price);
    const costValue = parseFloat(cost);
    const commissionValue = parseFloat(commission);

    // Ensure all values are valid numbers
    if (!isNaN(priceValue) && !isNaN(costValue) && !isNaN(commissionValue)) {
      const calculatedProfit = priceValue - costValue - commissionValue;
      setProfit(calculatedProfit);
    } else {
      // If any value is not a valid number, set profit to an empty string
      setProfit("");
    }
  };

  useEffect(() => {
    calculateProfit();
  }, [price, cost, commission]);

  useEffect(() => {
    // Convert price and commissionPercentage to numbers
    const priceValue = parseFloat(price);
    const commissionPercentageValue = parseFloat(commissionPercentage);

    // Check if both price and commissionPercentage are valid numbers
    if (!isNaN(priceValue) && !isNaN(commissionPercentageValue)) {
      // Calculate commission
      const calculatedCommission =
        (priceValue * commissionPercentageValue) / 100;

      // Check if the result is a valid number before setting it
      if (!isNaN(calculatedCommission)) {
        setCommission(calculatedCommission);
      } else {
        setCommission(""); // Set commission to empty string if calculation result is not a number
      }
    } else {
      // Set commission to empty string if either price or commissionPercentage is not a valid number
      setCommission("");
    }
  }, [price, commissionPercentage]);

  const handleAddNewPrdouct = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        description: description,
        price: price,
        productImage: productImage,
        category: category,
        store: store,
        profit: profit,
        cost: cost,
        commission: commission,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadProductImageMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setProductImage(data.image_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleProductImageUpload = (files) => {
    uploadProductImageMutation.mutate(files[0]);
  };

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" p="20px">
        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <>
              <Text>Product Image</Text>

              {productImage && productImage !== "" ? (
                <>
                  <Image
                    src={API_URL + "/" + productImage}
                    width="100%"
                    height="180px"
                  />
                  <Group position="center">
                    <Button
                      color="dark"
                      mt="-50px"
                      onClick={() => setProductImage("")}
                    >
                      Remove
                    </Button>
                  </Group>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={180}
                  onDrop={(files) => {
                    handleProductImageUpload(files);
                  }}
                >
                  <Space h="25px" />
                  <Group position="center">
                    <Group
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "#C1C2C5",
                        borderRadius: "50%",
                      }}
                    >
                      <IoImages
                        style={{
                          margin: "auto",
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </Group>
                  </Group>
                  <Space h="20px" />
                  <Group position="center">
                    <Text size="xs" fw={500}>
                      Drag or drop image files to upload
                    </Text>
                  </Group>

                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload Product Image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </>
          </Grid.Col>
          <Grid.Col span={8}>
            <Grid.Col span={12}>
              <TextInput
                value={name}
                placeholder="Enter the product name here"
                label="Name"
                onChange={(event) => setName(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                value={description}
                placeholder="Enter the description here"
                label="Description"
                withAsterisk
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                value={category}
                placeholder="Enter the category here"
                label="Category"
                onChange={(event) => setCategory(event.target.value)}
              />
            </Grid.Col>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              value={price}
              label="Price (MYR)"
              precision={2}
              withAsterisk
              onChange={setPrice}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              value={store}
              placeholder="Enter the price here"
              label="Store"
              precision={0}
              onChange={setStore}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              value={cost}
              placeholder="Enter the price here"
              label="Cost"
              precision={2}
              withAsterisk
              onChange={setCost}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              value={commissionPercentage}
              label="Commission (Deafualt is 4%)"
              precision={2}
              onChange={(value) => setCommissionPercentage(value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              value={profit}
              label="Profit"
              precision={2}
              disabled
              withAsterisk
              onChange={setProfit}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              value={commission}
              label="Commission"
              precision={2}
              disabled
              onChange={setCommission}
            />
          </Grid.Col>
        </Grid>

        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewPrdouct}>
          Add New
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/product"
          variant="subtle"
          size="xs"
          color="gray"
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
export default ProductAdd;
