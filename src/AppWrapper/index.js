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
import { Link } from "react-router-dom";
import "../App.css";
import { FaUsers } from "react-icons/fa";
import { IoIosLogIn, IoIosFitness } from "react-icons/io";
import { IoCalendarSharp } from "react-icons/io5";
import { SiAlwaysdata } from "react-icons/si";

const AppWrapper = ({ children }) => {
  const theme = useMantineTheme();
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
                        // src={
                        //   "http://10.1.104.3:1205/" +
                        //   cookies.currentUser.image
                        // }
                        src={
                          "https://static.vecteezy.com/system/resources/previews/019/896/012/original/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
                        }
                        alt="Login Picture"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                        }}
                      />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {/* <Menu.Item>
                      <Group>
                        {/* <img
                          // src={
                          //   "http://10.1.104.3:1205/" +
                          //   cookies.currentUser.image
                          // }
                          src={
                            "http://localhost:1205/" + cookies.currentUser.image
                          }
                          alt="Login Picture"
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                          }}
                        /> */}
                    {/* <div style={{ paddingTop: "8px" }}>
                          <UnstyledButton
                            variant="transparent"
                            size="sm"
                            component={Link}
                            to={"/user_info/" + cookies.currentUser._id}
                          >
                            <Text size={17}>{cookies.currentUser.name}</Text>
                            <Text size={8}>@{cookies.currentUser._id}</Text>
                            <Space h="5px" />
                            <Link to={"/user_info/" + cookies.currentUser._id}>
                              Manage your account
                            </Link>
                          </UnstyledButton>
                        </div>
                      </Group>
                    </Menu.Item>
                    <Menu.Divider /> */}
                    <Menu.Item>
                      <UnstyledButton
                        variant="transparent"
                        size="sm"
                        component={Link}
                        to="/"
                        // onClick={() => {
                        //   // clear the currentUser cookie to logout
                        //   removeCookies("currentUser");
                        //   navigate("/login");
                        // }}
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
