import {
  Card,
  Text,
  UnstyledButton,
  Grid,
  Title,
  Group,
  Button,
  TextInput,
  Table,
  Modal,
  Space,
  Container,
  Divider,
} from "@mantine/core";
import React, { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchPosts } from "../api/post";
import { addBranch, fetchBranch } from "../api/auth";

export default function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");
  const [hp, setHp] = useState("");
  const [address, setAddress] = useState("");
  const [ssm, setSsm] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading, data: posts = [] } = useQuery({
    queryKey: ["postcontent"],
    queryFn: () => fetchPosts(),
  });

  const { data: branchs } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const createMutation = useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      notifications.show({
        title: "Branch Add",
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
        branch: branch,
        ssm: ssm,
        hp: hp,
        address: address,
      }),
      token: currentUser ? currentUser.token : "",
    });
    setBranch("");
    setSsm("");
    setHp("");
    setAddress("");
  };

  const isAdminHQ = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin HQ"
      ? true
      : false;
  }, [cookies]);

  return (
    <>
      <div>
        <Group position="left">
          <div>
            <Text fw={700} fz="30px" mx={10}>
              Welcome, {currentUser.name}
            </Text>
          </div>
        </Group>
      </div>
      <Space h="150px" />{" "}
      <Container w={1000}>
        <Group position="apart">
          <Text color="">New Notifications</Text>
          <UnstyledButton
            component={Link}
            to={"/all-post"}
            variant="transparent"
          >
            See All
          </UnstyledButton>
        </Group>
        <Space h="15px" />{" "}
        <Grid>
          {posts ? (
            posts
              .filter((v) => v.status == "Publish")
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date descending
              .slice(0, 3)
              .map((v) => {
                return (
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
                          <div
                            style={{
                              paddingTop: "10px",
                            }}
                          >
                            <Title order={3}>{v.content}</Title>
                            <Space h="15px" />{" "}
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
                );
              })
          ) : (
            <>
              <Space h={100} />
              <Card>
                <Group position="center">
                  <Text size={16}>No Notification</Text>
                </Group>
              </Card>
            </>
          )}
        </Grid>
      </Container>
      <Space h="200px" /> <Divider />
      <Space h="50px" />{" "}
      {isAdminHQ ? (
        <>
          <Group position="apart">
            <Title order={3} align="center">
              Branch
            </Title>
            <Button
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
              onClick={open}
            >
              Add
            </Button>
          </Group>
          <Space h="20px" />
          <Grid>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SSM No</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                </tr>
              </thead>
              {branchs ? (
                branchs.map((f) => {
                  return (
                    <tbody>
                      <tr key={f._id}>
                        <td>{f.branch}</td>
                        <td>{f.ssm}</td>
                        <td>{f.hp}</td>
                        <td>{f.address}</td>
                        <td>
                          <UnstyledButton
                            component={Link}
                            to={"/edit-branch/" + f._id}
                            variant="transparent"
                          >
                            Edit
                          </UnstyledButton>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              ) : (
                <Grid.Col className="mt-5">
                  <Space h="40px" />
                  <h2 className="text-center text-muted">
                    No Create Any Branch yet .
                  </h2>
                </Grid.Col>
              )}
            </Table>
          </Grid>
        </>
      ) : null}
      <Modal
        opened={opened}
        onClose={close}
        size="sm"
        centered
        title="Create a new branch"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 5,
        }}
      >
        <TextInput
          value={branch}
          placeholder="XXX"
          radius="md"
          withAsterisk
          label="Branch Name"
          onChange={(event) => setBranch(event.target.value)}
        />
        <TextInput
          value={ssm}
          radius="md"
          withAsterisk
          label="Company Resigter No (SSM No)"
          onChange={(event) => setSsm(event.target.value)}
        />
        <TextInput
          value={hp}
          placeholder="XXX"
          radius="md"
          withAsterisk
          label="Branch Phone Number"
          onChange={(event) => setHp(event.target.value)}
        />
        <TextInput
          value={address}
          placeholder="XXX"
          radius="md"
          withAsterisk
          label="Branch Address"
          onChange={(event) => setAddress(event.target.value)}
        />
        <Group position="right" mt={20}>
          <Button onClick={handleAddNewBranch}>Create</Button>
        </Group>
      </Modal>
    </>
  );
}
