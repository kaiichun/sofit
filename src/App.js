import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppWrapper from "./AppWrapper";
import Home from "./Home";
import Login from "./Login";
import Clients from "./Clients";
import StaffAdd from "./StaffAdd";
import Calendar from "./Calendar";
import DataAnalysis from "./DataAnalysis";
import ClientInfoEdit from "./ClientInfoEdit";
import StaffEdit from "./StaffEdit";

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
          path="/client-info-edit"
          element={
            <AppWrapper>
              <ClientInfoEdit />
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
              <Calendar />
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
