import "../App.css";
import React, { useRef, useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useParams, Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { RiThumbUpLine, RiThumbDownLine } from "react-icons/ri";
import { PiShareFatLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Grid,
  Text,
  Title,
  ScrollArea,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import { like, unlike } from "../api/auth";
import {
  addVideoComment,
  deleteComment,
  deleteCommentAdmin,
  fetchComments,
} from "../api/comment";
import { deletePostAdmin, getPosts } from "../api/post";
import { API_URL } from "../api/data";

export default function Post() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [comment, setCommet] = useState("");
  const queryClient = useQueryClient();
  const videoRef = useRef(null);

  const { isLoading, data: posts = {} } = useQuery({
    queryKey: ["video"],
    queryFn: () => getPosts(id),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(id),
  });

  const createCommentMutation = useMutation({
    mutationFn: addVideoComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewComment = async (event) => {
    event.preventDefault();
    createCommentMutation.mutate({
      data: JSON.stringify({
        comments: comment,
        postId: id,
      }),
      token: currentUser ? currentUser.token : "",
    });
    setCommet("");
  };

  const deleteAdminPostMutation = useMutation({
    mutationFn: deletePostAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postcontent"],
      });
      notifications.show({
        title: currentUser.name + "is Deleted",
        color: "green",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });

  const deleteCommentAdminMutation = useMutation({
    mutationFn: deleteCommentAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      notifications.show({
        title: currentUser.name + "(Admin) is DELETE the comment Successfully",
        color: "yellow",
      });
    },
  });

  const updateLikeMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["video"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleLikeUpdate = async (event) => {
    event.preventDefault();
    updateLikeMutation.mutate({
      id: id,
      token: currentUser ? currentUser.token : "",
    });
  };

  const updateUnlikeMutation = useMutation({
    mutationFn: unlike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["video"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUnlikeUpdate = async (event) => {
    event.preventDefault();
    updateUnlikeMutation.mutate({
      id: id,
      token: currentUser ? currentUser.token : "",
    });
  };

  const isAdmin = useMemo(() => {
    console.log(cookies);
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  return (
    <Container fluid>
      <Grid>
        <Grid.Col>
          <div>
            <Group>
              {posts && posts.length > 0
                ? posts
                    .filter((post) => post && post.user && post.user._id === id)
                    .map((v) => (
                      <div key={v._id}>
                        <Group position="center">
                          <Card
                            radius="md"
                            withBorder
                            style={{ width: "700px" }}
                          >
                            <div
                              style={{ paddingTop: "8px", paddingLeft: "0px" }}
                            >
                              <Text size={18}>
                                <strong>{v.content}</strong>
                              </Text>
                            </div>
                            <Space h="15px" />
                            {v.postImage && (
                              <img
                                src={API_URL + "/" + v.postImage}
                                alt="Post Image"
                                style={{
                                  width: "100%",
                                  height: "500px",
                                  borderRadius: "1%",
                                }}
                              />
                            )}
                            <Space h="20px" />
                            <Text fz="xs" c="dimmed">
                              {v.createdAt}
                            </Text>
                            <Group position="right">
                              {isAdmin && (
                                <>
                                  {(cookies.currentUser._id === id &&
                                    cookies.currentUser.role === "Admin HQ") ||
                                    (cookies.currentUser._id === id &&
                                      cookies.currentUser.role ===
                                        "Admin Branch" && (
                                        <UnstyledButton
                                          component={Link}
                                          to={"/post_edit/" + v._id}
                                        >
                                          <BiEdit
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }}
                                          />
                                        </UnstyledButton>
                                      ))}
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    onClick={() => {
                                      deleteAdminPostMutation.mutate({
                                        id: v._id,
                                        token: currentUser?.token || "",
                                      });
                                    }}
                                  >
                                    <RiDeleteBin6Line
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        paddingTop: "4px",
                                      }}
                                    />
                                  </Link>
                                </>
                              )}
                              {/* {cookies.currentUser._id === id &&
                              cookies.currentUser.role === "user" && (
                                <>
                                  <UnstyledButton
                                    component={Link}
                                    to={"/post_edit/" + v._id}
                                  >
                                    <BiEdit
                                      style={{ width: "20px", height: "20px" }}
                                    />
                                  </UnstyledButton>
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    onClick={() => {
                                      deletePostMutation.mutate({
                                        id: v._id,
                                        token: currentUser
                                          ? currentUser.token
                                          : "",
                                      });
                                    }}
                                  >
                                    <RiDeleteBin6Line
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        paddingTop: "4px",
                                      }}
                                    />
                                  </Link>
                                </>
                              )} */}
                            </Group>
                          </Card>
                        </Group>
                        <Space h="30px" />
                      </div>
                    ))
                : null}
            </Group>
            <Space h="10px" />
            <Title size={24} mb="20px">
              {" "}
              {posts.content}
            </Title>

            {posts.postImage && (
              <Group position="center">
                <img
                  src={API_URL + "/" + posts.postImage}
                  alt="Post Image"
                  style={{
                    width: "50%",
                    height: "100%",
                    borderRadius: "1%",
                  }}
                />{" "}
              </Group>
            )}

            <Space h="25px" />
            <Divider />
            <Space h="25px" />
            <Group position="apart">
              <Group>
                {posts.user ? (
                  <>
                    <img
                      src={API_URL + "/" + posts.user.image}
                      alt="Login Picture"
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                      }}
                    />
                    <div style={{ paddingTop: "2px" }}>
                      <Text size={15} fw={500}>
                        {posts.user.name}
                      </Text>
                      <Space h="5px" />
                    </div>
                  </>
                ) : null}

                {cookies && cookies.currentUser ? (
                  <>
                    <Group position="right">
                      <Button
                        variant="transparent"
                        color="gray"
                        size="md"
                        onClick={handleLikeUpdate}
                      >
                        <RiThumbUpLine style={{ marginRight: "10px" }} />
                        {posts.user ? (
                          <>
                            {posts.likes.length >= 1000
                              ? posts.likes.length.toLocaleString()
                              : posts.likes.length}
                          </>
                        ) : (
                          0
                        )}
                      </Button>
                      <Button
                        variant="transparent"
                        color="gray"
                        size="md"
                        onClick={handleUnlikeUpdate}
                      >
                        <RiThumbDownLine style={{ marginRight: "10px" }} />{" "}
                        {posts.user ? (
                          <>
                            {posts.unlikes.length >= 1000
                              ? posts.unlikes.length.toLocaleString()
                              : posts.unlikes.length}
                          </>
                        ) : (
                          0
                        )}
                      </Button>
                    </Group>
                  </>
                ) : (
                  <>
                    <Group position="right">
                      <Button
                        variant="transparent"
                        color="gray"
                        size="md"
                        onClick={open}
                      >
                        <RiThumbUpLine />{" "}
                        {posts.user ? (
                          <>
                            {posts.likes.length >= 1000
                              ? posts.likes.length.toLocaleString()
                              : posts.likes.length}
                          </>
                        ) : (
                          0
                        )}
                      </Button>
                      <Button
                        variant="transparent"
                        color="gray"
                        size="md"
                        onClick={open}
                      >
                        <RiThumbDownLine /> Dislike
                      </Button>
                    </Group>
                  </>
                )}
              </Group>
            </Group>
            <Space h="20px" />

            <Group position="left">
              <Text fz="sm" fw={500} c="dimmed">
                {posts.createdAt
                  ? new Date(posts.createdAt).toISOString().split("T")[0]
                  : null}
              </Text>
              <Text fz="sm" fw={500} c="dimmed">
                {posts.createdAt
                  ? formatDistanceToNow(parseISO(posts.createdAt), {
                      addSuffix: true,
                    })
                  : null}
              </Text>
              <Text fz="sm" fw={500} c="dimmed">
                {posts.editedBy ? `Edited` : null}
              </Text>
            </Group>
          </div>

          <Space h={25} />
          <Group>
            {cookies && cookies.currentUser ? (
              <>
                <Group style={{ paddingLeft: "12px" }}>
                  <img
                    src={API_URL + "/" + cookies.currentUser.image}
                    alt="Login Picture"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                    }}
                  />
                  <div>
                    <TextInput
                      placeholder="Add a comment..."
                      variant="unstyled"
                      w={580}
                      radius="md"
                      value={comment}
                      onChange={(event) => setCommet(event.target.value)}
                    />
                  </div>
                  {comment.length > 0 && (
                    <div>
                      <Group position="right">
                        <Button
                          style={{ margin: "0px" }}
                          onClick={handleAddNewComment}
                        >
                          Comment
                        </Button>
                      </Group>
                    </div>
                  )}
                </Group>
              </>
            ) : (
              <>
                <Group style={{ paddingLeft: "12px" }}>
                  <VscAccount size="35px" p="0px" />
                  <TextInput
                    placeholder="Add a comment..."
                    variant="unstyled"
                    w={580}
                    radius="md"
                    value={comment}
                    onChange={(event) => setCommet(event.target.value)}
                  />
                  {comment.length > 0 && (
                    <div>
                      <Group position="right">
                        <Button style={{ margin: "0px" }} onClick={open}>
                          Comment
                        </Button>
                      </Group>
                    </div>
                  )}
                </Group>
              </>
            )}
          </Group>

          <ScrollArea.Autosize h={800}>
            {comments && comments.length > 0 ? (
              comments.map((com) => (
                <Grid.Col span={12}>
                  <Space h={15} />
                  <Divider w="100%" />
                  <Space h={15} />
                  <Group position="apart">
                    <Group>
                      <img
                        src={API_URL + "/" + com.user.image}
                        alt="Login Picture"
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ paddingTop: "8px", paddingLeft: "0px" }}>
                        <Text size={14}>
                          <strong style={{ paddingRight: "10px" }}>
                            {com.user.name}
                          </strong>
                          {/* {com.user.createdAt
                            ? new Date(com.user.createdAt)
                                .toISOString()
                                .split("T")[0]
                            : null} */}
                          {com.createdAt
                            ? formatDistanceToNow(parseISO(com.createdAt), {
                                addSuffix: true,
                              })
                            : null}
                        </Text>
                        <Text size={18}>{com.comments}</Text>
                      </div>
                    </Group>
                    {cookies &&
                    cookies.currentUser &&
                    cookies.currentUser._id === com.user._id ? (
                      <Group>
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                          onClick={() => {
                            deleteCommentMutation.mutate({
                              id: com._id,
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        >
                          <AiOutlineDelete
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </Link>
                      </Group>
                    ) : (
                      isAdmin && (
                        <Button
                          variant="outline"
                          color="red"
                          onClick={() => {
                            deleteCommentAdminMutation.mutate({
                              id: com._id,
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        >
                          Delete
                        </Button>
                      )
                    )}
                  </Group>
                </Grid.Col>
              ))
            ) : (
              <>
                <Space h={15} />
                <Divider w="100%" />
                <Space h={100} />
                <Group position="center">
                  <Text size={16}>No comments yet</Text>
                </Group>
              </>
            )}
          </ScrollArea.Autosize>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
