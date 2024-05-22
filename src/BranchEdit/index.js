import {
  SimpleGrid,
  Card,
  Image,
  Text,
  UnstyledButton,
  Grid,
  Title,
  Group,
  Button,
  Container,
  TextInput,
  Table,
  Progress,
  RingProgress,
  Modal,
  Space,
} from "@mantine/core";
import { openConfirmModal, closeAllModals } from "@mantine/modals";
import React, { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchPosts } from "../api/post";
import {
  addBranch,
  deleteBranchAdminHQ,
  fetchBranch,
  getBranch,
  updateBranch,
} from "../api/auth";

export default function BranchEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");
  const [hp, setHp] = useState("");
  const [address, setAddress] = useState("");
  const [ssm, setSsm] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });

  const { isLoading } = useQuery({
    queryKey: ["fetchB", id],
    queryFn: () => getBranch(id),
    onSuccess: (data) => {
      setBranch(data.branch);
      setHp(data.hp);
      setAddress(data.address);
      setSsm(data.ssm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "is updated successfully",
        color: "green",
      });

      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateBranch = async (event) => {
    // 阻止表单默认提交行为
    event.preventDefault();
    // 使用updateMutation mutation来更新商品信息
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        branch: branch,
        ssm: ssm,
        hp: hp,
        address: address,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  return (
    <>
      <Container>
        <Space h="100px" />
        <Card withBorder shadow="md" p="20px">
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
            <Button onClick={handleUpdateBranch}>Update</Button>
          </Group>
        </Card>
      </Container>
    </>
  );
}
