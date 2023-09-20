import React, { useState } from "react";

import Chart from "react-apexcharts";
import "./styles.css";
import { Box, Dialog, Divider } from "@mui/material";
import { CgExpand } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { VerticalBarChartProps } from "../types/chartTypes";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
const VerticalBarChart = (props: VerticalBarChartProps) => {
  const [expand, setExpand] = useState(false);
  const { chartData, headingText, categories, height = 0 } = props;

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
            className="vertical-bar-chart-text"
          >
            {headingText}
          </h1>
          <div style={{ marginLeft: "85%" }}>
            <CalendarTodayOutlinedIcon
              style={{ width: "18px", marginRight: "8px" }}
            />
            <EditOutlinedIcon style={{ width: "20px", marginRight: "8px" }} />
            <DeleteOutlinedIcon style={{ width: "20px", marginRight: "8px" }} />
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
            width: expand ? "75%" : "100%",
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
              type="bar"
              series={chartData}
              options={{
                dataLabels: {
                  enabled: false,
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "30%",
                  },
                },
                legend: {
                  offsetY: 8,
                  markers: {
                    radius: 100,
                  },
                },
                xaxis: {
                  categories: categories,
                  labels: {
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "Suisse Intl",
                    },
                  },
                  offsetY: 10,
                },
                stroke: {
                  width: 0,
                  colors: ["transparent"],
                },
                yaxis: [
                  {
                    seriesName: "Energy Consumption",
                    axisBorder: {
                      show: true,
                      color: chartData[0].color,
                    },
                    labels: {
                      formatter: function (val, index) {
                        return `${val}kWh`;
                      },
                      style: {
                        fontSize: `${height}px`,
                        fontWeight: 600,
                        fontFamily: "Suisse Intl",
                      },
                      offsetX: -10,
                    },
                  },
                  {
                    seriesName: "Average Headcount",
                    opposite: true,
                    axisBorder: {
                      show: true,
                      color: chartData[1].color,
                    },
                    labels: {
                      style: {
                        fontSize: `${height}px`,
                        fontWeight: 600,
                        fontFamily: "Suisse Intl",
                      },
                      offsetX: -10,
                    },
                  },
                ],
              }}
            />
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <>
      {chart("vertical-bar-chart-box")}
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
        {chart("vertical-bar-chart-box-expand")}
      </Dialog>
    </>
  );
};

export default VerticalBarChart;
