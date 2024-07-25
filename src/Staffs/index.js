import {
  SimpleGrid,
  Card,
  Image,
  Text,
  TextInput,
  Button,
  Group,
  Container,
  Modal,
  PasswordInput,
  Space,
  Select,
} from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteUser,
  fetchBranch,
  fetchUsers,
  passwordUserAdmin,
} from "../api/auth";
import { API_URL } from "../api/data";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import noImageIcon from "../Logo/no_image.png";

function Staffs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [currentStaff, setCurrentStaff] = useState([]);
  const [openedOrderId, setOpenedOrderId] = useState(null);
  const [password, setPassword] = useState();
  const [deleteModalOpened, setDeleteModalOpened] = useState(false); // New state for delete modal
  const [staffToDelete, setStaffToDelete] = useState(null); // New state to store staff ID to be deleted
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [visible, { toggle }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: branchs = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const passwordMutation = useMutation({
    mutationFn: passwordUserAdmin,
    onSuccess: () => {
      notifications.show({
        title: "Password Updated",
        color: "green",
      });
      navigate("/staff");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const openModal = (orderId) => {
    setOpenedOrderId(orderId);
  };

  const closeModal = () => {
    setOpenedOrderId(null);
  };

  const handleUpdatePassword = (orderId) => {
    passwordMutation.mutate(
      {
        id: orderId,
        data: JSON.stringify({ password }),
        token: currentUser ? currentUser.token : "",
      },
      {
        onSuccess: () => {
          closeModal();
          setPassword(""); // Clear password after submission
        },
      }
    );
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      notifications.show({
        title: "Staff is Deleted",
        color: "red",
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

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  useEffect(() => {
    let filteredUsers = users ? [...users] : [];

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
          branchs.some(
            (branch) =>
              branch._id === user.branch &&
              branch.branch.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    const total = Math.ceil(filteredUsers.length / perPage);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
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
    branchs,
  ]);

  const renderStaffCards = (staffList) => {
    return staffList.map((u) => {
      const branchName = branchs?.find(
        (branch) => branch._id === u.branch
      )?.branch;
      return (
        <Card shadow="sm" p="lg" radius="md" withBorder key={u.id}>
          <Card.Section>
            {u.image ? (
              <Image
                src={API_URL + "/" + u.image}
                alt="Staff Image"
                height={300}
              />
            ) : (
              <Image src={noImageIcon} alt="Staff Image" height={300} />
            )}
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
          {isAdmin && (
            <Group position="apart" mt={10}>
              <div>
                {/* <Button
                  color="yellow"
                  size="xs"
                  radius="50px"
                  onClick={() => {
                    openModal(u._id);
                  }}
                >
                  Password
                </Button>
                <Modal
                  opened={openedOrderId === u._id}
                  onClose={closeModal}
                  title="Outstanding Update"
                >
                  <PasswordInput
                    value={password}
                    placeholder="New Password"
                    label="New Password"
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(event) => setPassword(event.target.value)}
                  />

                  <Button
                    onClick={() => {
                      // Handle submission
                      // After submission, clear the currentOutstanding value
                      handleUpdatePassword(u._id);
                      setPassword("");
                    }}
                  >
                    Submit
                  </Button>
                </Modal> */}
              </div>
              <div>
                <Button
                  color="red"
                  size="xs"
                  radius="50px"
                  onClick={() => {
                    setStaffToDelete(u._id);
                    setDeleteModalOpened(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Group>
          )}
        </Card>
      );
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({
      id: staffToDelete,
      token: currentUser ? currentUser.token : "",
    });
    setDeleteModalOpened(false);
  };

  return (
    <>
      <Container>
        <Group position="apart" mb="lg">
          <select
            value={perPage}
            onChange={(event) => {
              setPerPage(parseInt(event.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="100">100 Per Page</option>
            <option value="50">50 Per Page</option>
            <option value="20">20 Per Page</option>
            <option value="9">9 Per Page</option>
            <option value="6">6 Per Page</option>
          </select>
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
              data={branchs.map((branch) => ({
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
          <span
            style={{
              marginRight: "10px",
            }}
          >
            Page {currentPage} of {totalPages.length}
          </span>
          {totalPages.map((page) => {
            return (
              <Button
                key={page}
                variant="default"
                onClick={() => {
                  setCurrentPage(page);
                }}
              >
                {page}
              </Button>
            );
          })}
        </div>
      </Container>

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
            to={"/add-staff"}
          >
            +
          </Button>
        </div>
      </Group>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this staff member?</Text>
        <Group position="apart" mt="md">
          <Button color="red" onClick={handleConfirmDelete}>
            Delete
          </Button>
          <Button onClick={() => setDeleteModalOpened(false)}>Cancel</Button>
        </Group>
      </Modal>
    </>
  );
}

export default Staffs;
