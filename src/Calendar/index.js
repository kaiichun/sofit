import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [clientTitle, setClientTitle] = useState("");
  const [clientStart, setClientStart] = useState(new Date());
  const [clientEnd, setClientEnd] = useState(new Date());
  const [clientDescribe, setClientDescribe] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setShowForm(true);
  };

  const handleAddClientNewAppointment = (event) => {
    event.preventDefault();
    const newEvent = {
      id: new Date().getTime().toString(),
      title: clientTitle,
      start: clientStart,
      end: clientEnd,
      allDay: false,
    };
    setEvents([...events, newEvent]);
    setShowForm(false);
    // Now, you should proceed to submit this data to your backend using your API function
    // Example: addClientAppointment({ title: clientTitle, start: clientStart, end: clientEnd, description: clientDescribe });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="App">
      <h1>React Big Calendar POC</h1>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        defaultDate={new Date()}
        timeslots={2}
        style={{ height: "100vh" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={() => {}}
      />

      {showForm && (
        <form onSubmit={handleAddClientNewAppointment}>
          <div>
            <label htmlFor="clientTitle">Title:</label>
            <input
              type="text"
              id="clientTitle"
              value={clientTitle}
              onChange={(e) => setClientTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="clientStart">Start:</label>
            <input
              type="datetime-local"
              id="clientStart"
              value={format(clientStart, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setClientStart(new Date(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="clientEnd">End:</label>
            <input
              type="datetime-local"
              id="clientEnd"
              value={format(clientEnd, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setClientEnd(new Date(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="clientDescribe">Description:</label>
            <textarea
              id="clientDescribe"
              value={clientDescribe}
              onChange={(e) => setClientDescribe(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCloseForm}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentCalendar;
