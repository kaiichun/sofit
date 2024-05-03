import { Checkbox } from "@mantine/core";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  SimpleGrid,
  Card,
  Image,
  Text,
  TextInput,
  Button,
  Group,
  UnstyledButton,
  Title,
  Space,
  Table,
  Modal,
  Divider,
} from "@mantine/core";
import { useState, useEffect, useMemo } from "react";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import sofitLogo from "../Logo/sofit-black.png";
import { addPMS, deleteUserPMSAdmin, fetchPMS } from "../api/pms";
import { fetchUsers } from "../api/auth";

const PerformanceManagementSystem = () => {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const currentDate = new Date();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [currentClients, setCurrentClients] = useState([]);

  const navigate = useNavigate();

  const { isLoading, data: pms3 = [] } = useQuery({
    queryKey: ["pms3"],
    queryFn: () => fetchPMS(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteUserPMSAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      notifications.show({
        title: "PMS Deleted",
        color: "green",
      });
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "Admin HQ" ||
        cookies.currentUser.role === "Admin Branch")
      ? true
      : false;
  }, [cookies]);

  return (
    <>
      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
      >
        {pms3
          ? isAdmin
            ? pms3.map((c) => {
                return (
                  // <UnstyledButton
                  //   component={Link}
                  //   to={"/composition-client/" + c._id}
                  //   variant="transparent"
                  // >
                  <>
                    {" "}
                    <Card shadow="md" p="lg" radius="md" withBorder>
                      {" "}
                      {/* <UnstyledButton
                        component={Link}
                        to={"/performance-management-system-update/" + c._id}
                        variant="transparent"
                      > */}
                      <Text size="md" fw={700} fs="italic">
                        YEAR {c.year}, MONTH {c.month}
                      </Text>
                      <Text size="sm" fw={700}>
                        Name: {c.name}
                      </Text>
                      <Text size="sm">Section A: {c.sectionA}</Text>
                      <Text size="sm">Section B: {c.sectionB}</Text>
                      <Text size="sm">Sofit 5 Core: {c.sBe5Core}</Text>
                      <Text size="sm">Bonus: {c.bonus}</Text>
                      <Text size="sm">Total: {c.total}</Text>
                      {/* </UnstyledButton> */}
                      <Space h={20} />
                      {isAdmin && (
                        <>
                          <Button
                            variant="outline"
                            color="indigo"
                            radius="md"
                            fullWidth
                            component={Link}
                            to={
                              "/performance-management-system-update/" + c._id
                            }
                            disabled={
                              new Date(c.month).getMonth() !==
                              new Date().getMonth()
                            }
                          >
                            EDIT
                          </Button>

                          <Space h={10} />
                          <Button
                            onClick={() => {
                              setClientIdToDelete(c._id);
                              setShowClientDeleteModal(true);
                            }}
                            fullWidth
                            variant="outline"
                            color="red"
                            radius="md"
                          >
                            DELETE
                          </Button>
                        </>
                      )}
                    </Card>
                  </>
                );
              })
            : pms3
                .filter((c) => c.user._id === currentUser.id)
                .map((c) => {
                  return (
                    <>
                      {" "}
                      <Card shadow="md" p="lg" radius="md" withBorder>
                        <Text size="md" fw={700}>
                          YEAR {c.year}, MONTH {c.month}
                        </Text>
                        <Text size="sm">Name: {c.name}</Text>

                        <Text size="sm">Section A: {c.sectionA}</Text>
                        <Text size="sm">Section B: {c.sectionB}</Text>
                        <Text size="sm">Sofit 5 Core: {c.sBe5Core}</Text>
                        <Text size="sm">Bonus: {c.bonus}</Text>
                        <Text size="sm">Total: {c.total}</Text>
                        {/* </UnstyledButton> */}
                        <Space h={20} />
                        <Button
                          variant="outline"
                          color="indigo"
                          radius="md"
                          fullWidth
                          compact
                          component={Link}
                          to={"/performance-management-system-update/" + c._id}
                        >
                          EDIT
                        </Button>
                      </Card>
                    </>
                  );
                })
          : null}
        <Modal
          opened={showClientDeleteModal}
          onClose={() => setShowClientDeleteModal(false)}
          title="Delete Member"
          size="lg"
          hideCloseButton
          centered
          overlayOpacity={0.75}
          overlayBlur={5}
        >
          <Divider />
          <Space h="10px" />
          <Group>
            {pms3.length > 0 ? (
              <>
                <Text>Are you sure you want to delete this member </Text>
                <Text c="red" fw={500}>
                  {pms3.find((c) => c._id === clientIdToDelete)?.clientName ||
                    "Unknown Client"}
                </Text>
                <Text>?</Text>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </Group>

          <Space h="20px" />
          <Group position="right">
            <Button
              color="red"
              onClick={() => {
                deleteClientMutation.mutate({
                  id: clientIdToDelete,
                  token: currentUser ? currentUser.token : "",
                });
                setShowClientDeleteModal(false);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setShowClientDeleteModal(false)}>
              Cancel
            </Button>
          </Group>
        </Modal>
      </SimpleGrid>
      <Group position="apart" mt={300}>
        <div></div>
        <div>
          <Button
            color="red"
            radius="xl"
            size="xl"
            style={{
              position: "fixed",
              bottom: "15px",
              right: "15px",
            }}
            compact
            component={Link}
            to={"/performance-management-system-add"}
          >
            +
          </Button>
        </div>
      </Group>
    </>
  );
};

export default PerformanceManagementSystem;
