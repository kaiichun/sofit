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
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { deleteClientAdmin, fetchClients } from "../api/client";
import HeaderClient from "../HeaderClient";
import { useState, useEffect, useMemo } from "react";
import { deletePackage, fetchPackage } from "../api/package";
import { notifications } from "@mantine/notifications";
import { fetchUsers } from "../api/auth";

export default function Clients() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [sort, setSort] = useState("");
  const [currentClients, setCurrentClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // const { isLoading, data: clients = [] } = useQuery({
  //   queryKey: ["clients"],
  //   queryFn: () => fetchClients(),
  // });

  const { isLoading, data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      if (isAdmin) {
        return fetchClients(); // Fetch all clients
      } else {
        return fetchClients(currentUser.coachId); // Fetch clients filtered by coachId for non-admin users
      }
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackage(),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });
      notifications.show({
        title: "Package Deleted",
        color: "green",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClientAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      notifications.show({
        title: "Member Deleted",
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

  useEffect(() => {
    let newList = clients ? [...clients] : [];

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.clientName.localeCompare(b.clientName);
        });
        break;
      case "male":
        newList = newList.filter((item) => item.clientGender === "Male");
        break;
      case "female":
        newList = newList.filter((item) => item.clientGender === "Female");
        break;
      default:
        break;
    }
    // do pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const total = Math.ceil(newList.length / perPage);
    // convert the total number into array
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);
    newList = newList.slice(start, end);

    if (searchTerm) {
      newList = newList.filter(
        (i) =>
          (i.clientName &&
            i.clientName.toLowerCase().indexOf(searchTerm.toLowerCase()) >=
              0) ||
          (i.coachName &&
            i.coachName.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
      );
    }

    setCurrentClients(newList);
  }, [clients, sort, perPage, searchTerm, currentPage]);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if necessary
    const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero if necessary
    return `${year}-${month}-${day}`;
  }

  function getColorForValidityPeriod(validityPeriod) {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14); // Add 14 days (2 weeks)

    const validityDate = new Date(validityPeriod);
    const formattedValidityDate = formatDate(validityDate); // Format date as YYYY-MM-DD

    if (validityDate < new Date()) {
      return "red"; // Already past
    } else if (validityDate < twoWeeksFromNow) {
      return "yellow"; // Within 2 weeks
    } else {
      return "black"; // Else, default color
    }
  }

  function getColorForSessionDuration(sessions) {
    if (sessions === 0) {
      return "red"; // 0 sessions
    } else if (sessions < 5) {
      return "orange"; // Less than 5 sessions
    } else if (sessions < 10) {
      return "yellow"; // Less than 10 sessions
    } else {
      return "black"; // 10 sessions or more
    }
  }

  return (
    <>
      {" "}
      <HeaderClient page="clients" />
      <Group position="apart">
        {isAdmin ? (
          <Title order={3} align="center">
            Package Management
          </Title>
        ) : (
          <Title order={3} align="center">
            Member
          </Title>
        )}

        {isAdmin && (
          <Button component={Link} to="/package-add" color="green">
            Create New Package
          </Button>
        )}
      </Group>
      <Space h="20px" />
      {isAdmin && (
        <>
          <Table
            horizontalSpacing="xl"
            verticalSpacing="sm"
            highlightOnHover
            withBorder
          >
            <thead>
              <tr>
                <th>Customer</th>
                <th>PRICE</th>
                <th>Sessions</th>
                <th>category</th>
                <th>Action</th>
              </tr>
            </thead>
            {packages
              ? packages.map((p) => {
                  return (
                    <tbody>
                      <tr key={p._id}>
                        <td
                          style={{
                            borderTop: "none",
                          }}
                        >
                          {p.sofitpackage}
                        </td>
                        <td
                          style={{
                            borderTop: "none",
                          }}
                        >
                          {p.price}
                        </td>
                        <td
                          style={{
                            borderTop: "none",
                          }}
                        >
                          {p.sessions}
                        </td>
                        <td
                          style={{
                            borderTop: "none",
                          }}
                        >
                          {p.category}
                        </td>
                        <td
                          style={{
                            borderTop: "none",
                          }}
                        >
                          <Button
                            variant="outline"
                            color="indigo"
                            radius="md"
                            size="xs"
                            compact
                            component={Link}
                            to={"/package-edit/" + p._id}
                            style={{ marginRight: 10 }}
                          >
                            EDIT
                          </Button>

                          <Button
                            onClick={() => {
                              setPackageIdToDelete(p._id);
                              setShowDeleteModal(true);
                            }}
                            variant="outline"
                            color="red"
                            radius="md"
                            size="xs"
                            compact
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              : null}
          </Table>
          <Modal
            opened={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Package"
            size="lg"
            hideCloseButton
            centered
            overlayOpacity={0.75}
            overlayBlur={5}
          >
            <Divider />
            <Space h="10px" />
            <Group>
              <Text>Are you sure you want to delete this</Text>
              <Text c="red" fw={500}>
                {
                  packages.find((pkg) => pkg._id === packageIdToDelete)
                    ?.sofitpackage
                }
              </Text>
              <Text>package?</Text>
            </Group>
            <Space h="20px" />
            <Group position="right">
              <Button
                color="red"
                onClick={() => {
                  deleteMutation.mutate({
                    id: packageIdToDelete,
                    token: currentUser ? currentUser.token : "",
                  });
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </Button>
              <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            </Group>
          </Modal>
          <Space h="30px" /> <Divider my="sm" variant="dashed" />
          <Space h="10px" />
          <Group position="left">
            <Title order={3} align="center">
              Member
            </Title>
          </Group>
          <Space h="20px" />{" "}
          <Group position="apart" mb="lg">
            <Group>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">No Sorting</option>
                <option value="name">Sort by Name</option>
                <option value="male">Sort by Male</option>
                <option value="female">Sort by Female</option>
              </select>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(parseInt(event.target.value));
                  // reset it back to page 1
                  setCurrentPage(1);
                }}
              >
                <option value="6">6 Per Page</option>
                <option value="10">10 Per Page</option>
                <option value={9999999}>All</option>
              </select>
            </Group>
            <TextInput
              value={searchTerm}
              placeholder="Search"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Group>
          <Space h="20px" />{" "}
        </>
      )}
      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
      >
        {currentClients ? (
          isAdmin ? (
            currentClients.map((c) => {
              return (
                <>
                  {" "}
                  <Card
                    shadow="md"
                    p="lg"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor:
                        getColorForValidityPeriod(c.packageValidityPeriod) ===
                        "red"
                          ? "#ffd9d9"
                          : getColorForValidityPeriod(
                              c.packageValidityPeriod
                            ) === "yellow"
                          ? "#fff7d9"
                          : "initial",
                    }}
                  >
                    <Group position="apart" mb="xs">
                      <Text fw={700}>{c.clientName}</Text>
                    </Group>

                    <Text size="sm">Gender: {c.clientGender}</Text>
                    <Text size="sm">Height: {c.clientHeight} (CM)</Text>
                    <Text size="sm">Weight: {c.clientWeight} (KG)</Text>
                    <Group>
                      <Text size="sm"> Sessions: </Text>
                      <Text
                        size="sm"
                        color={getColorForSessionDuration(c.sessions)}
                        style={{ marginLeft: "-10px" }}
                        fw={700}
                      >
                        {c.sessions}
                      </Text>
                    </Group>
                    <Group>
                      <Text size="sm">Package validity period:</Text>
                      <Text
                        size="sm"
                        style={{ marginLeft: "10px" }}
                        fw={700}
                        color={getColorForValidityPeriod(
                          c.packageValidityPeriod
                        )}
                      >
                        {c.packageValidityPeriod
                          ? formatDate(new Date(c.packageValidityPeriod))
                          : " - "}
                      </Text>
                    </Group>

                    <Text size="sm">Choch: {c.coachName}</Text>
                    <Group position="center" mt="md" mb="xs">
                      <Group>
                        <Button
                          variant="outline"
                          color="indigo"
                          radius="md"
                          size="xs"
                          compact
                          component={Link}
                          to={"/composition-client/" + c._id}
                        >
                          INFO
                        </Button>
                        <Button
                          variant="outline"
                          color="indigo"
                          radius="md"
                          size="xs"
                          compact
                          component={Link}
                          to={"/edit-client-info/" + c._id}
                        >
                          EDIT
                        </Button>
                        {isAdmin && (
                          <Button
                            onClick={() => {
                              setClientIdToDelete(c._id);
                              setShowClientDeleteModal(true);
                            }}
                            variant="outline"
                            color="red"
                            radius="md"
                            size="xs"
                            compact
                          >
                            DELETE
                          </Button>
                        )}
                      </Group>
                    </Group>
                  </Card>
                </>
              );
            })
          ) : (
            currentClients
              .filter((c) => c.coachId === currentUser._id)
              .map((c) => {
                return (
                  <>
                    {" "}
                    <Card
                      shadow="md"
                      p="lg"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor:
                          getColorForValidityPeriod(c.packageValidityPeriod) ===
                          "red"
                            ? "#ffd9d9"
                            : getColorForValidityPeriod(
                                c.packageValidityPeriod
                              ) === "yellow"
                            ? "#fff7d9"
                            : "initial",
                      }}
                    >
                      <Group position="apart" mb="xs">
                        <Text fw={700}>{c.clientName}</Text>
                      </Group>

                      <Text size="sm">Gender: {c.clientGender}</Text>
                      <Text size="sm">Height: {c.clientHeight} (CM)</Text>
                      <Text size="sm">Weight: {c.clientWeight} (KG)</Text>
                      <Group>
                        <Text size="sm"> Sessions: </Text>
                        <Text
                          size="sm"
                          color={getColorForSessionDuration(c.sessions)}
                          style={{ marginLeft: "-10px" }}
                          fw={700}
                        >
                          {c.sessions}
                        </Text>
                      </Group>
                      <Group>
                        <Text size="sm">Package validity period:</Text>
                        <Text
                          size="sm"
                          style={{ marginLeft: "-10px" }}
                          fw={700}
                          color={getColorForValidityPeriod(
                            c.packageValidityPeriod
                          )}
                        >
                          <Text
                            size="sm"
                            fw={700}
                            style={{ marginLeft: "-10px" }}
                            color={getColorForValidityPeriod(
                              c.packageValidityPeriod
                            )}
                          >
                            {c.packageValidityPeriod
                              ? formatDate(new Date(c.packageValidityPeriod))
                              : "-"}
                          </Text>
                        </Text>
                      </Group>

                      <Text size="sm">Choch: {c.coachName}</Text>
                      <Group position="center" mt="md" mb="xs">
                        <Group>
                          <Button
                            variant="outline"
                            color="indigo"
                            radius="md"
                            size="xs"
                            compact
                            component={Link}
                            to={"/composition-client/" + c._id}
                          >
                            INFO
                          </Button>
                          <Button
                            variant="outline"
                            color="indigo"
                            radius="md"
                            size="xs"
                            compact
                            component={Link}
                            to={"/edit-client-info/" + c._id}
                          >
                            EDIT
                          </Button>
                          {isAdmin && (
                            <Button
                              onClick={() => {
                                setClientIdToDelete(c._id);
                                setShowClientDeleteModal(true);
                              }}
                              variant="outline"
                              color="red"
                              radius="md"
                              size="xs"
                              compact
                            >
                              DELETE
                            </Button>
                          )}
                        </Group>
                      </Group>
                    </Card>
                  </>
                );
              })
          )
        ) : (
          <>
            <Text>No Member Found</Text>
          </>
        )}
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
            {clients.length > 0 ? (
              <>
                <Text>Are you sure you want to delete this member </Text>
                <Text c="red" fw={500}>
                  {clients.find((c) => c._id === clientIdToDelete)
                    ?.clientName || "Unknown Client"}
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
      <Space h="20px" />
      {totalPages.length > 1 && (
        <Group>
          <span
            style={{
              marginRight: "10px",
            }}
          >
            Page {currentPage} of {totalPages.length}
          </span>
          <Group position="center" spacing="xs">
            {totalPages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "filled" : "outline"}
                size="xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </Group>
        </Group>
      )}
    </>
  );
}
