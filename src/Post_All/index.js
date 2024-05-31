import {
  Card,
  Text,
  UnstyledButton,
  Grid,
  Title,
  Group,
  TextInput,
  Space,
  Container,
} from "@mantine/core";
import React, { useState, useMemo, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchPosts } from "../api/post";
import { addBranch, fetchBranch } from "../api/auth";

export default function PostAll() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStaff, setCurrentStaff] = useState([]);
  const [branch, setBranch] = useState("");
  const [hp, setHp] = useState("");
  const [address, setAddress] = useState("");
  const [ssm, setSsm] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading, data: posts = [] } = useQuery({
    queryKey: ["postcontent"],
    queryFn: () => fetchPosts(),
  });

  const { data: branches } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const createMutation = useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      notifications.show({
        title: "Branch Added",
        color: "green",
      });
      close();
      queryClient.invalidateQueries({
        queryKey: ["fetchB"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewBranch = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        branch,
        ssm,
        hp,
        address,
      }),
      token: currentUser ? currentUser.token : "",
    });
    setBranch("");
    setSsm("");
    setHp("");
    setAddress("");
  };

  const isAdminHQ = useMemo(() => {
    return (
      cookies && cookies.currentUser && cookies.currentUser.role === "Admin HQ"
    );
  }, [cookies]);

  useEffect(() => {
    let newList = posts ? [...posts] : [];

    if (searchTerm) {
      newList = newList.filter(
        (i) =>
          i.content &&
          i.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setCurrentStaff(newList);
  }, [posts, searchTerm]);

  return (
    <>
      <Space h="80px" />
      <Container w={1000}>
        <Group position="apart">
          <Text size="xl" color="dimmed">
            All Notifications
          </Text>
          <TextInput
            w="200px"
            value={searchTerm}
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </Group>
        <Space h="15px" />
        <Grid>
          {posts.length === 0 ? (
            <>
              <Space h={100} />
              <Card>
                <Group position="center">
                  <Text size={16}>No Notifications</Text>
                </Group>
              </Card>
            </>
          ) : currentStaff.length === 0 ? (
            <>
              <Space h={100} />
              <Card>
                <Group position="center">
                  <Text size={16}>No Match</Text>
                </Group>
              </Card>
            </>
          ) : (
            currentStaff
              .filter((v) => v.status === "Publish")
              .map((v) => (
                <Grid.Col md={12} lg={12} sm={12} key={v._id}>
                  <UnstyledButton
                    component={Link}
                    to={"/post/" + v._id}
                    variant="transparent"
                  >
                    <Card style={{ border: 0 }} radius="md">
                      <Group position="left">
                        <img
                          src={
                            v && v.user && v.user.image
                              ? "http://localhost:2019/" + v.user.image
                              : ""
                          }
                          alt="Profile Picture"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            marginTop: "-40px",
                          }}
                        />
                        <div style={{ paddingTop: "10px" }}>
                          <Title order={3}>{v.content}</Title>
                          <Space h="15px" />
                          {v && v.user && v.user.name ? (
                            <Text size="sm" color="dimmed">
                              {v.user.name}
                            </Text>
                          ) : null}
                          <Group position="left">
                            <Text size="sm" color="dimmed">
                              {v.createdAt
                                ? new Date(v.createdAt)
                                    .toISOString()
                                    .split("T")[0]
                                : null}
                            </Text>
                            <Text size="sm" color="dimmed">
                              {v.createdAt
                                ? formatDistanceToNow(parseISO(v.createdAt), {
                                    addSuffix: true,
                                  })
                                : null}
                            </Text>
                          </Group>
                        </div>
                      </Group>
                    </Card>
                  </UnstyledButton>
                </Grid.Col>
              ))
          )}
        </Grid>
      </Container>
      <Space h="80px" />
    </>
  );
}
