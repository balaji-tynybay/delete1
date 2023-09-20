import { Box, Button } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import React, { useState } from "react";
import profileImage from "../../assets/images/profileImage.jpg";

import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'

import AppContext from "../../context/appContext";
import Header from "../Header";

import "./styles.css";
import { resetPasswordSchema, userSchema } from "../../userSchema/userSchema";

const ProfileInfo = () => {
 const [changePassword, setChangePassword] = useState<boolean>(false)
 const [viewPassword, setViewPassword] = useState({
  password: false,
  enterPassword: false,
  reEnterPassword: false
 })
 const [image, setImage] = useState<any>()

const [edit, setEdit] = useState(false)

 const handleViewPassword = (id :number) => {
  if (id === 1) {
    setViewPassword((prev) => ({...prev, password: !prev.password}))
  }else if (id === 2){
    setViewPassword((prev) => ({...prev, enterPassword: !prev.enterPassword}))
  }else{
    setViewPassword((prev) => ({...prev, reEnterPassword: !prev.reEnterPassword}))
  }
 }

 const onChangeImage = (e:any) => {
  setImage({ image : e.target.files[0]})
 }

 const upadateImage = () => {
  console.log(image)
 }

 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(resetPasswordSchema),
  mode: "all",
});

const {
  register: register2,
  handleSubmit : userSchemaUpdate,
  formState: { errors: userErrors },
} = useForm({
  resolver: yupResolver(userSchema),
  mode: "all",
});




 const handleChangePassword = () => {
  setChangePassword(!changePassword)
 }

 const handleResetPassword = (data: any) => {
  console.log(data);
  if (!errors.newPassword){
    handleChangePassword()
  }
};

const handleSave = (data: any) => {
  console.log(data)
  if(!userErrors.name){
    handleEdit()
  }
}

 const handleEdit = () => {
  setEdit(!edit)
 }

  return (
    <AppContext.Consumer>
      {(contextValue) => (
        <div
          className={
            contextValue.isSidebarClose ? "content-box-expand" : "content-box"
          }
        >
          <Header
            headerPath="Profile"
            nextPath=""
            profileVisible={true}
            isNavigate={false}
          />
          <div className="profile-main-box">
            <Box
              sx={{
                width: "80%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <p className="settings-head-text">Personal info</p>
                  <p className="sub-setting-description">
                    Update your photo and personal details here.
                  </p>
                </Box>
                {edit ? <Box>
                  <Button
                    type="button"
                    className="setting-clear-all-btn profile-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={userSchemaUpdate(handleSave)}
                    type="button"
                    className="profile-btn setting-select-all-btn"
                  >
                    Save
                  </Button>
                </Box> : <Button onClick={handleEdit}
                    type="button"
                    className="setting-clear-all-btn profile-btn"
                  >
                    Edit
                  </Button>}
                
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "250px",
                  margin: "20px 0px 20px 0px",
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    height: "150px",
                    backgroundImage:
                      "linear-gradient( to right, #fcf1ed, #e0e3ea, #faf9f7)",
                    position: "relative",
                  }}
                >
                  <img className="profile-info-img" alt="" src={profileImage} />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0px 20px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                  }}
                >
                  <label className="profile-label">Name</label>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{
                    width: "49%"
                  }}>
                  <input
                    placeholder="First name"
                    type="text"
                    className="profile-input user-i"
                    {...register2("name")}
                  />
                  {userErrors.name?.message ? (
              <p className="error-msg">
                {userErrors.name.message?.toString()}
              </p>
            ) : (
              null
            )}
                  </Box>
                  
            <Box sx={{
                    width: "49%",
                  }} ><input
                    placeholder="Last name"
                    type="text"
                    className="profile-input user-i"
                    {...register2("lastName")}
                  />
                  {userErrors.lastName?.message ? (
              <p className="error-msg">
                {userErrors.lastName.message?.toString()}
              </p>
            ) : (
              null
            )}</Box>
                  
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0px 20px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                  }}
                >
                  <label className="profile-label">Email Address</label>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                  }}
                >
                  <input
                    disabled
                    placeholder="Enter Email address"
                    type="text"
                    className="profile-input email-input"
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0px 20px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                  }}
                >
                  <label className="profile-label">Your Photo</label>
                  <p className="sub-setting-description">
                    This will be displayed on your profile
                  </p>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    gap: '30px'
                  }}
                >
                  <img
                    alt=""
                    className="profile-inner-img"
                    src={profileImage}
                  />
                  <input onChange={onChangeImage} type="file" className="profile-image-input" />
                  <Box>
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        color: "#000000DE",
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        color: "#000000DE",
                      }}
                      onClick={upadateImage}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0px 20px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                  }}
                >
                  <label className="profile-label">Phone number</label>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    placeholder="Enter phone number"
                    type="text"
                    className="profile-input"
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0px 20px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                  }}
                >
                  <label className="profile-label">Password</label>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "space-between",
                    position: 'relative'

                  }}
                >
                  { changePassword ? 
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      height: '40px',
                      width: '180px',
                      position: 'absolute',
                      right: '10%',
                      bottom: "20%"
                    }}
                    type="button"
                    onClick={handleSubmit(handleResetPassword)}
             >
                    Save Password
                  </Button> : <Button
                    sx={{
                      textTransform: "capitalize",
                      height: '40px',
                      width: '180px',
                      position: 'absolute',
                      right: '10%'
                    }}
                    type="button"
                    onClick={handleResetPassword}
             >
                    Change Password
                  </Button>}
                  
                  { changePassword ? 
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '15px'
                  }}>
                  <div className="password-box user-p">
                    <input {...register("newPassword")} placeholder="New password"  type={viewPassword.enterPassword ? 'text' : 'password'} className="password-input" />
                    { viewPassword.enterPassword ? <AiOutlineEye onClick={() => handleViewPassword(2)} color="#898989" size={20} cursor="pointer" /> :  <AiOutlineEyeInvisible onClick={() => handleViewPassword(2)} color="#898989" size={20} cursor="pointer" />}
                  </div>
                  {errors.newPassword?.message ? (
              <p className="error-msg">
                {errors.newPassword.message?.toString()}
              </p>
            ) : (
              null
            )}
                  <div className="password-box user-p">
                    <input  {...register("enterPassword")} placeholder="Re-enter new password"   type={viewPassword.reEnterPassword ? 'text' : 'password'} className="password-input" />
                    { viewPassword.reEnterPassword ? <AiOutlineEye onClick={() => handleViewPassword(3)} color="#898989" size={20} cursor="pointer" /> :  <AiOutlineEyeInvisible onClick={() => handleViewPassword(3)} color="#898989" size={20} cursor="pointer" />}
                  </div>
                  {errors.enterPassword?.message ? (
              <p className="error-msg">
                {errors.enterPassword.message?.toString()}
              </p>
            ) : (
              null
            )}
                  </Box> :  <div className="password-box">
                    <input  type={viewPassword.password ? 'text' : 'password'} className="password-input" />
                    { viewPassword.password ? <AiOutlineEye onClick={() => handleViewPassword(1)} color="#898989" size={20} cursor="pointer" /> :  <AiOutlineEyeInvisible onClick={() => handleViewPassword(1)} color="#898989" size={20} cursor="pointer" />}
                  </div>}
                  
                </Box>
                
              </Box>              
            </Box>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
};

export default ProfileInfo;
