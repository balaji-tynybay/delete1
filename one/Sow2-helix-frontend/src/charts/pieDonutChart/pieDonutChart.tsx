import Chart from "react-apexcharts";

import { PieDonutChartProps } from "../types/chartTypes";

const PieDonutChart = (props: PieDonutChartProps) => {
  const { chartData, labels, color,} = props;

  return (
    <div>
      <Chart
        type="donut"
        
       height={300}
        series={chartData}
        options={{
          
          legend: {
            position: "top",
          },
          plotOptions: {
            pie: {
              donut: {
                size: "50%"
              }
            }
          },
          labels: labels,
          colors: color,
          
          stroke: {
            width: 0
          },
          tooltip: {
            enabled: true,
            // shared: false,
            // custom: [
            //   function ({ series, seriesIndex, dataPointIndex, w }) {
            //     console.log("okok");
            //     return (
            //       "<ul>" +
            //       "<li><b>Initial Reading</b>: " +
            //       tooltip[dataPointIndex].compelete+
            //       "</li>" +
            //       "<li><b>Initial Reading</b>: " +
            //       tooltip[dataPointIndex].missed+
            //       "</li>" +
            //       "<li><b>Initial Reading</b>: " +
            //       tooltip[dataPointIndex].upcoming+
            //       "</li>" +
            //       "</ul>"
            //     );
            //   },
            
             
            // ],
          }
          
          
        }}
      />
    </div>
  );


  
};

export default PieDonutChart;
