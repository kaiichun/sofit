import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Container,
  Space,
  Card,
  Button,
  Group,
  PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getUser, passwordUser } from "../api/auth";
import { TiTickOutline } from "react-icons/ti";

export default function EditPwd() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const { id } = useParams();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);
  const { isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    onSuccess: (data) => {
      setEmail(data.email);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: passwordUser,
    onSuccess: () => {
      notifications.show({
        title: "Password Edited",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    let error = false;

    if (!email || !password) {
      error = "Please fill out all the required fields.";
    }

    if (error) {
      notifications.show({
        title: error,
        color: "red",
      });
    } else if (newPassword !== confirmPassword) {
      notifications.show({
        title: "Password and Confirm Password not match",
        color: "red",
      });
    } else {
      passwordMutation.mutate({
        data: JSON.stringify({
          email: email,
          password: password,
          newpassword: newPassword,
        }),
        token: currentUser ? currentUser.token : "",
      });
    }
  };

  return (
    <Container>
      <Space h="50px" />
      <>
        <Card
          withBorder
          shadow="lg"
          p="20px"
          mx="auto"
          sx={{
            maxWidth: "700px",
          }}
        >
          <PasswordInput
            value={password}
            placeholder="Password"
            label="Password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <Space h="20px" />
          <PasswordInput
            value={newPassword}
            placeholder="New Password"
            label="New Password"
            visible={visible}
            onVisibilityChange={toggle}
            required
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <Space h="20px" />
          <PasswordInput
            value={confirmPassword}
            placeholder="Confirm Password"
            label="Confirm Password"
            visible={visible}
            onVisibilityChange={toggle}
            required
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Space h="40px" />
          <Group position="center">
            <Button color="green" onClick={handleSubmit}>
              {" "}
              Submit <TiTickOutline size="20" />
            </Button>
          </Group>
        </Card>
      </>

      <Space h="20px" />
      <Group position="center">
        <Button
          component={Link}
          to="/home"
          variant="subtle"
          size="xs"
          color="gray"
        >
          Go back to Manage Users
        </Button>
      </Group>
    </Container>
  );
}
