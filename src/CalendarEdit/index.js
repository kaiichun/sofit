import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Select,
  Input,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  fetchCalendars,
  getAppointment,
  updateCalendar,
} from "../api/calendar2";
import { fetchClients } from "../api/client";
import { fetchBranch, fetchUsers } from "../api/auth";

export default function CalendarEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  useQuery({
    queryKey: ["calendars", id],
    queryFn: () => getAppointment(id),
    onSuccess: (data) => {
      setTitle(data.title);
      setStartTime(data.startTime);
      setStartDate(new Date(data.appointmentDate));
      setSelectedUser(data.staffId);
      setSelectedClient(data.clientId);
    },
  });

  const isAdminB = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });

  const { data: branches } = useQuery({
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

  const updateMutation = useMutation({
    mutationFn: updateCalendar,
    onSuccess: () => {
      notifications.show({
        title: "Client info updated successfully",
        color: "green",
      });
      navigate("/calendar");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Combine startDate and startTime into a single Date object
    const combinedDateTime = new Date(startDate);
    const [hours, minutes] = startTime.split(":");
    combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Convert the combined date and time to UTC
    const appointmentDateUTC = combinedDateTime.toISOString();

    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        title,
        clientId: selectedClient,
        staffId: selectedUser,
        user: currentUser._id,
        appointmentDate: appointmentDateUTC,
        startTime,
        branch: currentUserBranch,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const appTime = [
    { value: "07:00", label: "07:00 A.M." },
    { value: "07:30", label: "07:30 A.M." },
    { value: "08:00", label: "08:00 A.M." },
    { value: "08:30", label: "08:30 A.M." },
    { value: "09:00", label: "09:00 A.M." },
    { value: "09:30", label: "09:30 A.M." },
    { value: "10:00", label: "10:00 A.M." },
    { value: "10:30", label: "10:30 A.M." },
    { value: "11:00", label: "11:00 A.M." },
    { value: "11:30", label: "11:30 A.M." },
    { value: "12:00", label: "12:00 P.M." },
    { value: "12:30", label: "12:30 P.M." },
    { value: "13:00", label: "01:00 P.M." },
    { value: "13:30", label: "01:30 P.M." },
    { value: "14:00", label: "02:00 P.M." },
    { value: "14:30", label: "02:30 P.M." },
    { value: "15:00", label: "03:00 P.M." },
    { value: "15:30", label: "03:30 P.M." },
    { value: "16:00", label: "04:00 P.M." },
    { value: "16:30", label: "04:30 P.M." },
    { value: "17:00", label: "05:00 P.M." },
    { value: "17:30", label: "05:30 P.M." },
    { value: "18:00", label: "06:00 P.M." },
    { value: "18:30", label: "06:30 P.M." },
    { value: "19:00", label: "07:00 P.M." },
    { value: "19:30", label: "07:30 P.M." },
    { value: "20:00", label: "08:00 P.M." },
    { value: "20:30", label: "08:30 P.M." },
    { value: "21:00", label: "09:00 P.M." },
    { value: "21:30", label: "09:30 P.M." },
    { value: "22:00", label: "10:00 P.M." },
    { value: "22:30", label: "10:30 P.M." },
    { value: "23:00", label: "11:00 P.M." },
  ];

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Update Appointment
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
          onChange={setSelectedClient}
          placeholder="Select a client"
          label="Select a client"
          disabled
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
          onChange={setSelectedUser}
          label="Staff"
          placeholder="Select a Staff"
        />
        <Space h="50px" />
        <Group>
          <DatePickerInput
            value={startDate}
            onChange={(newStart) => setStartDate(newStart)}
            label="Start Date"
            placeholder="Start Date"
            maw={400}
            mx="end"
            w={115}
            minDate={new Date()} // Ensuring that only today or future dates can be picked
          />
          <Space w="xl" />
          <Select
            data={appTime}
            value={startTime}
            onChange={(value) => setStartTime(value)}
            label="Start time"
            placeholder="Select a time"
          />
          <Space w="xl" />
        </Group>
        <Space h="50px" />
        <Button color="green" fullWidth onClick={handleSubmit}>
          Update
        </Button>
      </Card>
      <Space h="20px" />
      <Space h="100px" />
    </Container>
  );
}
