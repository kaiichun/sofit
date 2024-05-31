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
  Select,
} from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import { addCalendar, fetchCalendars } from "../api/calendar2";
import { fetchClients } from "../api/client";
import { fetchUsers } from "../api/auth";

export default function CalendarAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
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
    if (!title || !startDate || !startTime || !endTime) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else {
      createMutation.mutate({
        data: JSON.stringify({
          title: title,
          clientId: selectedMember,
          user: selectedUser,
          appointmentDate: startDate,
          startTime: startTime,
          endTime: endTime,
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
        <TextInput
          value={title}
          placeholder="Enter the title here"
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Select
          data={clients.map((client) => ({
            value: client._id,
            label: `${client.clientName}  (${client.clientPhonenumber})`,
          }))}
          value={selectedMember}
          onChange={setSelectedMember} // Corrected function call
          label="Member"
          placeholder="Select a Member"
        />
        <Space h="20px" />
        <Divider />
        <Select
          data={users
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
        <Space h="50px" />
        <Group>
          <DatePickerInput
            value={startDate}
            onChange={(newStart) => {
              setStartDate(newStart);
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
          <Select
            data={appTime}
            value={endTime} // <-- Problematic line
            onChange={(value) => setEndTime(value)}
            label="End time"
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
