import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  NativeSelect,
  Select,
} from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import { addCalendar, fetchCalendars } from "../api/calendar2";
import { fetchClients } from "../api/client";
import { fetchBranch, fetchUsers } from "../api/auth";

export default function CalendarAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

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
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: branchs } = useQuery({
    queryKey: ["branch"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const filteredUsers = users.filter(
    (user) => user.branch === currentUserBranch
  );

  const filteredClients = clients.filter((c) => c.branch === currentUserBranch);

  const createMutation = useMutation({
    mutationFn: addCalendar,
    onSuccess: (data) => {
      navigate("/calendar");
      notifications.show({
        title: "Appoiment creater",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    if (!startDate || !startTime) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else {
      // Create a new Date object based on the selected startDate
      const startDateWithTime = new Date(startDate);

      // Extract hours and minutes from startTime and set it to the startDateWithTime
      const [hours, minutes] = startTime.split(":");
      startDateWithTime.setHours(parseInt(hours), parseInt(minutes));

      // Add 8 hours to the combined date and time
      startDateWithTime.setHours(startDateWithTime.getHours() + 8);

      // Convert to UTC
      const appointmentDateUTC = startDateWithTime.toISOString();

      createMutation.mutate({
        data: JSON.stringify({
          title: title,
          clientId: selectedClient,
          staffId: selectedUser,
          user: currentUser._id,
          appointmentDate: appointmentDateUTC,
          startTime: startTime,
          branch: currentUserBranch,
          //   endTime: endTime,
        }),
        token: currentUser ? currentUser.token : "",
      });
    }
  };

  const appTime = [
    { value: "07:00 A.M.", label: "07:00 A.M." },
    { value: "07:30 A.M.", label: "07:30 A.M." },
    { value: "08:00 A.M.", label: "08:00 A.M." },
    { value: "08:30 A.M.", label: "08:30 A.M." },
    { value: "09:00 A.M.", label: "09:00 A.M." },
    { value: "09:30 A.M.", label: "09:30 A.M." },
    { value: "10:00 A.M.", label: "10:00 A.M." },
    { value: "10:30 A.M.", label: "10:30 A.M." },
    { value: "11:00 A.M.", label: "11:00 A.M." },
    { value: "11:30 A.M.", label: "11:30 A.M." },
    { value: "12:00 P.M.", label: "12:00 P.M." },
    { value: "12:30 P.M.", label: "12:30 P.M." },
    { value: "01:00 P.M.", label: "01:00 P.M." },
    { value: "01:30 P.M.", label: "01:30 P.M." },
    { value: "02:00 P.M.", label: "02:00 P.M." },
    { value: "02:30 P.M.", label: "02:30 P.M." },
    { value: "03:00 P.M.", label: "03:00 P.M." },
    { value: "03:30 P.M.", label: "03:30 P.M." },
    { value: "04:00 P.M.", label: "04:00 P.M." },
    { value: "04:30 P.M.", label: "04:30 P.M." },
    { value: "05:00 P.M.", label: "05:00 P.M." },
    { value: "05:30 P.M.", label: "05:30 P.M." },
    { value: "06:00 P.M.", label: "06:00 P.M." },
    { value: "06:30 P.M.", label: "06:30 P.M." },
    { value: "07:00 P.M.", label: "07:00 P.M." },
    { value: "07:30 P.M.", label: "07:30 P.M." },
    { value: "08:00 P.M.", label: "08:00 P.M." },
    { value: "08:30 P.M.", label: "08:30 P.M." },
    { value: "09:00 P.M.", label: "09:00 P.M." },
    { value: "09:30 P.M.", label: "09:30 P.M." },
    { value: "10:00 P.M.", label: "10:00 P.M." },
    { value: "10:30 P.M.", label: "10:30 P.M." },
    { value: "11:00 P.M.", label: "11:00 P.M." },
  ];
  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Create New Appointment
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <Select
          label="Select a content"
          data={[
            {
              value: "Coaching",
              label: "Coaching",
            },
            {
              value: "Meeting",
              label: "Meeting",
            },
          ]}
          value={title}
          placeholder="Select a content"
          onChange={(value) => setTitle(value)}
        />
        <Space h="20px" />
        <Divider />
        <Select
          data={filteredClients.map((client) => ({
            value: client._id,
            label: `Name: ${client.clientName} | IC: ${client.clientIc} | Sessions(${client.sessions})`,
          }))}
          value={selectedClient}
          onChange={(value) => setSelectedClient(value)}
          placeholder="Select a client"
          label="Select a client"
        />
        <Space h="20px" />
        <Divider />
        <Select
          data={filteredUsers
            .filter((user) =>
              [
                "Junior Trainee",
                "Senior Trainee",
                "Advanced Senior Trainee",
              ].includes(user.department)
            )
            .map((user) => ({
              value: user._id,
              label: `${user.name} (${user.department})`,
            }))}
          value={selectedUser}
          onChange={setSelectedUser} // Corrected function call
          label="Staff"
          placeholder="Select a Staff"
        />

        {/* <Select
          label="Select Staff"
          data={filteredUsers.map((user) => ({
            value: user._id,
            label: `${user.name} (${user.ic})`,
          }))}
          value={selectedUser}
          onChange={(value) => setSelectedUser(value)}
          placeholder="Select a Staff"
        /> */}
        <Space h="50px" />
        <Group>
          <DatePickerInput
            value={startDate}
            onChange={(newStart) => {
              setStartDate(newStart);
              console.log(newStart);
            }}
            label="Start Date"
            placeholder="Start Date"
            minDate={new Date()} // Ensuring that only today or future dates can be picked
            maw={400}
            mx="end"
            w={115}
          />
          <Space w="xl" />
          <Select
            data={appTime}
            value={startTime} // <-- Problematic line
            onChange={(value) => setStartTime(value)}
            label="Start time"
            placeholder="Select a time"
          />
          <Space w="xl" />
        </Group>
        <Space h="50px" />
        <Button color="green" fullWidth onClick={handleSubmit}>
          Add New Calendar
        </Button>
      </Card>
      <Space h="20px" />

      <Space h="100px" />
    </Container>
  );
}
