import { Box, Button, Paper } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import companyLoginLogo from "../../assets/images/tynybaylogo.png";
import mailIcon from "../../assets/images/mailIcon.svg";
import passwordIcon from "../../assets/images/passwordIcon.svg";

import "./styles.css";
import { schema } from "../../userSchema/userSchema";

import { useNavigate } from "react-router-dom";
import FormCarousel from "../Carousel";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });


const handleLogin = async (data:any) => {
  try {
    const response = await fetch('http://localhost:8081/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      
      navigate('/');
      console.log("data", data)

    } else {
      // Authentication failed, handle errors (e.g., display error message)
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: "50%",
        }}
      >
        <FormCarousel />
      </Box>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "55%",
          }}
        >
          <img
            src={companyLoginLogo}
            alt="logo"
            className="company-login-logo"
          />
          <h1 className="login-text">Login</h1>
          <p className="login-description">Please sign in to your account.</p>
          <form onSubmit={handleSubmit(handleLogin)} >
            <label htmlFor="mail" className="label">
              Username 
            </label>
            <div className="input-box">
              <img src={mailIcon} alt="mailIcon" className="fieled-icon" />
              <input
                id="mail"
                type="text"
                className="input"
                {...register("email")}
                placeholder="Enter Username or Email"
              />
            </div>
            {/* {errors.email?.message ? (
              <p className="error-msg">{errors.email.message?.toString()}</p>
            ) : (
              <p className="error-msg trans">no error</p>
            )} */}
            <label htmlFor="password" className="label">
              Password*
            </label>
            <div className="input-box">
              <img src={passwordIcon} alt="mailIcon" className="fieled-icon" />
              <input
                id="password"
                type="password"
                className="input"
                {...register("password")}
                placeholder="Enter Password"
              />
            </div>
            {errors.password?.message ? (
              <p className="error-msg">{errors.password.message?.toString()}</p>
            ) : (
              <p className="error-msg trans">no error</p>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                margin: "8px 0px 8px 0px",
              }}
            >
              <p onClick={() => navigate("/forgot-password")} className="label">
                Forgot password?
              </p>
              {/* <p onClick={() => navigate("/welcome")} className="switch-text">
                Switch Account
              </p> */}
            </Box>
            <Button
              type="submit"
              sx={{
                width: "100%",
                height: "50px",
                background: "#0b694c 0% 0% no-repeat padding-box",
                borderRadius: "4px",
                color: "#ffffff",
                textTransform: "capitalize",
                fontSize: "18px",
                margin: "8% 0px 0px 0px",
                "&:hover": {
                  backgroundColor: "#0b694c",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Box> 
      </Box>
    </Box>
  );
};

export default Login;
