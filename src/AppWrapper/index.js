import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Menu,
  Button,
  UnstyledButton,
  Group,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Space,
  Divider,
  Image,
} from "@mantine/core";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { FaUsers } from "react-icons/fa";
import { IoIosLogIn, IoIosFitness } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { SiAlwaysdata } from "react-icons/si";

const AppWrapper = ({ children }) => {
  const theme = useMantineTheme();
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const { id } = useParams();
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        opened ? null : (
          <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 320 }}>
            <UnstyledButton
              component={Link}
              to={"/clients"}
              variant="transparent"
            >
              <div className="item">
                <Group>
                  <FaUsers width="80px" height="80px" />
                  Clients
                </Group>
              </div>
            </UnstyledButton>
            {/* <Divider mt="4px" mb="4px" /> */}
            <UnstyledButton
              component={Link}
              to={"/trains"}
              variant="transparent"
            >
              <div className="item">
                <Group>
                  <IoIosFitness width="80px" height="80px" />
                  Trains
                </Group>
              </div>
            </UnstyledButton>
            {/* <Divider mt="4px" mb="4px" /> */}
            <UnstyledButton
              component={Link}
              to={"/calendar"}
              variant="transparent"
            >
              <div className="item">
                <Group>
                  <IoCalendarSharp width="80px" height="80px" />
                  Calendar
                </Group>
              </div>
            </UnstyledButton>
            {/* <Divider mt="4px" mb="4px" /> */}
            <UnstyledButton
              component={Link}
              to={"/data-analysis"}
              variant="transparent"
            >
              <div className="item">
                <Group>
                  <SiAlwaysdata width="80px" height="80px" />
                  Data Analysis
                </Group>
              </div>
            </UnstyledButton>
          </Navbar>
        )
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
              />
            </MediaQuery>
            <Space w={20} />
            <Group style={{ width: "100vw" }} position="apart">
              <UnstyledButton
                variant="transparent"
                size="sm"
                component={Link}
                to="/home"
              >
                <Text>SOFIT FITNESS</Text>
              </UnstyledButton>
              <div>
                <Menu shadow="md" width={260}>
                  <Menu.Target>
                    <Button
                      variant="transparent"
                      style={{
                        margin: "8px",
                        padding: "0px",
                      }}
                    >
                      <img
                        src={
                          "http://localhost:2019/" + cookies.currentUser.image
                        }
                        alt="Login Picture"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                        }}
                      />
                      <Text size={15} m={14}>
                        {cookies.currentUser.name}
                      </Text>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>
                      <UnstyledButton
                        variant="transparent"
                        size="sm"
                        component={Link}
                        to={"/edit-info/" + cookies.currentUser._id}
                      >
                        <Group>
                          <FaUserEdit
                            style={{
                              width: "20px",
                              height: "20px",
                              margin: "0",
                            }}
                          />
                          <span
                            style={{
                              padding: "0",
                              margin: "0",
                            }}
                          >
                            Edit Profile
                          </span>
                        </Group>
                      </UnstyledButton>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item>
                      <UnstyledButton
                        variant="transparent"
                        size="sm"
                        component={Link}
                        to="/"
                        onClick={() => {
                          // clear the currentUser cookie to logout
                          removeCookies("currentUser");
                          navigate("/");
                        }}
                      >
                        <Group>
                          <IoIosLogIn
                            style={{
                              width: "20px",
                              height: "20px",
                              margin: "0",
                            }}
                          />
                          <span
                            style={{
                              padding: "0",
                              margin: "0",
                            }}
                          >
                            Sign out
                          </span>
                        </Group>
                      </UnstyledButton>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default AppWrapper;
