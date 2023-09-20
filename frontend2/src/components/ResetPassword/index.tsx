import { Box, Button } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import companyLoginLogo from "../../assets/images/companyLoginLogo.png";
import mailIcon from "../../assets/images/mailIcon.svg";
import passwordIcon from "../../assets/images/passwordIcon.svg";

import { resetPasswordSchema } from "../../userSchema/userSchema";

import FormCarousel from "../Carousel";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "all",
  });

  const handleResetPassword = (data: any) => {
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
          <h1 className="login-text">Reset Password</h1>
          <p className="login-description">Create a new password.</p>
          <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
            <label htmlFor="mail" className="label">
              Enter New Password
            </label>
            <div className="input-box">
              <img src={mailIcon} alt="mailIcon" className="fieled-icon" />
              <input
                id="mail"
                type="password"
                className="input"
                {...register("newPassword")}
                placeholder="Enter New Password"
              />
            </div>
            {errors.newPassword?.message ? (
              <p className="error-msg">
                {errors.newPassword.message?.toString()}
              </p>
            ) : (
              <p className="error-msg trans">no error</p>
            )}
            <label htmlFor="password" className="label">
              Re-Enter Password
            </label>
            <div className="input-box">
              <img src={passwordIcon} alt="mailIcon" className="fieled-icon" />
              <input
                id="password"
                type="password"
                className="input"
                {...register("enterPassword")}
                placeholder="Re-Enter Password"
              />
            </div>
            {errors.enterPassword?.message ? (
              <p className="error-msg">
                {errors.enterPassword.message?.toString()}
              </p>
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
              Reset Password
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
