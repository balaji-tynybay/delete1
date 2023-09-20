import React, { useState } from "react";

import Chart from "react-apexcharts";
import { Box, Dialog, Divider, IconButton, Typography } from "@mui/material";
import { CgExpand } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
// import { MultiLineChartProps } from "../types/chartTypes";
import { MuiTooltip } from "../../components/Tooltip";
import { BsCalendar2Date } from "react-icons/bs";
import AppContext from "../../context/appContext";
// import ChartDateFilter from "../../components/ChartDateFilter";
// import GettingFilterButtons from "../../utlis";
import { IoIosCloseCircle } from "react-icons/io";
import { capitalizeFun } from "../../components/utlis/utlis";

const MultiLineChartYaxis = (props: any) => {
  const [expand, setExpand] = useState(false);
  const {
    chartData,
    headingText,
    showMinAndMaxValues,
    formatText,
    height = 0,
    xAxisLabel,
    yAxisLabel,
    foreCast,
    tooltip,
    chartAnalyticData,
    isSingleLine = false,
    showMax = false,
    showMin = false,
    isSd = false,
    isMean = false,
    isMedian = false,
    isCompare = false,
  } = props;
  const handleExpand = () => {
    setExpand(!expand);
  };

  const tooltipObjKeys = Object.keys(tooltip ? tooltip : []);

  const objKeys = Object.keys(chartAnalyticData ? chartAnalyticData : []);
  console.log("chart", chartAnalyticData);

  const getAnnotations = () => {
    let annotationsArray: {
      y: any;
      borderColor: any;
      label: { style: { color: string; background: any }; text: string };
    }[] = [];
    objKeys
      .filter((e) => e !== "diff")
      .map((eachLine) => {
        if (showMax) {
          annotationsArray.push({
            y: chartAnalyticData[`${eachLine}`][0]?.MaximumValue?.consumption,
            borderColor: chartData.color[0],

            label: {
              style: {
                color: "#fff",
                background: "#120fd1",
              },

              text: `Max : ${chartAnalyticData[
                `${eachLine}`
              ][0]?.MaximumValue?.consumption?.toFixed(2)}`,
            },
          });
        }

        if (showMin) {
          annotationsArray.push({
            y: chartAnalyticData[`${eachLine}`][0]?.MinimumValues?.consumption,
            borderColor: chartData.color[1],
            label: {
              style: {
                color: "#fff",
                background: "#d11f0f",
              },
              text: `Min : ${chartAnalyticData[
                `${eachLine}`
              ][0]?.MinimumValues?.consumption?.toFixed(2)}`,
            },
          });
        }

        if (isSd) {
          annotationsArray.push({
            y: chartAnalyticData[`${eachLine}`][0]?.StandardDeviations
              ?.consumption,
            borderColor: chartData.color[1],
            label: {
              style: {
                color: "#fff",
                background: "#25660b",
              },
              text: `Sd : ${chartAnalyticData[
                `${eachLine}`
              ][0]?.StandardDeviations?.consumption?.toFixed(2)}`,
            },
          });
        }

        if (isMean) {
          annotationsArray.push({
            y: chartAnalyticData[`${eachLine}`][0]?.Means?.consumption,
            borderColor: chartData.color[1],
            label: {
              style: {
                color: "#fff",
                background: "#037070",
              },
              text: `Mean : ${chartAnalyticData[
                `${eachLine}`
              ][0]?.Means?.consumption?.toFixed(2)}`,
            },
          });
        }

        if (isMedian) {
          annotationsArray.push({
            y: chartAnalyticData[`${eachLine}`][0]?.Medians?.consumption,
            borderColor: chartData.color[1],
            label: {
              style: {
                color: "#fff",
                background: "#b00caa",
              },
              text: `Median : ${chartAnalyticData[
                `${eachLine}`
              ][0]?.Medians?.consumption?.toFixed(2)}`,
            },
          });
        }
      });
    return annotationsArray;
  };

  const chart = (boxClass: string) => {
    return (
      <AppContext.Consumer>
        {(value) => (
          <div className={boxClass}>
            <Box
              sx={{
                padding: expand
                  ? "15px"
                  : `${height - 4}px ${height - 4}px ${
                      height - 4
                    }px ${height}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h1
                style={{ fontSize: expand ? "18px" : `${height + 3}px` }}
                className="line-chart-text"
              >
                {headingText}
              </h1>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              ></Box>
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
                height: expand ? "100%" : "90%",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <Chart
                  height={expand ? "100%" : height * 27}
                  type="line"
                  series={chartData.data}
                  options={{
                    chart: {
                      zoom: {
                        enabled: false,
                      },
                      toolbar: {
                        show: false,
                      },
                    },
                    forecastDataPoints: {
                      count: foreCast,
                    },

                    xaxis: {
                      categories: chartData.xaxis,
                      labels: {
                        style: {
                          fontSize: `${height}px`,
                          fontWeight: 600,
                          fontFamily: "Suisse Intl",
                          cssClass: "ok",
                        },
                        rotate: -45,
                      },
                      offsetY: -5,

                      title: {
                        text: xAxisLabel,
                        // offsetY: 80,
                        style: {
                          fontSize: `${height}px`,
                        },
                      },
                    },

                    yaxis: [
                      {
                        axisBorder: {
                          show: true,
                          color: chartData.color,
                        },
                        labels: {
                          formatter: function (val, index) {
                            return `${val} ${formatText}`;
                          },
                          style: {
                            fontSize: `${height}px`,
                            fontWeight: 600,
                            fontFamily: "Suisse Intl",
                          },
                          offsetX: -5,
                        },
                        title: {
                          text: yAxisLabel,
                          offsetX: 2,
                          style: {
                            fontSize: `${height}px`,
                            color: "#247BA0"

                          },
                        },
                      },
                      {

                        axisBorder: {
                          show: true,
                          color: chartData.color,
                        },
                        labels: {
                          show: false,
                          formatter: function (val, index) {
                            return `${val} ${formatText}`;
                          },
                          style: {
                            fontSize: `${height}px`,
                            fontWeight: 600,
                            fontFamily: "Suisse Intl",
                          },
                        },
                        title: {
                          // text: yAxisLabel,
                          offsetX: 6,
                          style: {
                            fontSize: `${height}px`,
                          },
                        },
                      },
                     
                    ],

                    stroke: {
                      curve: "smooth",
                      width: 3,
                    },
                    markers: {
                      size: 5,
                    },
                    colors: chartData.color,
                    legend: {
                      position: "bottom",
                      offsetY: 8,
                    },

                    tooltip: {
                      custom: tooltipObjKeys.map((eachLine: any, i) => {
                        return ({ dataPointIndex }: any) => {
                          return (
                            "<div style='padding: 15px;'>" +
                            Object.keys(tooltip?.[`${eachLine}`][i])
                              .filter((e) => e !== "date")
                              .map((item: any) => {
                                return (
                                  "<p> " +
                                  "<b>" +
                                  capitalizeFun(item) +
                                  "</b>: " +
                                  tooltip?.[`${eachLine}`][dataPointIndex][
                                    `${item}`
                                  ] +
                                  "</p>"
                                );
                              })
                              .join("<br>") +
                            "</div>"
                          );
                        };
                      }),
                    },
                    annotations: {
                      yaxis: 
                     
                      getAnnotations()
                    
                    },
                  }}
                />
              </Box>
            </Box>
          </div>
        )}
      </AppContext.Consumer>
    );
  };

  return (
    <>
      {chart("line-chart-box")}
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
        {chart("line-chart-box-expand")}
      </Dialog>
    </>
  );
};

export default MultiLineChartYaxis;
