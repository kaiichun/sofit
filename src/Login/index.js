import {
  Avatar,
  Container,
  Card,
  Text,
  Button,
  Group,
  Space,
  PasswordInput,
  TextInput,
  Title,
  Footer,
} from "@mantine/core";
import logo from "../Logo/sofit-icon.jpg";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { loginUser } from "../api/auth";

function Login() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      // store user data into cookies
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 30,
      });
      // redirect to home
      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    // make sure email or username & password are not empty.
    if ((!email && !username) || !password) {
      notifications.show({
        title: "Please fill in both email/username and password.",
        color: "red",
      });
    } else {
      // Check if email is provided, if not, use username
      const loginData = email ? { email, password } : { username, password };
      loginMutation.mutate(JSON.stringify(loginData));
    }
  };

  return (
    <>
      <Container>
        <Space h="160px" />
        <Card
          withBorder
          shadow="sm"
          mx="auto"
          sx={{
            maxWidth: "500px",
          }}
        >
          <Space h="30px" />
          <Group position="center">
            <img src={logo} style={{ width: "60px", height: "60px" }} />
          </Group>
          <Space h="10px" />
          <Title order={4} align="center">
            Sign in
          </Title>
          <Text align="center">
            to access <strong>SOFIT</strong>
          </Text>
          <Space h="30px" />
          <TextInput
            value={email || username} // Use email if available, otherwise use username
            placeholder="Email or Username"
            required
            style={{ marginLeft: "40px", marginRight: "40px" }}
            onChange={(event) => {
              const { value } = event.target;
              // Check if input looks like an email
              if (value.includes("@")) {
                setEmail(value);
                setUsername("");
              } else {
                setUsername(value);
                setEmail("");
              }
            }}
          />
          <Space h="15px" />
          <PasswordInput
            value={password}
            placeholder="Password"
            required
            style={{ marginLeft: "40px", marginRight: "40px" }}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Space h="30px" />
          <Group
            position="center"
            style={{ marginLeft: "40px", marginRight: "40px" }}
          >
            <Button size="sm" radius="sm" onClick={handleSubmit}>
              Login
            </Button>
          </Group>
          <Space h="30px" />
        </Card>
        {/* <Group
          position="right"
          mx="auto"
          sx={{
            maxWidth: "500px",
            paddingRight: "5px",
            paddingTop: "12px",
            textDecorationLine: "none",
          }}
        >
          <Button
            variant="subtle"
            color="gray"
            component={Link}
            to="/resigter"
            size="xs"
            radius="xs"
          >
            <Space w={3} /> <Text>Resigter</Text> <Space w={3} />
          </Button>
        </Group> */}
      </Container>
      <Space h={200} />
      {/* <Text ta="center" c="dimmed" fz="sm">
        Power by AWS
      </Text>
      <Text ta="center" c="dimmed" fz="xs">
        Delevoper by KC
      </Text> */}
    </>
  );
}

export default Login;
