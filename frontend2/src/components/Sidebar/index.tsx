import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import settingsCompanyLogo from "../../assets/images/Image 54.png";
import { IoMdArrowDropdown } from "react-icons/io";
import AppContext from "../../context/appContext";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";

import "./styles.css";
import {  sidebarNavItems } from "../../appData/appData";
import { Box } from "@mui/system";
import { MuiTooltip } from "../Tooltip";
import { Typography } from "@mui/material";
import keycloakApi from "../../apiCall";


const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [subChildOption, setSubChildOption] = useState(false);
  const [loginUserRole, setLoginUserRole] = useState("");
  const location = useLocation();

  const activeSubOptionPath = window.location.pathname;

  
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

 

// const loginUser = async () => {
//     const resGroup = await keycloakApi.get(`/users/${keycloackValue?.subject}/groups`)
//     setLoginUserRole(resGroup.data[0].name)  
//     console.log("pappa", resGroup)
// }
// useEffect(() => {
//   loginUser()
// })
// console.log("sksksks",loginUserRole)

  return (
    <AppContext.Consumer>
      {(contextValue) => (
        <Box
          sx={{
            width: `${contextValue.isSidebarClose ? "5%" : "14%"}`,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "16%",
              padding: "10px",
            },
            "&::-webkit-scrollbar": {
              width: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "10px",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              background: "#0b694c",
            },
            backgroundColor: "#ffffff",
            padding: "10px",
            transition: "all 0.3s",
            overflow: "auto",
          }}
        >
          <Box className="sidebar__logo">
            {!contextValue.isSidebarClose ? (
              <img
                src={settingsCompanyLogo}
                className="sidebar-company-logo"
                alt="logo"
              />
            ) : null}
            <MuiTooltip
              title={
                <Typography>
                  {contextValue.isSidebarClose ? "Open" : "Close"}
                </Typography>
              }
            >
              <IconButton onClick={contextValue.handleSidebarPositon}>
                <MdKeyboardArrowLeft
                  color="#000000"
                  size={25}
                  className={`${
                    contextValue.isSidebarClose
                      ? "sidebar-icon-close"
                      : "sidebar-icon-open"
                  }`}
                />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Box className="sidebar__menu">
            <Box
              className={
                activeIndex === -1
                  ? "sidebar__menu__indicator_none"
                  : "sidebar__menu__indicator"
              }
              style={{
                height: "38px",
                transform: `translateX(0%) translateY(${activeIndex * 44}px)`,
              }}
            >

            </Box>



{sidebarNavItems.map((item, index) => (
              <React.Fragment key={index}>
                <Link to={item.to}>

                <ListItemButton
                    sx={{
                      display: "flex",
                      justifyContent: contextValue.isSidebarClose
                        ? "center"
                        : "",
                    }}
                    className={`sidebar__menu__item ${
                      activeIndex === index ? "active" : ""
                    }`}
                  >
                    {contextValue.isSidebarClose ? (
                      <MuiTooltip
                        placement="right"
                        title={<Typography>{item.display}</Typography>}
                      >
                        <Box
                          className={`sidebar__menu__item__icon ${
                            activeIndex === index ? "active-sidebar-icon" : ""
                          }`}
                        >
                          {item.icon}
                        </Box>
                      </MuiTooltip>
                    ) : (
                      <Box
                        className={`sidebar__menu__item__icon ${
                          activeIndex === index ? "active-sidebar-icon" : ""
                        }`}
                      >
                        {item.icon} 
                      </Box>
                    )}
                    {!contextValue.isSidebarClose ? (
                      <Box
                        sx={{
                          transition: "all 0.3s",
                          visibility: contextValue.isSidebarClose
                            ? "hidden"
                            : "",
                          width: "100%",
                          height: "18px",
                          overflow: "scroll",
                        }}
                        className="sidebar__menu__item__text"
                      >
                        {item.display}
                      </Box>
                    ) : null}
                    {!contextValue.isSidebarClose ? (
                      <>
                        {item.subOptions ? (
                          <IoMdArrowDropdown
                            size={25}
                            className={
                              activeSubOptionPath.split("/")[1] === "helpdesk"
                                ? "sub-option-icon-rotate sub-option-icon"
                                : "sub-option-icon"
                            }
                          />
                        ) : null}
                      </>
                    ) : null}
                  </ListItemButton>

        

                  </Link>
               
               </React.Fragment>
             ))}



          </Box>
        </Box>
      )}
    </AppContext.Consumer> 
  );
};

export default Sidebar;
