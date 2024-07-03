import {
  Card,
  Text,
  UnstyledButton,
  Button,
  Grid,
  Title,
  Group,
  Table,
  TextInput,
  LoadingOverlay,
  Modal,
  Divider,
  Space,
  Container,
  Select,
} from "@mantine/core";
import React, { useState, useMemo, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { TbCalendarCancel } from "react-icons/tb";
import {
  addCalendar,
  deleteAppointment,
  fetchCalendars,
  updateCalendar,
} from "../api/calendar2";
import { fetchClients } from "../api/client";
import { fetchBranch, fetchUsers } from "../api/auth";
import { useParams } from "react-router-dom";
import HeaderCalendar from "../HeaderCalendar";

export default function CalendarTable() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStaff, setCurrentStaff] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(""); // Default to an empty string for "All Branches"
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const { isLoading, data: calendar = [] } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => fetchCalendars(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "Admin HQ" ||
        cookies.currentUser.role === "Admin Branch")
      ? true
      : false;
  }, [cookies]);

  const { data: branchs = [] } = useQuery({
    queryKey: ["fetchB"],
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

  const deleteClientMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
      notifications.show({
        title: "Deleted",
        color: "green",
      });
    },
  });

  useEffect(() => {
    let newList = calendar ? [...calendar] : [];

    // Function to get date part as a string
    const getDateString = (date) => {
      return date.toLocaleDateString("en-CA"); // Use ISO format YYYY-MM-DD
    };

    // Get today's date without time component
    const today = getDateString(new Date());

    // Filter events to include only those with startDate on or after today
    newList = newList.filter((event) => {
      const eventDate = getDateString(new Date(event.appointmentDate));
      return eventDate >= today;
    });

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      newList = newList.filter((i) => {
        const clientName = i.clientId?.clientName?.toLowerCase() || "";
        const userName = i.user?.name?.toLowerCase() || "";

        let startDate = "";
        if (i.appointmentDate) {
          const date = new Date(i.appointmentDate);
          if (!isNaN(date.getTime())) {
            startDate = getDateString(date);
          }
        }

        const startTime = i.startTime?.toLowerCase() || "";
        const title = i.title?.toLowerCase() || "";

        return (
          clientName.indexOf(lowerSearchTerm) >= 0 ||
          userName.indexOf(lowerSearchTerm) >= 0 ||
          startDate.indexOf(lowerSearchTerm) >= 0 ||
          startTime.indexOf(lowerSearchTerm) >= 0 ||
          title.indexOf(lowerSearchTerm) >= 0
        );
      });
    }

    // Apply branch filtering
    if (selectedBranch && selectedBranch !== "") {
      newList = newList.filter((event) => event.branch === selectedBranch);
    }

    // Sort events by startDate and startTime in ascending order
    newList.sort((a, b) => {
      const dateA = getDateString(new Date(a.appointmentDate));
      const dateB = getDateString(new Date(b.appointmentDate));

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // If start dates are equal, compare start times
      const timeA = a.startTime.split(":").map(Number);
      const timeB = b.startTime.split(":").map(Number);

      if (timeA[0] < timeB[0]) return -1; // Compare hours
      if (timeA[0] > timeB[0]) return 1;
      if (timeA[1] < timeB[1]) return -1; // Compare minutes
      if (timeA[1] > timeB[1]) return 1;
      return 0;
    });

    setCurrentStaff(newList);
  }, [
    calendar,
    searchTerm,
    selectedBranch,
    currentUserBranch,
    isAdminBranch,
    isAdminHQ,
  ]);

  return (
    <>
      <HeaderCalendar page="Table" />
      <Container size="100%">
        <Space h="35px" />
        <LoadingOverlay visible={isLoading} />
        <Group position="right" mb="lg">
          <TextInput
            w="200px"
            value={searchTerm}
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {isAdminHQ && (
            <Select
              placeholder="All Branches"
              value={selectedBranch}
              onChange={(value) => setSelectedBranch(value)}
              data={[
                { value: "", label: "All Branches" },
                ...branchs.map((branch) => ({
                  value: branch._id,
                  label: branch.branch,
                })),
              ]}
            />
          )}
        </Group>
        <Space h="35px" />
        {currentStaff.length > 0 ? (
          <Table
            horizontalSpacing="xl"
            verticalSpacing="sm"
            highlightOnHover
            withBorder
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Trainee</th>
                <th>Appointment By</th>
                <th>Content</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.map((o) => {
                const client = clients.find(
                  (client) => client._id === o.clientId
                );
                const user = users.find((user) => user._id === o.user);
                const staffId = users.find((user) => user._id === o.staffId);

                const startDate = new Date(o.appointmentDate);

                // Get day, month, and year
                const startDay = startDate
                  .getDate()
                  .toString()
                  .padStart(2, "0"); // Add leading zero if needed
                const startMonth = (startDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0"); // Add leading zero if needed
                const startYear = startDate.getFullYear();

                // Format as DD MM YYYY
                const startFormattedDate = `${startDay}-${startMonth}-${startYear}`;

                return (
                  <tr key={o._id}>
                    <td>{startFormattedDate}</td>
                    <td>{o.startTime}</td>

                    <td>{staffId ? staffId.name : "Trainee not found"}</td>
                    <td>{client ? client.clientName : "Client not found"}</td>
                    <td>{o.title}</td>
                    <td>
                      <Group position="">
                        <Button
                          variant="outline"
                          color="indigo"
                          radius="md"
                          component={Link}
                          to={"/calendar-edit/" + o._id}
                          //   disabled={
                          //     new Date(o.appointmentDate) <
                          //     new Date(
                          //       new Date().setDate(new Date().getDate() + 1)
                          //     )
                          //   }
                        >
                          Change
                        </Button>

                        <Button
                          onClick={() => {
                            setClientIdToDelete(o._id);
                            setShowClientDeleteModal(true);
                          }}
                          variant="outline"
                          color="red"
                          radius="md"
                        >
                          Delete
                        </Button>
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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
                  <th>Date</th>
                  <th>Time</th>
                  <th>Trainee</th>
                  <th>Appointment By</th>
                  <th>Content</th>
                  <th>Action</th>
                </tr>
              </thead>
            </Table>
            <Space h={150} />
            <Group position="center">
              <div>
                <Group position="center">
                  <TbCalendarCancel
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "15",
                    }}
                  />
                </Group>
                <Text align="center" size="lg" fw={700}>
                  No appointments yet
                </Text>
              </div>
            </Group>
          </>
        )}
        <Modal
          opened={showClientDeleteModal}
          onClose={() => setShowClientDeleteModal(false)}
          title="Delete PMS"
          size="lg"
          hideCloseButton
          centered
          overlayOpacity={0.75}
          overlayBlur={5}
        >
          <Divider />
          <Space h="10px" />
          <Group>
            {calendar.length > 0 ? (
              <>
                <Text>Are you sure you want to cancel this </Text>
                <Text c="red" fw={500}>
                  {calendar.find((c) => c._id === clientIdToDelete)
                    ?.clientName || " Appointment"}{" "}
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
        <Space h="20px" />
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
            to={"/calendar-add"}
          >
            +
          </Button>
        </div>
      </Group>
    </>
  );
}
