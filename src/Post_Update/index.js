import React, { useMemo, useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { API_URL } from "../api/data";
import {
  Card,
  Button,
  Image,
  Group,
  Space,
  Text,
  Textarea,
  NativeSelect,
} from "@mantine/core";
import {
  addPostDetails,
  deletePost,
  deletePostAdmin,
  fetchPosts,
  uploadPostImage,
  updatePost,
  getPosts,
} from "../api/post";
import { fetchUsers } from "../api/auth";

export default function PostUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [postImage, setPostimage] = useState("");
  const [status, setStatus] = useState("Draft");
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["postcontent", id],
    queryFn: () => getPosts(id),
    onSuccess: (data) => {
      setContent(data.content);
      setPostimage(data.postImage);
      setStatus(data.status);
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["postcontent"],
    queryFn: fetchPosts,
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "Product is updated successfully",
        color: "green",
      });
      // redirect back to home page
      // 重定向回主页
      navigate("/product");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });
  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id,
      data: JSON.stringify({
        content,
        status,
        postImage,
        editedBy: currentUser._id,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadPostImageMutation = useMutation(uploadPostImage, {
    onSuccess: (data) => {
      setPostimage(data.postImage_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handlePostImageUpload = (files) => {
    uploadPostImageMutation.mutate(files[0]);
  };

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("postcontent");
      notifications.show({
        title: currentUser.name + " post is Deleted Successfully",
        color: "yellow",
      });
    },
  });

  const deleteAdminPostMutation = useMutation(deletePostAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries("postcontent");
      notifications.show({
        title: currentUser.name + " post is Deleted Successfully",
        color: "green",
      });
    },
  });

  const isAdminB = useMemo(() => {
    return cookies.currentUser && cookies.currentUser.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies.currentUser && cookies.currentUser.role === "Admin HQ";
  }, [cookies]);

  const isAdmin = useMemo(() => {
    return (
      cookies.currentUser &&
      (cookies.currentUser.role === "Admin HQ" ||
        cookies.currentUser.role === "Admin Branch")
    );
  }, [cookies]);

  return (
    <>
      <Space h="100px" />
      <Group position="center">
        <Card radius="md" withBorder style={{ width: "700px" }}>
          <>
            <div style={{ width: "700px" }}>
              <Group>
                <img
                  src={API_URL + "/" + cookies.currentUser.image}
                  alt="Login Picture"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                  }}
                />
                <Text size={18} style={{ paddingBottom: "8px" }}>
                  {cookies.currentUser.name}
                </Text>
              </Group>

              <Space h="10px" />
              <div>
                <Textarea
                  variant="unstyled"
                  placeholder="Post an update to your fans"
                  radius="xs"
                  w={550}
                  minRows={2}
                  maxRows={4}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </div>

              <Space h="40px" />
              {postImage && postImage !== "" ? (
                <Group>
                  <div>
                    <Image
                      src={API_URL + "/" + postImage}
                      width="100%"
                      height="180px"
                    />
                    <Group position="center">
                      <Button
                        color="red"
                        mt="-50px"
                        onClick={() => setPostimage("")}
                      >
                        Remove
                      </Button>
                    </Group>
                  </div>
                </Group>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  w={80}
                  h={60}
                  styles={{ margin: "0px" }}
                  onDrop={handlePostImageUpload}
                >
                  <Group position="center">
                    <Text align="center" style={{ padding: "0px" }}>
                      Image
                    </Text>
                  </Group>
                </Dropzone>
              )}
            </div>
            <Space h="10px" />
            <Group position="right">
              <NativeSelect
                data={["Draft", "Publish"]}
                value={status}
                placeholder=""
                onChange={(event) => setStatus(event.target.value)}
              />
              <Button style={{ margin: "0px" }} onClick={handleUpdateProduct}>
                Publish
              </Button>
            </Group>
          </>
        </Card>
      </Group>

      <Space h="30px" />
    </>
  );
}
