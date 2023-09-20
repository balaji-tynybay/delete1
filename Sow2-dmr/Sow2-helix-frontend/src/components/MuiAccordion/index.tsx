import { ReactNode } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";

type MuiAccordionProps = {
  title: string;
  children: ReactNode;
};

const MuiAccordion = (props: MuiAccordionProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<IoIosArrowDown color="#293644" size={20} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          height: "60px",
        }}
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="select-by-date-box">{props.children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default MuiAccordion;
