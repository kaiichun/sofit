import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppWrapper from "./AppWrapper";
import Home from "./Home";
import Login from "./Login";
import Clients from "./Clients";
import StaffAdd from "./StaffAdd";
import StaffEdit from "./StaffEdit";
import AppointmentCalendar from "./Calendar";
import DataAnalysis from "./DataAnalysis";
import ClientEdit from "./ClientEdit";
import ClientAdd from "./ClientAdd";
import ClientBMI from "./ClientBMI";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <AppWrapper>
              <Home />
            </AppWrapper>
          }
        />
        <Route
          path="/clients"
          element={
            <AppWrapper>
              <Clients />
            </AppWrapper>
          }
        />
        <Route
          path="/add-client"
          element={
            <AppWrapper>
              <ClientAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/edit-client-info/:id"
          element={
            <AppWrapper>
              <ClientEdit />
            </AppWrapper>
          }
        />
        <Route
          path="/composition-client/:id"
          element={
            <AppWrapper>
              <ClientBMI />
            </AppWrapper>
          }
        />
        <Route
          path="/trains"
          element={
            <AppWrapper>
              <StaffAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/edit-info/:id"
          element={
            <AppWrapper>
              <StaffEdit />
            </AppWrapper>
          }
        />
        <Route
          path="/calendar"
          element={
            <AppWrapper>
              <AppointmentCalendar />
            </AppWrapper>
          }
        />
        <Route
          path="/data-analysis"
          element={
            <AppWrapper>
              <DataAnalysis />
            </AppWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
