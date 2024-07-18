import {
  SimpleGrid,
  Card,
  Image,
  Text,
  TextInput,
  Button,
  Group,
  Container,
  Space,
  Divider,
  Modal,
  Select,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { deleteUser, fetchBranch, fetchUsers } from "../api/auth";
import { API_URL } from "../api/data";
import { notifications } from "@mantine/notifications";

function Staffs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [currentStaff, setCurrentStaff] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const {
    data: branches = [],
    isLoading: branchesLoading,
    isError: branchesError,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show({
        title: "Staff Deleted",
        color: "red",
      });
    },
  });

  useEffect(() => {
    if (usersLoading || branchesLoading) return;

    let filteredUsers = [...users];

    if (isAdminBranch) {
      filteredUsers = filteredUsers.filter(
        (user) => user.branch === currentUserBranch
      );
    }

    if (selectedBranch) {
      filteredUsers = filteredUsers.filter(
        (user) => user.branch === selectedBranch
      );
    }

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branches.some(
            (branch) =>
              branch._id === user.branch &&
              branch.branch.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    const total = Math.ceil(filteredUsers.length / perPage);
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    setTotalPages(pages);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    setCurrentStaff(filteredUsers.slice(start, end));
  }, [
    users,
    perPage,
    currentPage,
    searchTerm,
    selectedBranch,
    isAdminBranch,
    currentUserBranch,
    branches,
    usersLoading,
    branchesLoading,
  ]);

  const handleDelete = () => {
    deleteMutation.mutate({
      id: productIdToDelete,
      token: currentUser ? currentUser.token : "",
    });
    setShowModal(false);
  };

  if (usersLoading || branchesLoading) {
    return <Text>Loading...</Text>;
  }

  if (usersError || branchesError) {
    return <Text>Error loading data</Text>;
  }

  const renderStaffCards = (staffList) => {
    return staffList.map((u) => {
      const branchName = branches.find(
        (branch) => branch._id === u.branch
      )?.branch;
      return (
        <Card shadow="sm" p="lg" radius="md" withBorder key={u.id}>
          <Card.Section>
            <Image src={API_URL + "/" + u.image} height={220} alt="Staff" />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text fw={700}>{u.name}</Text>

            <Button
              variant="outline"
              color="red"
              radius="md"
              size="xs"
              compact
              component={Link}
              to={`/edit-info/${u._id}`}
            >
              EDIT
            </Button>
          </Group>
          <Text size="sm" color="dimmed">
            Phone Number: {u.phonenumber}
          </Text>
          <Text size="sm" color="dimmed">
            Department: {u.department}
          </Text>
          {isAdminHQ && (
            <Text size="sm" color="dimmed">
              Role: {u.role}
            </Text>
          )}
          {isAdminHQ && branchName && (
            <Text size="sm" color="dimmed">
              Branch: {branchName}
            </Text>
          )}
          {isAdminHQ && (
            <Button
              color="red"
              size="xs"
              radius="50px"
              onClick={() => {
                setProductIdToDelete(u._id);
                setShowModal(true);
              }}
            >
              Delete
            </Button>
          )}
          <Modal
            centered
            title="Confirm Deletion"
            opened={showModal}
            onClose={() => setShowModal(false)}
            size="lg"
          >
            <Divider />
            <Space h="10px" />
            <Group>
              <Text>Are you sure you want to delete</Text>
              <Text c="red" fw={500}>
                {u.name}
              </Text>
              <Text>?</Text>
            </Group>

            <Space h="20px" />
            <Group position="right">
              <Button color="red" size="sm" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </Group>
          </Modal>
        </Card>
      );
    });
  };

  return (
    <Container>
      <Group position="apart" mb="lg">
        <Select
          value={perPage}
          onChange={(value) => {
            setPerPage(parseInt(value));
            setCurrentPage(1);
          }}
          data={[
            { value: 100, label: "100 Per Page" },
            { value: 50, label: "50 Per Page" },
            { value: 20, label: "20 Per Page" },
            { value: 9, label: "9 Per Page" },
            { value: 6, label: "6 Per Page" },
          ]}
        />
        <TextInput
          w="200px"
          value={searchTerm}
          placeholder="Search by name or branch"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        {isAdminHQ && (
          <Select
            placeholder="Select branch"
            value={selectedBranch}
            onChange={(value) => setSelectedBranch(value)}
            data={branches.map((branch) => ({
              value: branch._id,
              label: branch.branch,
            }))}
            clearable
          />
        )}
      </Group>

      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
      >
        {currentStaff.length > 0 ? (
          renderStaffCards(currentStaff)
        ) : (
          <Text>User Not Found</Text>
        )}
      </SimpleGrid>

      <Space h={20} />
      <div>
        <span style={{ marginRight: "10px" }}>
          Page {currentPage} of {totalPages.length}
        </span>
        {totalPages.map((page) => (
          <Button
            key={page}
            variant="default"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Group position="apart" mt={300}>
        <div></div>
        <div>
          <Button
            color="red"
            radius="xl"
            size="xl"
            style={{ position: "fixed", bottom: "15px", right: "15px" }}
            compact
            component={Link}
            to={"/add-staff"}
          >
            +
          </Button>
        </div>
      </Group>
    </Container>
  );
}

export default Staffs;
