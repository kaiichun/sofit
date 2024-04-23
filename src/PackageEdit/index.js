import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Space,
  Card,
  Grid,
  TextInput,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";

import { Link, useNavigate, useParams } from "react-router-dom";

import { notifications } from "@mantine/notifications";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { addPackage, getPackage, updatePackage } from "../api/package";

function PackageAdd() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [sofitpackage, setSofitPackage] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sessions, setSessions] = useState();

  const updateMutation = useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "Package is updated successfully",
        color: "green",
      });

      navigate("/clients");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdatePackage = async (event) => {
    // 阻止表单默认提交行为
    event.preventDefault();
    // 使用updateMutation mutation来更新商品信息
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        sofitpackage: sofitpackage,
        sessions: sessions,
        price: price,
        category: category,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const { isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => getPackage(id),
    onSuccess: (data) => {
      setSofitPackage(data.sofitpackage);
      setSessions(data.sessions);
      setPrice(data.price);
      setCategory(data.category);
    },
  });

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" p="20px">
        <Grid grow gutter="xs">
          <Grid.Col span={8}>
            <Grid.Col span={12}>
              <TextInput
                value={sofitpackage}
                placeholder="Enter the product name here"
                label="Package Name"
                onChange={(event) => setSofitPackage(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                value={price}
                label="Price(USD)"
                precision={2}
                withAsterisk
                onChange={setPrice}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={category}
                placeholder="Enter the category here"
                label="Category"
                onChange={(event) => setCategory(event.target.value)}
              />
            </Grid.Col>{" "}
            <Grid.Col span={4}>
              <NumberInput
                value={sessions}
                label="sessions"
                precision={0}
                onChange={setSessions}
              />
            </Grid.Col>
          </Grid.Col>
        </Grid>
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdatePackage}>
          Add New
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/clients"
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
export default PackageAdd;
