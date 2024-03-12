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
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <Space h="160px" />
        <Card
          withBorder
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
            //   value={email}
            placeholder="User ID"
            required
            style={{ marginLeft: "40px", marginRight: "40px" }}
            //   onChange={(event) => setEmail(event.target.value)}
          />
          <Space h="15px" />
          <PasswordInput
            //   value={password}
            placeholder="Password"
            required
            style={{ marginLeft: "40px", marginRight: "40px" }}
            //   onChange={(event) => setPassword(event.target.value)}
          />
          <Space h="30px" />
          <Group
            position="center"
            style={{ marginLeft: "40px", marginRight: "40px" }}
          >
            <Button
              size="sm"
              radius="sm"
              component={Link}
              to="/home"
              //    onClick={handleSubmit}
            >
              Login
            </Button>
          </Group>
          <Space h="30px" />
        </Card>
        <Group
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
            to="https://support.google.com/accounts?hl=en&visit_id=638318542210869798-2506381406&rd=2&p=account_iph#topic=3382296"
            size="xs"
            radius="xs"
          >
            <FaFacebook /> <Space w={3} /> <Text>Facebook</Text>
          </Button>

          <Button
            variant="subtle"
            color="gray"
            component={Link}
            to="https://policies.google.com/terms?gl=MY&hl=en"
            size="xs"
            radius="xs"
          >
            <RiInstagramFill />
            <Space w={3} /> <Text>Instagram</Text>
          </Button>
        </Group>
      </Container>
      <Space h={200} />
      <Text ta="center" c="dimmed" fz="sm">
        Power by AWS
      </Text>
      <Text ta="center" c="dimmed" fz="xs">
        Delevoper by KC
      </Text>
    </>
  );
}

export default Login;
