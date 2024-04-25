import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useCookies } from "react-cookie";
import { useMemo } from "react";

import "./App.css";
import AppWrapper from "./AppWrapper";
import Home from "./Home";
import Login from "./Login";
import Clients from "./Clients";
import StaffAdd from "./StaffAdd";
import Staffs from "./Staffs";
import StaffEdit from "./StaffEdit";
import AppointmentCalendar from "./Calendar";
import DataAnalysis from "./DataAnalysis";
import ClientEdit from "./ClientEdit";
import ClientAdd from "./ClientAdd";
import ClientBMI from "./ClientBMI";
import CalendarTest from "./CalendarTest";
import PerformanceManagementSystem from "./PerformanceManagementSystem";
import Product from "./Product";
import ProductAdd from "./ProductAdd";
import ProductEdit from "./ProductEdit";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";
import PackageAdd from "./PackageAdd";
import PackageEdit from "./PackageEdit";
import CheckoutPackage from "./CheckoutPackage";
import OrdersPackage from "./OrdersPackage";
import WageAdd from "./WageAdd";
import Wages from "./Wage";

function App() {
  const [cookies] = useCookies(["currentUser"]);

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
          path="/package-add"
          element={
            <AppWrapper>
              <PackageAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/package-edit/:id"
          element={
            <AppWrapper>
              <PackageEdit />
            </AppWrapper>
          }
        />
        <Route
          path="/add-staff"
          element={
            <AppWrapper>
              <StaffAdd />
            </AppWrapper>
          }
        />
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/staffs"
            element={
              <AppWrapper>
                <Staffs />
              </AppWrapper>
            }
          />
        )}
        <Route
          path="/edit-info/:id"
          element={
            <AppWrapper>
              <StaffEdit />
            </AppWrapper>
          }
        />
        <Route
          path="/product"
          element={
            <AppWrapper>
              <Product />
            </AppWrapper>
          }
        />
        <Route
          path="/product_add"
          element={
            <AppWrapper>
              <ProductAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/product_edit/:id"
          element={
            <AppWrapper>
              <ProductEdit />
            </AppWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <AppWrapper>
              <Cart />
            </AppWrapper>
          }
        />
        <Route
          path="/checkout"
          element={
            <AppWrapper>
              <Checkout />
            </AppWrapper>
          }
        />{" "}
        <Route
          path="/checkout-package"
          element={
            <AppWrapper>
              <CheckoutPackage />
            </AppWrapper>
          }
        />
        <Route
          path="/orders"
          element={
            <AppWrapper>
              <Orders />
            </AppWrapper>
          }
        />
        <Route
          path="/client-orders-summary"
          element={
            <AppWrapper>
              <OrdersPackage />
            </AppWrapper>
          }
        />
        <Route
          path="/wage"
          element={
            <AppWrapper>
              <Wages />
            </AppWrapper>
          }
        />
        <Route
          path="/wage-add"
          element={
            <AppWrapper>
              <WageAdd />
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
        <Route
          path="/pms"
          element={
            <AppWrapper>
              <PerformanceManagementSystem />
            </AppWrapper>
          }
        />
        <Route
          path="/calendartest"
          element={
            <AppWrapper>
              <CalendarTest />
            </AppWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
