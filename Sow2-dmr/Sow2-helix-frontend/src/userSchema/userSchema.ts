import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid Email ID")
    .required("Please enter Email ID"),
  password: yup
    .string()
    .required("Please enter password")
    .max(20, "Maximum characters limit is 20"),
});

export const welcomeSchema = yup.object().shape({
  code: yup.string().required("Account Code is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid Email ID")
    .required("Please enter Email ID"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(1, "Please enter atleast one character")
    .max(20, "Maximum characters limit is 20")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.{1,20})/,
      "Please include atleast one uppercase and one number"
    )
    .required(),
  enterPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password mismatch, please re-enter")
    .required("This is a required field"),
});


export const userSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter firstname"),
  lastName: yup
    .string()
    .required("Please enter lastname")
});

