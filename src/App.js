import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppWrapper from "./AppWrapper";
import Home from "./Home";
import Login from "./Login";
import Clients from "./Clients";
import Trains from "./Trains";
import Calendar from "./Calendar";
import DataAnalysis from "./DataAnalysis";
import ClientInfoEdit from "./ClientInfoEdit";

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
              <Trains />
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
