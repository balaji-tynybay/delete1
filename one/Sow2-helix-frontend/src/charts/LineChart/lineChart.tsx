import React, { useState } from "react";

import Chart from "react-apexcharts";
import "./styles.css";
import { Box, Dialog, Divider } from "@mui/material";
import { CgExpand } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const LineChart = (props: any) => {
  const [expand, setExpand] = useState(false);
  const {
    chartData,
    headingText,
    formatText,
    height = 0,
    tooltip,
  } = props;


// const customTooltips = [
//   function ({ series, seriesIndex, dataPointIndex }: any) 
//    {
//     return (
//       " <div style='padding: 15px;'>" +
//       " <p><b> Consumption Diff   </b>:  " +
//       Math.round(tooltip.diffInKwh[dataPointIndex].diffInKwh).toFixed(2) +
//       " </p>" +
//       " </div>"
//     );
//   },
 
// ]
const tooltipObjKeys = Object.keys(tooltip ? tooltip : []);


  const handleExpand = () => {
    setExpand(!expand);
  };

  console.log("g", height);

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
            className="line-chart-text"
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
              className="line-expand-icon"
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
              height={expand ? "100%" : height * 20}
              type="line"
              series={[
                {
                  name: chartData.name,
                  data: chartData.yaxis,
                },
              ]}
              options={{
                chart: {
                  zoom: {
                    enabled: false,
                  },
                },
                xaxis: {
                  categories: chartData.xaxis,
                  labels: {
                    style: {
                      // fontSize: `${height}px`,
                      fontSize: "15px",
                      fontWeight: 600,
                      fontFamily: "Suisse Intl",
                    },
                    rotate: -45,
                  },
                  offsetY: 5,
                },
                yaxis: {
                  labels: {
                    formatter: function (val, index) {
                      return `${val} ${formatText}`;
                    },
                    style: {
                      // fontSize: `${height}px`,
                      fontSize: "15px",
                      fontWeight: 600,
                      fontFamily: "Suisse Intl",
                    },
                    offsetX: -3,
                  },
                  title: { text: "Measure value" },
                },
                tooltip: {
                  enabled: true,
                  y: {
                    formatter: (val: any) => {
                      return Math.round(parseInt(val)).toFixed(2);
                    },
                  },
                  shared: false,
                  intersect: true,
                  custom: tooltipObjKeys.map((eachLine: any, i) => {
                    console.log("lalal", tooltip?.[`${eachLine}`]);
                    return ({
                      series,
                      seriesIndex,
                      dataPointIndex,
                      w,
                    }: any) => {
                      return (
                        "<div style='padding: 10px;'>" +
                        Object.keys(tooltip?.[`${eachLine}`][i]).map(
                          (item: any, index: number) => {
                            return (
                              "<p> " +
                              "<b>" +
                              item +
                              "</b>: " +
                              tooltip?.[`${eachLine}`][dataPointIndex][
                                `${item}`
                              ] +
                              "</p>"
                            );
                          }
                        ) +
                        "</div>"
                      );
                    };
                  }),
                },
                // annotations: {
                //   yaxis: showMinAndMaxValues
                //     ? [
                //         {
                //           y: Math.min(...chartData.yaxis),
                //           borderColor: chartData.color[0],
                //           label: {
                //             style: {
                //               color: "#fff",
                //               background: chartData.color[0],
                //             },
                //             text: `Minimum Value : ${Math.min(
                //               ...chartData.yaxis
                //             )}`,
                //           },
                //         },
                //         {
                //           y: Math.max(...chartData.yaxis),
                //           borderColor: chartData.color[0],
                //           label: {
                //             style: {
                //               color: "#fff",
                //               background: chartData.color[0],
                //             },
                //             text: `Maximum Value : ${Math.max(
                //               ...chartData.yaxis
                //             )}`,
                //           },
                //         },
                //       ]
                //     : [],
                // },

                stroke: {
                  curve: "smooth",
                  width: 3,
                },
                markers: {
                  size: 5,
                },
                colors: chartData.color,
              }}
            />
          </Box>
        </Box>
      </div>
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

export default LineChart;
