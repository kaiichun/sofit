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
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchBranch, fetchUsers } from "../api/auth";
import { API_URL } from "../api/data";

function Staffs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStaff, setCurrentStaff] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: branchs = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  useEffect(() => {
    let newList = users ? [...users] : [];
    const total = Math.ceil(newList.length / perPage);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);

    if (searchTerm) {
      newList = newList.filter(
        (i) => i.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      );
    }
    setCurrentStaff(newList);
  }, [users, perPage, currentPage, searchTerm]);

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
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
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
            currentStaff.map((u) => {
              const branchName = branchs?.find(
                (branch) => branch._id === u.branch
              )?.branch;
              return (
                <Card shadow="sm" p="lg" radius="md" withBorder key={u.id}>
                  <Card.Section>
                    <Image
                      src={API_URL + "/" + u.image}
                      height={220}
                      alt="Norway"
                    />
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
                </Card>
              );
            })
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
    </>
  );
}

export default Staffs;
