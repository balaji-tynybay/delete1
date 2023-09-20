import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import "./styles.css";

const AppLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
