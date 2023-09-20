import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    styled,
  } from "@mui/material";
  import React from "react";
  import { IoIosArrowDown } from "react-icons/io";
  
  const MuiAccordion = styled(Accordion)(({ theme }) => {
    return {
      boxShadow: "none",
      borderBottom: "1px solid #B7B7B7",
      margin: "0px !important",
      ".MuiAccordionDetails-root": {},
      ".MuiAccordionSummary-root": {},
    };
  });
  export default MuiAccordion;

  