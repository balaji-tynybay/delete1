import React, { useState } from "react";

import Chart from "react-apexcharts";
import "./styles.css";
import { Box, Dialog, Divider } from "@mui/material";
import { CgExpand } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { HorizontalBarChartProps } from "../types/chartTypes";

const HorizontalBarChart = (props: HorizontalBarChartProps) => {
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
            width: expand ? "80%" : "100%",
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
              series={[
                {
                  name: chartData.name,
                  data: chartData.data,
                  color: chartData.color,
                },
              ]}
              options={{
                dataLabels: {
                  enabled: false,
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: "35%",
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
                    formatter: function (val, index) {
                      return `${val}kWh`;
                    },
                    style: {
                      fontSize: `${height}px`,
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
                yaxis: {
                  labels: {
                    style: {
                      fontSize: `${height}px`,
                      fontWeight: 600,
                      fontFamily: "Suisse Intl",
                    },
                    offsetX: -10,
                  },
                },
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

export default HorizontalBarChart;
