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
  Select,
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
  const [valiMonth, setValiMonth] = useState();

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
        valiMonth: valiMonth,
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
      setValiMonth(data.valiMonth);
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
                label="Price (MYR)"
                precision={2}
                withAsterisk
                onChange={setPrice}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Categroy"
                data={[
                  {
                    value: "Junior Coach",
                    label: "Junior Coach",
                  },
                  {
                    value: "Senior Coach",
                    label: "Senior Coach",
                  },
                  {
                    value: "Advanced Senior Coach",
                    label: "Advanced Senior Coach",
                  },
                  {
                    value: "Master Coach",
                    label: "Master Coach",
                  },
                ]}
                value={category}
                placeholder="Enter the category here"
                onChange={(value) => setCategory(value)}
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
            <Select
              label="Vali Month"
              data={[
                {
                  value: "1",
                  label: "1",
                },
                {
                  value: "2",
                  label: "2",
                },
                {
                  value: "3",
                  label: "3",
                },
                {
                  value: "4",
                  label: "4",
                },
                {
                  value: "5",
                  label: "5",
                },
                {
                  value: "6",
                  label: "6",
                },
                {
                  value: "7",
                  label: "7",
                },
                {
                  value: "8",
                  label: "8",
                },
                {
                  value: "9",
                  label: "9",
                },
                {
                  value: "10",
                  label: "10",
                },
                {
                  value: "11",
                  label: "11",
                },
                {
                  value: "12",
                  label: "12",
                },
              ]}
              value={valiMonth}
              placeholder="Select Valid Month"
              onChange={(value) => setValiMonth(value)}
            />
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
