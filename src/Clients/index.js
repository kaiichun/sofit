import {
  SimpleGrid,
  Card,
  Image,
  Text,
  TextInput,
  Button,
  Group,
  LoadingOverlay,
  Title,
  Space,
  Table,
  Modal,
  Select,
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
import { fetchBranch, fetchUsers } from "../api/auth";
import { API_URL } from "../api/data";
import noImageIcon from "../Logo/no_image.png";

export default function Clients() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [sort, setSort] = useState("");
  const [currentClients, setCurrentClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9999999);
  const [totalPages, setTotalPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPackagePage, setCurrentPackagePage] = useState(1);
  const packagesPerPage = 5;
  // const { isLoading, data: clients = [] } = useQuery({
  //   queryKey: ["clients"],
  //   queryFn: () => fetchClients(),
  // });
  const [selectedBranch, setSelectedBranch] = useState(null);

  const { data: branchs = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

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

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

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

    if (isAdminHQ && selectedBranch !== null) {
      newList = newList.filter((wage) => wage.branch === selectedBranch);
    } else if (isAdminBranch) {
      newList = newList.filter((wage) => wage.branch === currentUserBranch);
    }

    if (category !== "") {
      newList = newList.filter((p) => p.coachName === category);
    }
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
  }, [
    clients,
    category,
    sort,
    perPage,
    selectedBranch,
    isAdminBranch,
    currentUserBranch,
    branchs,
    ,
    searchTerm,
    currentPage,
  ]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (clients && clients.length > 0) {
      clients.forEach((client) => {
        if (!options.includes(client.coachName)) {
          options.push(client.coachName);
        }
      });
    }
    return options;
  }, [clients]);

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

  const handlePackagePageChange = (newPage) => {
    setCurrentPackagePage(newPage);
  };

  // Calculate total package pages
  const totalPackagePages = Math.ceil(packages.length / packagesPerPage);

  const categoryOptionsData = [
    { value: "", label: "All Coach" },
    ...categoryOptions.map((coachName) => ({
      value: coachName,
      label: coachName,
    })),
  ];

  return (
    <>
      <HeaderClient page="clients" />
      <LoadingOverlay visible={isLoading} />
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
          {packages.length === 0 ? (
            <Text color="red">Please contact your supervisor</Text>
          ) : (
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
                    <th>Category</th>
                    <th>Package Validity Period</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {packages
                    .slice(
                      (currentPackagePage - 1) * packagesPerPage,
                      currentPackagePage * packagesPerPage
                    )
                    .map((p) => {
                      return (
                        <tr key={p._id}>
                          <td style={{ borderTop: "none" }}>
                            {p.sofitpackage}
                          </td>
                          <td style={{ borderTop: "none" }}>{p.price}</td>
                          <td style={{ borderTop: "none" }}>{p.sessions}</td>
                          <td style={{ borderTop: "none" }}>{p.category}</td>
                          <td style={{ borderTop: "none" }}>{p.valiMonth}</td>
                          <td style={{ borderTop: "none" }}>
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
                      );
                    })}
                </tbody>
              </Table>
              {/* Package Pagination */}
              <Group position="center" mt="md">
                {Array.from({ length: totalPackagePages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={
                      currentPackagePage === i + 1 ? "filled" : "outline"
                    }
                    onClick={() => handlePackagePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Group>
              <Space h="40px" />
            </>
          )}
        </>
      )}
      <Group position="left">
        <Title order={3} align="center">
          Member
        </Title>
      </Group>
      <Space h="20px" />{" "}
      <Group position="apart" mb="lg">
        <Group>
          <Select
            value={sort}
            onChange={(value) => {
              setSort(value);
              setCurrentPage(1);
            }}
            data={[
              { value: "", label: "-" },
              { value: "name", label: "Sort by Name" },
              { value: "male", label: "Sort by Male" },
              { value: "female", label: "Sort by Female" },
            ]}
          />
          {isAdmin && (
            <Select
              value={category}
              onChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
              data={categoryOptionsData}
            />
          )}
          {isAdminHQ && (
            <Select
              placeholder="Select branch"
              value={selectedBranch}
              onChange={(value) => setSelectedBranch(value)}
              data={branchs.map((branch) => ({
                value: branch._id,
                label: branch.branch,
              }))}
              clearable
            />
          )}
          <Select
            value={perPage.toString()} // Convert perPage to string for compatibility
            onChange={(value) => {
              setPerPage(parseInt(value));
              setCurrentPage(1);
            }}
            data={[
              { value: "9999999", label: "All" },
              { value: "6", label: "6 Per Page" },
              { value: "10", label: "10 Per Page" },
              { value: "20", label: "20 Per Page" },
            ]}
          />
        </Group>
        <TextInput
          value={searchTerm}
          placeholder="Search"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Group>
      <Space h="20px" />{" "}
      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
      >
        {currentClients.length === 0 ? (
          <>
            <Space h={100} />
            <Group position="center">
              <Text color="red">No Member Available!</Text>
            </Group>

            <Space h={150} />
          </>
        ) : isAdmin ? (
          currentClients.map((c) => {
            return (
              <Card
                shadow="md"
                p="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor:
                    getColorForValidityPeriod(c.packageValidityPeriod) === "red"
                      ? "#ffd9d9"
                      : getColorForValidityPeriod(c.packageValidityPeriod) ===
                        "yellow"
                      ? "#fff7d9"
                      : "initial",
                }}
              >
                <Card.Section>
                  {c.clientImage ? (
                    <Image
                      src={API_URL + "/" + c.clientImage}
                      alt="Client Image"
                      height={300}
                    />
                  ) : (
                    <Image src={noImageIcon} alt="Client Image" height={300} />
                  )}
                </Card.Section>

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
                    fw={700}
                    style={{ marginLeft: "-10px" }}
                    color={getColorForValidityPeriod(c.packageValidityPeriod)}
                  >
                    {c.packageValidityPeriod
                      ? formatDate(new Date(c.packageValidityPeriod))
                      : "  - "}
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
            );
          })
        ) : (
          currentClients
            .filter((c) => c.coachId === currentUser._id)
            .map((c) => {
              return (
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
                        : getColorForValidityPeriod(c.packageValidityPeriod) ===
                          "yellow"
                        ? "#fff7d9"
                        : "initial",
                  }}
                >
                  <Card.Section>
                    {c.clientImage ? (
                      <Image
                        src={API_URL + "/" + c.clientImage}
                        alt="Client Image"
                        height={300}
                      />
                    ) : (
                      <Image
                        src={noImageIcon}
                        alt="Client Image"
                        height={300}
                      />
                    )}
                  </Card.Section>

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
                      fw={700}
                      style={{ marginLeft: "-10px" }}
                      color={getColorForValidityPeriod(c.packageValidityPeriod)}
                    >
                      {c.packageValidityPeriod
                        ? formatDate(new Date(c.packageValidityPeriod))
                        : "  - "}
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
              );
            })
        )}
      </SimpleGrid>
    </>
  );
}
