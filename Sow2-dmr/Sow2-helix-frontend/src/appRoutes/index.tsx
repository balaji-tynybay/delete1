import React, { lazy, Suspense } from "react";
import { Circles } from "react-loader-spinner";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import AppLayout from "../components/Layout/AppLayout";

import Dashboard from "../components/Dashboard";


// import AppLayout from "../components/Layout/AppLayout";
// import Header from "../components/Header";
// import "./styles.css";
// import Home from "../components/Home";
// import ConsuptionDashboard from "../components/ConsuptionDashboard";
// import Assets from "../components/Assets";
// import Helpdesk from "../components/Helpdesk";
// import Tickets from "../components/Tickets";
// import PPMSchedule from "../components/PPMSchedule";
// import InspectionSchedule from "../components/InspectionSchedule";
// import WorkOrders from "../components/WorkOrders";
// import Analytics from "../components/Analytics";
// import Inventory from "../components/Inventory";
// import Survey from "../components/Survey";
// import Incident from "../components/Incident";
// import WorkPermit from "../components/WorkPermit";
// import Configuration from "../components/Configuration";
// import Settings from "../components/Settings";


const Login = lazy(() => import("../components/Login"));
const ForgotPassword = lazy(() => import("../components/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/ResetPassword"));
const ProfileInfo = lazy(() => import("../components/ProfileInfo"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="home-box">
          <Header
            headerPath="Home"
            nextPath=""
            profileVisible={true}
            isNavigate={false}
          />
          <div className="content-inner-box">
            <Circles
              height="80"
              width="80"
              color="#0B694C"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        </div>
      }
    >
      <Routes>
        {/* <Route path="/" element={<AppLayout />}> */}

          <Route path="/" element={<Dashboard />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
        {/* </Route> */}

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
