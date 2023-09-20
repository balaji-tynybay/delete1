import React, { useState } from "react";
import { PieDonutChartProps } from "../types/chartTypes";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Chart from "react-apexcharts";
import "./styles.css";
import { Box, Dialog, Divider } from "@mui/material";
import { CgExpand } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";

const PieChart = (props: PieDonutChartProps) => {
  const [expand, setExpand] = useState(false);
  const { chartData, labels, headingText, height = 0 } = props;

  const handleExpand = () => {
    setExpand(!expand);
  };

  const chart = (boxClass: string) => {
    return (
      <div className={boxClass}>
        <Box
          sx={{
            padding: expand
              ? "15px"
              : `${height - 4}px ${height - 4}px ${height - 4}px ${height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h1
            style={{ fontSize: expand ? "18px" : `${height + 3}px` }}
            className="pie-chart-text"
          >
            {headingText}
          </h1>

          <div style={{marginLeft:"85%"}} >

            <CalendarTodayOutlinedIcon style={{width:"18px",marginRight:"8px"}}/>
            <EditOutlinedIcon  style={{width:"20px",marginRight:"8px"}} />
          <DeleteOutlinedIcon style={{width:"20px",marginRight:"8px"}} />
          </div>
          {!expand ? (
            
            <CgExpand
              size={20}
              cursor="pointer"
              className="expand-icon"
              onClick={handleExpand}
            />
          ) : (
            <IoCloseOutline onClick={handleExpand} size={25} cursor="pointer" />
          )}
        </Box>
        <Divider
          sx={{
            width: "100%",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: expand ? "60%" : "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              height: "90%",
              width: "90%",
            }}
          >
            <Chart
              height={expand ? "100%" : height * 27}
              type="pie"
              series={chartData}
              options={{
                legend: {
                  position: "top",
                },
                labels: labels,
                colors: ["#0B694C", "#D33B5E", "#E86BAA"],
              }}
            />
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <>
      {chart("pie-chart-box")}
      <Dialog
        PaperProps={{
          sx: {
            width: "90vw",
            height: "95vh",
            maxWidth: "none",
            maxHeight: "none",
          },
        }}
        open={expand}
      >
        {chart("pie-chart-box-expand")}
      </Dialog>
    </>
  );
};

export default PieChart;
