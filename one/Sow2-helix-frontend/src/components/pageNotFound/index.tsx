import { Button } from "@mui/material";
import { Box, display } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";

import pageNotFound2 from "../../assets/images/pageNotFound2.svg";
import dataNotFound from '../../assets/images/noData found.png'

import "./styles.css";

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: "flex",
        marginBottom:"30px"
      }}
    >
   
        <Box>
          {/* <p className="oops-text">Oops ...</p>
          <p className="page-not-text">Data Not Found</p> */}
          {/* <Button
            sx={{
              textTransform: "none",
              height: '50px',
              width: '150px',
              marginTop: '15px'
            }}
            className="setting-select-all-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button> */}
        </Box>
     
      <Box
       
      >
        <img alt="no image" src={dataNotFound} width={"350px"} />

        <p style={{paddingLeft:"100px", fontWeight:"bold",fontSize:"20px"}}>No data found</p>
      </Box>
    </Box>
  );
};

export default PageNotFound;
