import React from "react";
import Chart from "react-apexcharts";
import { VerticalChartProps } from "../types/chartTypes";

const VerticalChart = (props: VerticalChartProps) => {
  const { chartData, categories, chartHeight } = props;

  return (
    <div>
      <Chart
        className="comparison-graph"
        height={chartHeight}
        type="bar"
        series={chartData}
        options={{
          chart: {
            height: "100%",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
            },
          },
          xaxis: {
            categories: categories,
          },
          stroke: {
            width: 5,
            colors: ["transparent"],
          },
        }}
      />
    </div>
  );
};

export default VerticalChart;
