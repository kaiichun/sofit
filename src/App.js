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
import PerformanceManagementSystemAdd from "./PerformanceManagementSystemAdd";
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
import PostAdd from "./Post_Add";
import PerformanceManagementSystem from "./PerformanceManagementSystem";
import PerformanceManagementSystemUpdate from "./PerformanceManagementSystemUpdate";
import BranchEdit from "./BranchEdit";
import Post from "./Post";
import PostAll from "./Post_All";
import CalendarAdd from "./CalendarAdd";
import CalendarAll from "./CalendarAll";
import CalendarEdit from "./CalendarEdit";
import Resigter from "./Resigter";
import EditPwd from "./ChangePassword";
import WageAll from "./WageAll";
import DataAnalysisPackages from "./DataAnalysisPackages";
import DataAnalysisWages from "./DataAnalysisWages";
import DataAnalysisOrder from "./DataAnalysisOrder";
import DataAnalysisClient from "./DataAnalysisClient";
import CalendarTable from "./CalendarTable";
import PostUpdate from "./Post_Update";

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
          path="/edit-post/:id"
          element={
            <AppWrapper>
              <PostUpdate />
            </AppWrapper>
          }
        />
        <Route
          path="/chg-password/:id"
          element={
            <AppWrapper>
              <EditPwd />
            </AppWrapper>
          }
        />
        {/* <Route path="/resigter" element={<Resigter />} /> */}
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/add-staff"
            element={
              <AppWrapper>
                <StaffAdd />
              </AppWrapper>
            }
          />
        )}
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
        {isAdminHQ && (
          <Route
            path="/edit-branch/:id"
            element={
              <AppWrapper>
                <BranchEdit />
              </AppWrapper>
            }
          />
        )}
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/sales-package"
            element={
              <AppWrapper>
                <DataAnalysisPackages />
              </AppWrapper>
            }
          />
        )}
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/data-wages"
            element={
              <AppWrapper>
                <DataAnalysisWages />
              </AppWrapper>
            }
          />
        )}
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/data-client"
            element={
              <AppWrapper>
                <DataAnalysisClient />
              </AppWrapper>
            }
          />
        )}
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/sales-product"
            element={
              <AppWrapper>
                <DataAnalysisOrder />
              </AppWrapper>
            }
          />
        )}
        <Route
          path="/all-post"
          element={
            <AppWrapper>
              <PostAll />
            </AppWrapper>
          }
        />
        <Route
          path="/post-add"
          element={
            <AppWrapper>
              <PostAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/post/:id"
          element={
            <AppWrapper>
              <Post />
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
          path="/wage-all"
          element={
            <AppWrapper>
              <WageAll />
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
              <CalendarAll />
            </AppWrapper>
          }
        />
        <Route
          path="/calendar-table"
          element={
            <AppWrapper>
              <CalendarTable />
            </AppWrapper>
          }
        />
        <Route
          path="/calendar-add"
          element={
            <AppWrapper>
              <CalendarAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/calendar-edit/:id"
          element={
            <AppWrapper>
              <CalendarEdit />
            </AppWrapper>
          }
        />
        {(isAdminB || isAdminHQ) && (
          <Route
            path="/data-analysis"
            element={
              <AppWrapper>
                <DataAnalysis />
              </AppWrapper>
            }
          />
        )}
        <Route
          path="/performance-management-system-add"
          element={
            <AppWrapper>
              <PerformanceManagementSystemAdd />
            </AppWrapper>
          }
        />
        <Route
          path="/performance-management-system-update/:id"
          element={
            <AppWrapper>
              <PerformanceManagementSystemUpdate />
            </AppWrapper>
          }
        />
        <Route
          path="/performance-management-system"
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
