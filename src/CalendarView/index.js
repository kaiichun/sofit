import React, { useEffect, useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";
import {
  fetchCalendars,
  deleteAppointment,
  updateAppointment,
} from "../api/calendar2";
import { fetchClients } from "../api/client";
import { fetchUsers, fetchBranch } from "../api/auth";
import {
  Container,
  Modal,
  Group,
  Button,
  Text,
  Space,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useCookies } from "react-cookie";
import { notifications } from "@mantine/notifications";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link, useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Initialize useNavigate
  const [events, setEvents] = useState([]);
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(
    currentUser.branch ? "all" : currentUser.branch
  );

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

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranch(),
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

  const deleteClientMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      notifications.show({ title: "Deleted", color: "green" });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      notifications.show({ title: "Updated", color: "green" });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  useEffect(() => {
    if (calendar && clients && users && branches) {
      let filteredCalendar = calendar;

      // Apply filtering based on user role and selected branch
      if (isAdminHQ) {
        if (selectedBranch !== "all") {
          filteredCalendar = calendar.filter(
            (event) => event.branch === selectedBranch
          );
        }
      } else {
        filteredCalendar = calendar.filter(
          (event) => event.branch === currentUser.branch
        );
      }

      const newEvents = filteredCalendar.map((event) => {
        const client = clients.find((client) => client._id === event.clientId);
        const user = users.find((user) => user._id === event.user);
        const staff = users.find((user) => user._id === event.staffId);
        const branch = branches.find((branch) => branch._id === event.branch);

        const startDateTime = moment(
          `${event.appointmentDate} ${event.startTime}`,
          "YYYY-MM-DD HH:mm"
        ).toDate();
        const endDateTime = moment(startDateTime).add(1, "hours").toDate();

        return {
          id: event._id,
          title: ` ${client ? client.clientName : "Unknown Client"} (${
            event.title
          }, ${staff ? staff.name : "Unknown Staff"} ,${
            branch ? branch.branch : "Unknown Branch"
          })`,
          start: startDateTime,
          end: endDateTime,
          clientName: client ? client.clientName : "Unknown Client",
          userName: user ? user.name : "Unknown User",
        };
      });
      setEvents(newEvents);
    }
  }, [
    calendar,
    clients,
    users,
    branches,
    selectedBranch,
    currentUser,
    isAdminHQ,
  ]);

  const handleEventDrop = ({ event, start, end }) => {
    const newStartDate = moment(start).format("YYYY-MM-DD");
    const newStartTime = moment(start).format("HH:mm");

    updateClientMutation.mutate({
      id: event.id,
      data: {
        appointmentDate: newStartDate,
        startTime: newStartTime,
      },
      token: currentUser ? currentUser.token : "",
    });
  };

  return (
    <Container size="100%">
      <LoadingOverlay visible={isLoading} />
      {isAdminHQ && (
        <>
          <Select
            label="Select Branch"
            placeholder="Select Branch"
            data={[
              { value: "all", label: "All Branches" },
              ...branches.map((branch) => ({
                value: branch._id,
                label: branch.branch,
              })),
            ]}
            value={selectedBranch}
            onChange={setSelectedBranch}
            allowDeselect
          />
          <Space h={20} />
        </>
      )}
      <DndProvider backend={HTML5Backend}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => {
            setClientIdToDelete(event.id);
            setShowClientDeleteModal(true);
          }}
          draggableAccessor={() => true}
          onEventDrop={handleEventDrop}
        />
      </DndProvider>
      <Modal
        opened={showClientDeleteModal}
        onClose={() => setShowClientDeleteModal(false)}
        title="Appointment Options"
        size="lg"
        centered
        overlayOpacity={0.75}
        overlayBlur={5}
      >
        <Text>What would you like to do with this appointment?</Text>
        <Space h="20px" />
        <Group position="right">
          <Button
            onClick={() => {
              setShowClientDeleteModal(false);
            }}
            component={Link}
            to={"/calendar-edit/" + clientIdToDelete}
          >
            Update
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to cancel this appointment?"
                )
              ) {
                deleteClientMutation.mutate({
                  id: clientIdToDelete,
                  token: currentUser ? currentUser.token : "",
                });
                setShowClientDeleteModal(false);
              }
            }}
          >
            Cancel
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
