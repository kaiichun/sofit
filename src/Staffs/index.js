import {
  SimpleGrid,
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Progress,
  RingProgress,
  Space,
  Container,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchUsers } from "../api/auth";

function Staffs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState([]);
  const [currentStaff, setCurrentStaff] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const isAdminB = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin Branch"
      ? true
      : false;
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin HQ"
      ? true
      : false;
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
    setCurrentStaff(newList);
  }, [users, perPage, currentPage]);

  return (
    <>
      {(isAdminB || isAdminHQ) && (
        <Container>
          <Group>
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
            {currentStaff ? (
              currentStaff.map((u) => {
                return (
                  <Card shadow="sm" p="lg" radius="md" withBorder key={u.id}>
                    <Card.Section>
                      <Image
                        src={"http://localhost:2019/" + u.image}
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
                    <Text size="sm" color="dimmed">
                      Role: {u.role}
                    </Text>
                    {isAdminHQ && (
                      <Text size="sm" color="dimmed">
                        Department: {u.branch}
                      </Text>
                    )}
                  </Card>
                );
              })
            ) : (
              <Text>User Not Found</Text>
            )}
          </SimpleGrid>
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
      )}
      <Group position="apart" mt={300}>
        <div></div>
        <div>
          <Button
            color="red"
            radius="xl"
            size="xl"
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
