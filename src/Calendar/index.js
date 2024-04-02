import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Text, Select } from "@mantine/core";
import { addAppointment, fetchClientAppointment } from "../api/calendar";
import { fetchClients } from "../api/client";

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [clientTitle, setClientTitle] = useState("");
  const { id } = useParams();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [clientStart, setClientStart] = useState();
  const [clientEnd, setClientEnd] = useState();
  const [clientName, setClientName] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const { data: clientsApp = {} } = useQuery({
    queryKey: ["clientAppointment"],
    queryFn: () => fetchClientAppointment(id),
  });

  const createClientAppMutation = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientAppointment"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const [selectedClient, setSelectedClient] = useState("");
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    if (clientsApp && clientsApp[selectedClient]) {
      setMyEvents(
        clientsApp[selectedClient].map((appointment) => ({
          id: appointment._id,
          title: appointment.clientTitle,
          start: new Date(appointment.clientStart),
          end: new Date(appointment.clientEnd),
        }))
      );
    }
  }, [clientsApp, selectedClient]);

  const handleSelectSlot = useCallback(
    async ({ start, end }) => {
      const title = window.prompt("New Event name");
      if (title && selectedClient) {
        try {
          // Add the new event to local state
          const newEvent = {
            title: title,
            start: start,
            end: end,
          };
          setMyEvents((prevEvents) => [...prevEvents, newEvent]);
          // Perform mutation to add event to the database
          await createClientAppMutation.mutate({
            data: JSON.stringify({
              clientTitle: title,
              clientStart: start,
              clientEnd: end,
              clientId: selectedClient,
            }),
            token: currentUser ? currentUser.token : "",
          });
        } catch (error) {
          console.error("Error creating appointment:", error);
        }
      }
    },
    [createClientAppMutation, currentUser, selectedClient]
  );

  const handleSelectEvent = useCallback((event) => {
    window.alert(
      `Title: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`
    );
  }, []);

  const { formats } = useMemo(
    () => ({
      formats: {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, "hh:mm a", culture),
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, "dddd", culture),
        selectRangeFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, "hh:mm a", culture) +
          " - " +
          localizer.format(end, "hh:mm a", culture),
        monthHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, `MMMM [']YY`, culture),
        eventTimeRangeStartFormat: (date, culture, localizer) =>
          localizer.format(date, "hh:mm A", culture) + " >> ",
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, "hh:mm a", culture) +
          " - " +
          localizer.format(end, "hh:mm a", culture),
        dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, "ddd D", culture) +
          " - " +
          localizer.format(end, "ddd D", culture),
      },
    }),
    []
  );

  return (
    <div className="App">
      <Select
        data={clients.map((client) => ({
          value: client._id,
          label: client.clientName,
        }))}
        value={selectedClient}
        onChange={(value) => setSelectedClient(value)}
        placeholder="Select a client"
      />

      <h1>React Big Calendar POC</h1>

      <Calendar
        selectable
        localizer={localizer}
        events={myEvents}
        defaultDate={new Date()}
        defaultView="month"
        formats={formats}
        views={["month", "week", "day", "agenda"]}
        timeslots={2}
        style={{ height: "100vh" }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default AppointmentCalendar;
