import { Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Details from "./components/Details";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./Login/LoginPage";
import UpdateProduct from "./pages/UpdateProduct";
import ManageProducts from "./pages/ManageProducts";
import AddProduct from "./pages/AddProduct";
import ManageAccountsPage from "./pages/ManageAccounts";
import ViewSalary from "./pages/ViewSalary";
import UpdateAccount from "./pages/UpdateAccount";
import ChangePassword from "./pages/ChangePassword";
import ViewProfile from "./pages/Profile";
import AddAccount from "./pages/AddAccount";
import SetNewPassword from "./pages/SetNewPassword";
import UpdateProfile from "./pages/UpdateProfile";
import { ToastContainer } from "react-toastify";
import { useMemo } from "react";
import { AuthContext } from "./context/AuthContext";
import { useState } from "react";
import ProductsPresentation from "./components/Home";
import CreateOrder from "./pages/CreateOrder";
import Capture from "./components/Webcam";
import {
  RegisterWorkShift,
} from "./pages/RegisterWorkShift";
import ViewShifts from "./pages/ViewShifts";
import WeekCalendar from "./components/ShiftCalendar";
import ViewWorkShift from "./pages/ViewWorkShift";
import GetSalary from "./components/GetSalary";
function App() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    // <React.StrictMode>
    <div
      className="App"
      style={{ paddingTop: "65px", minWidth: "100vw", minHeight: "100vh" }}
    >
      <AuthContext.Provider value={value}>
        <Navigation />
        <Routes>
          <Route path="/" element={<ProductsPresentation />} />
          <Route path="/manageproducts" element={<ManageProducts />} />
          <Route path="/checkattendance" element={<Capture />} />
          <Route path="/detail/:id" element={<Details />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/manageproducts/update/:id"
            element={<UpdateProduct />}
          />

          <Route path="/manageproducts/add" element={<AddProduct />} />
          <Route path="/manageaccounts" element={<ManageAccountsPage />} />
          <Route path="/manageaccounts/add" element={<AddAccount />} />
          <Route
            path="/manageaccounts/update/:id"
            element={<UpdateAccount />}
          />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/viewprofile" element={<ViewProfile />} />
          <Route
            path="/viewprofile/updateprofile"
            element={<UpdateProfile />}
          />
          <Route path="/calculate-salary" element={<GetSalary />} />
          <Route path="/view-salary" element={<ViewSalary />} />
          <Route path="/view-shifts" element={<WeekCalendar />} />
          <Route path="/view-workshift" element={<ViewWorkShift />} />
          <Route path="/workshift" element={<RegisterWorkShift />} />
          <Route path="/createorder" element={<CreateOrder />} />
          <Route
            path="/changepassword/setnewpassword"
            element={<SetNewPassword />}
          />
        </Routes>
      </AuthContext.Provider>
      <ToastContainer />
    </div>
    // </React.StrictMode>
  );
}
export default App;
