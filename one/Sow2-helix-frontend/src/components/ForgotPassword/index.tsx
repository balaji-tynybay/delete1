import { Box, Button } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import companyLoginLogo from "../../assets/images/companyLoginLogo.png";
import mailIcon from "../../assets/images/mailIcon.svg";

import { forgotPasswordSchema } from "../../userSchema/userSchema";

import FormCarousel from "../Carousel";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "all",
  });

  const handleLogin = (data: any) => {
    console.log(data);
  };

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
          <h1 className="login-text">Forgot Password?</h1>
          <p className="login-description">
            Enter your Email ID and we will send a reset link
          </p>
          <form onSubmit={handleSubmit(handleLogin)} noValidate>
            <label htmlFor="mail" className="label">
              Username or Email*
            </label>
            <div className="input-box">
              <img src={mailIcon} alt="mailIcon" className="fieled-icon" />
              <input
                id="mail"
                type="email"
                className="input"
                {...register("email")}
                placeholder="Enter Username or Email"
              />
            </div>
            {errors.email?.message ? (
              <p className="error-msg">{errors.email.message?.toString()}</p>
            ) : (
              <p className="error-msg trans">no error</p>
            )}

            <Button
              type="submit"
              sx={{
                width: "100%",
                height: "50px",
                background: "#00A4DC 0% 0% no-repeat padding-box",
                borderRadius: "4px",
                color: "#ffffff",
                textTransform: "capitalize",
                fontSize: "18px",
                margin: "8% 0px 0px 0px",
                "&:hover": {
                  backgroundColor: "#00A4DC",
                },
              }}
            >
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
