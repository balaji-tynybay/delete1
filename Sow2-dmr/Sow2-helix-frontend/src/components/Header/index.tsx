import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { IoMdNotificationsOutline, IoIosArrowDropright } from "react-icons/io";
import { FiSettings } from "react-icons/fi";

import settingsCompanyLogo from "../../assets/images/settingsCompanyLogo.svg";
import profileImage from "../../assets/images/profileImage.jpg";
import AppContext from "../../context/appContext";
import logoImg from "../../assets/images/companyLogo.svg";

import "./styles.css";
import { HeaderProps } from "../../types/header/type";
import { MuiTooltip } from "../Tooltip";
import { Button, Dialog, Divider, IconButton, Menu, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { IoCloseOutline, IoLogOutOutline } from "react-icons/io5";
import { Container } from "@mui/system";
import keycloakApi from "../../apiCall";
import axios from "axios";

const Header = (props: HeaderProps) => {
  // const [cityFilter, setCityFilter] = useState<string>();
  const [loginUserRole, setLoginUserRole] = useState("");
  const [logo, setLogo] = useState("");

  const [confirmCityFilter, setConfirmCityFilter] = useState<string>("MCLD");
  const [openCityFilter, setOpenCityFilter] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    headerPath,
    nextPath,
    profileVisible,
    isNavigate,
    isDropIconVisible = true,
    icon,
  } = props;
  const navigate = useNavigate();





  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClickCityFilter = () => {
    setOpenCityFilter(!openCityFilter);
  };

  const handleClickConfirm = () => {
    setOpenCityFilter(false);
  };

  return (
    <AppContext.Consumer>
      {(contextValue) => (
        <header className="header-box">
          <div className="header-drop-icon-box">
            <h1
              className="header-text"
              onClick={
                isNavigate ? () => navigate("/helpdesk/insights") : () => {}
              }
            >
              {headerPath} <span className="next-path-style"> {nextPath}</span>{" "}
            </h1>
            {icon}
          </div>
          {profileVisible ? (
            <div className="profile-box">
              <MuiTooltip title={<Typography>Notifications</Typography>}>
                <IconButton>
                <IoMdNotificationsOutline color="#000000" size={22} />
                </IconButton>
              </MuiTooltip>
              <MuiTooltip title={<Typography>Settings</Typography>}>
                <IconButton onClick={() => navigate("/settings")}>
                <FiSettings color="#000000" size={20} />
                </IconButton>
              </MuiTooltip>
              <MuiTooltip title={<Typography>Profile</Typography>}>
                <div onClick={handleClick} className="profile">
                  <IconButton size="small">
                  <Avatar
                    sx={{
                      height: "35px",
                      width: "35px",
                    }}
                    src={profileImage}
                    alt="profile"
                  />
                  </IconButton>
                  <p className="profile-name">Hi</p>
                </div>
              </MuiTooltip>
            </div>
          ) : (
            <img src={settingsCompanyLogo} alt="logo" />
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            
            PaperProps={{
              elevation: 0,
              sx: {
                // height: "250px",
                width: "150px",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <Link to={"/profile-info"}>
              <MenuItem
                sx={{
                  font: "normal normal normal 15px Suisse Intl",
                }}
                onClick={handleClose}
              >
                My account
              </MenuItem>
            </Link>
            <MenuItem
              sx={{
                font: "normal normal normal 15px Suisse Intl",
              }}
              onClick={handleClose}
            >
              Notifications
            </MenuItem>
            <Divider /> */}
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                font: "normal normal normal 15px Suisse Intl",
              }}
              
            >
              Logout <IoLogOutOutline size={20}/>
            </MenuItem>
          </Menu>
          <Dialog
            sx={{
              "& .MuiDialog-container": {
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              },
            }}
            open={openCityFilter}
          >
            <Container
              sx={{
                width: "35vw",
                height: "220px",
                "&.MuiContainer-root": {
                  padding: "0px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                },
              }}
            >
              <Container
                sx={{
                  "&.MuiContainer-root": {
                    padding: "0px 0px 0px 15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                }}
              >
                <Typography
                  sx={{
                    font: "normal normal normal 20px Suisse Intl",
                    fontWeight: "600",
                  }}
                >
                  Switch Company
                </Typography>

                {/* <IconButton onClick={handleClickCityFilter}> */}
                <IoCloseOutline />
                {/* </IconButton> */}
              </Container>
              <Container
                sx={{
                  "&.MuiContainer-root": {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "80px",
                  },
                }}
              >
                <Typography
                  sx={{
                    font: "normal normal normal 16px Suisse Intl",
                    fontweight: "600",
                    padding: "10px",
                  }}
                >
                  Are you sure, you want to switch to
                </Typography>
                <Typography
                  sx={{
                    font: "normal normal normal 25px Suisse Intl",
                    padding: "10px",
                    fontWeight: "600",
                  }}
                ></Typography>
              </Container>
              <Container
                sx={{
                  "&.MuiContainer-root": {
                    padding: "0px",
                    height: "70px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  },
                }}
              >
                <Divider />
                <Container
                  sx={{
                    "&.MuiContainer-root": {
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "0px 10px 0px 0px",
                    },
                  }}
                >
                  <Button
                    onClick={handleClickConfirm}
                    className="normal-btn setting-select-all-btn"
                  >
                    Confirm
                  </Button>
                </Container>
              </Container>
            </Container>
          </Dialog>
        </header>
      )}
    </AppContext.Consumer>
  );
};

export default Header;