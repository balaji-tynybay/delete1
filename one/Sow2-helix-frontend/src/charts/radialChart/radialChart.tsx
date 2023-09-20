import React from "react";
import Chart from "react-apexcharts";
import { RadialCharProps } from "../types/chartTypes";

const RadialChart = (props: RadialCharProps) => {
  const { chartData, reviewText } = props;

  return (
    <div>
      <Chart
        type="radialBar"
        series={[20]}
        options={{
          plotOptions: {
            radialBar: {
              hollow: {},
            },
          },
          labels: chartData.label,
          colors: chartData.color,
        }}
      />
      <p className="customer-review-text">{reviewText}</p>
    </div>
  );
};

export default RadialChart;
