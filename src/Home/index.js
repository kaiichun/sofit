import {
  SimpleGrid,
  Card,
  Image,
  Text,
  UnstyledButton,
  Grid,
  Title,
  Group,
  Progress,
  RingProgress,
  Space,
} from "@mantine/core";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post";

export default function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { isLoading, data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });
  return (
    <>
      <Grid>
        {posts
          ? posts
              .filter((v) => v.status === "Publish")
              .map((v) => {
                return (
                  <Grid.Col md={6} lg={4} sm={12} key={v._id}>
                    <UnstyledButton
                      component={Link}
                      to={"/watch/" + v._id}
                      variant="transparent"
                    >
                      <Card style={{ border: 0 }}>
                        <Group position="left">
                          <img
                            src={
                              v && v.user && v.user.image
                                ? "http://localhost:2019/" + v.user.image
                                : ""
                            }
                            alt="Profile Picture"
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                            }}
                          />
                          <div
                            style={{
                              paddingTop: "18px",
                            }}
                          >
                            <Title order={4}>{v.content}</Title>
                            {v && v.user && v.user.name ? (
                              <Text size="sm" color="dimmed">
                                {v.user.name}
                              </Text>
                            ) : null}
                            <Text size="sm" color="dimmed">
                              {v.createdAt
                                ? new Date(v.createdAt)
                                    .toISOString()
                                    .split("T")[0]
                                : null}
                            </Text>
                          </div>
                        </Group>
                      </Card>
                    </UnstyledButton>
                  </Grid.Col>
                );
              })
          : null}
      </Grid>
    </>
  );
}
