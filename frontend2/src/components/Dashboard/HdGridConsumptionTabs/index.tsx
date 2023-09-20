import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Drawer,
  LinearProgress,
  Box as MuiBox,
  Typography,
} from "@mui/material";
import "./styles.css";
import AnalyticsFilter from "../../AnalyticsFilter/AnalyticsFilter";

import MultiLineChartYaxis from "../../../charts/multiLineChart/multiLineChartYaxis";

import {
  diagonsis,
  getEndOfWeek,
  getStartOfWeek,
  hostName,
  tower1ConsumptionDataFormate,
} from "../../utlis/utlis";
import MultiLineChart from "../../../charts/multiLineChart/multiLineChart";
import axios from "axios";
import useMultipleUrlData from "../../Hooks/useFetchHook";

const dateFormates = (dateString: string | number | Date) => {
  const date = new Date(dateString);

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );

  const day = date.getDate();
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  }

  const year = date.getFullYear().toString().slice(-2);

  return `${month} ${day}${suffix} '${year}`;
};

console.log("datesss", dateFormates("9/5/2023 0:51"));

function TabPanel(props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <MuiBox sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </MuiBox>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const HDGridConsumptionTabs = (props: any) => {
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState<number>(0);

  const [incomerDates, setIncomerDates] = useState<any>();
  const [differnceDates, setDifferenceDates] = useState<any>();
  const [analyticsDrawer, setAnalyticsDrawer] = useState(false);

  const [showMaxValue, setShowMaxValue] = useState(false);
  const [showMinValue, setShowMinValue] = useState(false);
  const [showSdValue, setShowSdValue] = useState(false);
  const [showMeanValue, setShowMeanValue] = useState(false);
  const [showMedianValue, setShowMedianValue] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const [previousStartDate, setPreviousStartDate] = useState("");
  const [previousEndDate, setPreviousEndDate] = useState("");

  const [showMorePrediction, setShowMorePrediction] = useState(false);

  const [isCompare, setIsCompare] = useState(true);
  const [prediction, setprediction] = useState("d");

  const [previousIncomeData, setPreviousIncomeData] = useState<any>();
  const [previousMainmeterData, setPreviousMainmeterData] = useState<any>();

  const [monthlyData, setMonthlyData] = useState({});

  const urls = [`http://localhost:8081/api/sensor_data/pocHelix`];
  const { data, isLoading, error } = useMultipleUrlData(urls);
  console.log("handle", data);

  const mainMeterData = tower1ConsumptionDataFormate(
    data[0]?.chartData?.mainMeter,
    "consumption"
  );

  const tool = data[0]?.chartData?.mainMeter.slice(-7);
  const toolData = { mainMeter: tool };
  console.log("tool", toolData);

  const lastSevenStrings = mainMeterData?.slice(-7);

  const dates = tower1ConsumptionDataFormate(
    data[0]?.chartData?.mainMeter,
    "date",
    true
  );
  const lastSevenDates = dates?.slice(-7);
  let stringsBefore7;
  stringsBefore7 = mainMeterData?.slice(-14, -7);

  let datesbrfore: any;
  datesbrfore = dates?.slice(-14, -7);

  let result: string[] = [];

  if (lastSevenDates) {
    lastSevenDates.map((each: any, i: number) => {
      let subArr: any = [];
      subArr.push(lastSevenDates[i]);
      subArr.push(datesbrfore[i]);
      result.push(subArr);
      subArr = [];
    });
  }

  const array1 = data[0]?.chartData?.mainMeter.slice(-7);
  const array2 = data[0]?.chartData?.mainMeter.slice(-14, -7);

  function calculatePercentageChange(initial: any, final: any) {
    initial = parseFloat(initial);
    final = parseFloat(final);

    if (initial === 0) {
      return final === 0 ? 0 : Infinity; // Handle division by zero
    }

    return `${(((final - initial) / initial) * 100).toFixed(3)}%`;
  }

  // Iterate through the arrays and calculate percentage changes for InitialReading, FinalReading, consumption, and meterFactor
  const finalData: any = array1?.map((item1: any, index: any) => {
    const item2 = array2[index];

    // Calculate percentage changes for each property
    const percentageChanges = {
      InitialReading: calculatePercentageChange(
        item1.InitialReading,
        item2.InitialReading
      ),
      FinalReading: calculatePercentageChange(
        item1.FinalReading,
        item2.FinalReading
      ),
      consumption: calculatePercentageChange(
        item1.consumption,
        item2.consumption
      ),
      meterFactor: calculatePercentageChange(
        item1.meterFactor,
        item2.meterFactor
      ),
    };

    return percentageChanges;
  });

  const dialtoolData = { mainMeter: finalData };
  // const pi =  tower1ConsumptionDataFormate(data[2].incomerMeter, "yhat");
  // const piData = [...incomerData,...pi]
  // console.log("pi", piData)

  // const pm=  tower1ConsumptionDataFormate(data[2].mainMeter, "yhat");
  // const pmData = [...mainMeterData, ...pm]

  // console.log("pm", pmData)
  // const pdates=  tower1ConsumptionDataFormate(data[2].mainMeter, "ds",true);

  // console.log("pppp", pi)
  //   const previousDifference = tower1ConsumptionDataFormate(
  //     data[1].chartData.diffInKwh,
  //     "diffInKwh"
  //   );

  // const lengthP = pdates.length

  // const overlDates = [...dates, ...pdates]

  const analyticdata = [
    {
      FinalReading: "528693.000",
      InitialReading: "289674",
      consumption: "239019",
      meterFactor: "120000",
      date: "7/25/23 0:51",
    },
    {
      FinalReading: "516565.000",
      InitialReading: "271421",
      consumption: "245144",
      meterFactor: "120000",
      date: "7/26/23 0:51",
    },
    {
      FinalReading: "474501.000",
      InitialReading: "261780",
      consumption: "212721",
      meterFactor: "120000",
      date: "7/27/23 0:51",
    },
    {
      FinalReading: "560246.000",
      InitialReading: "339895",
      consumption: "220351",
      meterFactor: "120000",
      date: "7/28/23 0:51",
    },
    {
      FinalReading: "530754.000",
      InitialReading: "400001",
      consumption: "130753",
      meterFactor: "120000",
      date: "7/29/23 0:51",
    },
    {
      FinalReading: "565253.000",
      InitialReading: "344881",
      consumption: "220372",
      meterFactor: "120000",
      date: "7/30/23 0:51",
    },
    {
      FinalReading: "522608.000",
      InitialReading: "306114",
      consumption: "216494",
      meterFactor: "120000",
      date: "7/31/23 0:51",
    },
  ];

  const consumptionValues = analyticdata?.map((item: any) =>
    parseFloat(item.consumption)
  );

  // Find maximum and minimum values
  const maxConsumption = Math.max(...consumptionValues);
  const minConsumption = Math.min(...consumptionValues);

  // Calculate mean
  const mean =
    consumptionValues.reduce((acc: any, val: any) => acc + val, 0) /
    consumptionValues.length;

  // Calculate standard deviation
  const squaredDifferences = consumptionValues.map((val: any) =>
    Math.pow(val - mean, 2)
  );
  const variance =
    squaredDifferences.reduce((acc: any, val: any) => acc + val, 0) /
    consumptionValues.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate median
  const sortedConsumptionValues = consumptionValues
    .slice()
    .sort((a: any, b: any) => a - b);
  const middle = Math.floor(sortedConsumptionValues.length / 2);
  const median =
    sortedConsumptionValues.length % 2 === 0
      ? (sortedConsumptionValues[middle - 1] +
          sortedConsumptionValues[middle]) /
        2
      : sortedConsumptionValues[middle];

  // Create an object with all the statistics
  const statistics = {
    MaximumValue: { consumption: maxConsumption },
    MinimumValues: { consumption: minConsumption },
    Means: { consumption: mean },
    StandardDeviations: { consumption: standardDeviation },
    Medians: { consumption: median },
  };

  const chart = { mainMeter: [statistics] };

  console.log("analytic", chart);
  const onclickAnalytics = (value: any) => {
    setAnalyticsDrawer(!value);
  };
  const onClickhtGridAnalytics = () => {
    setAnalyticsDrawer(!analyticsDrawer);
  };
  const analyticsMaxValue = (newShowMaxValue: any) => {
    setShowMaxValue(newShowMaxValue);
  };
  const analyticsMinValue = (newShowMinValue: any) => {
    setShowMinValue(newShowMinValue);
  };
  const analyticsSdValue = (newShowSdValue: any) => {
    setShowSdValue(newShowSdValue);
  };
  const analyticsMeanValue = (newShowMeanValue: any) => {
    setShowMeanValue(newShowMeanValue);
  };
  const analyticsMedianValue = (newShowMedianValue: any) => {
    setShowMedianValue(newShowMedianValue);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="consumption-dashboard-tabs">
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1 className="substation-heading">HT Grid Consumption</h1>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
            sx={{
              borderBottom: "1px solid #efefef",
            }}
          >
            <Tab
              sx={{
                textTransform: "capitalize",
                fontFamily: "Suisse Intl",
                fontWeight: "600",
              }}
              label="Consumption"
              {...a11yProps(0)}
            />
          </Tabs>

          <p className="htgrid-analytics" onClick={onClickhtGridAnalytics}>
            Analytics
          </p>
        </div>
        <TabPanel value={value} index={0}>
          <MultiLineChartYaxis
            yAxisLabel="33/66 kV Incomer"
            chartData={{
              data: [
                {
                  name: "33/66 kV Incomer",
                  type: "line",
                  data: lastSevenStrings,
                },

                ...(showMore
                  ? [
                      {
                        name: "Previous 33/66 Kv Incomer",
                        type: "line",

                        data: stringsBefore7,
                      },
                    ]
                  : []),
              ],
              xaxis: showMore ? result : lastSevenDates,

              color: showMore ? ["#3c0fd1", "#d75d5b"] : ["#1a8f39", "#00E396"],
            }}
            formatText="kWh"
            height={13}
            tooltip={showMore ? dialtoolData : toolData}
            chartAnalyticData={chart}
            showMax={showMaxValue}
            showMin={showMinValue}
            isSd={showSdValue}
            isMean={showMeanValue}
            isMedian={showMedianValue}
            isCompare={isCompare}
            foreCast={showMorePrediction ? "" : []}
            isSingleLine={true}
          />
        </TabPanel>
        <Drawer anchor="right" open={analyticsDrawer}>
          <AnalyticsFilter
            onclickAnalytics={onclickAnalytics}
            analyticsDrawer={analyticsDrawer}
            showMaxValue={showMaxValue}
            showMinValue={showMinValue}
            showSdValue={showSdValue}
            showMeanValue={showMeanValue}
            showMedianValue={showMedianValue}
            analyticsMinValue={analyticsMinValue}
            analyticsMaxValue={analyticsMaxValue}
            analyticsSdValue={analyticsSdValue}
            analyticsMeanValue={analyticsMeanValue}
            analyticsMedianValue={analyticsMedianValue}
            setShowMore={setShowMore}
            showMore={showMore}
            setIsCompare={setIsCompare}
            setShowMorePrediction={setShowMorePrediction}
            showMorePrediction={showMorePrediction}
            setprediction={setprediction}
            setPreviousStartDate={setPreviousStartDate}
            setPreviousEndDate={setPreviousEndDate}
            type={"htGrid"}
          />
        </Drawer>
      </div>

      {/* { showMorePrediction ? 
      <div className="htpreditionTable">
      <table >
  <tr>
    <th>Date</th>
    {data[2].incomerMeter.map((each:any)=> {
      return(
        <td style={{background:"#f2f2f2"}}>{dateFormates(each.ds)}</td>
      )
    })}
    
  </tr>
  <tr>
    <th>Incommer value</th>
    {data[2].incomerMeter.map((e:any)=> {
      return(
 <td>{e.yhat.toFixed(2)}</td>
    )})}
   
    
  </tr>
  <tr>
    <th>Mainmeter value</th>
    {data[2].mainMeter.map((e:any)=> {
      return(
 <td>{e.yhat.toFixed(2)}</td>
    )})}
   
    
  </tr>
</table>
      </div> : []} */}
    </>
  );
};

export default HDGridConsumptionTabs;
