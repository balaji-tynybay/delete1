import {
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  ListItem,
  ListItemButton,
  SelectChangeEvent,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import MuiAccordion from "../Accordion/MuiAccordion";
import { IoIosArrowDown } from "react-icons/io";

import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";

import MuiSwitch from "../Switch/index";
import "./styles.css";
import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Box as MuiBox,
  Select,
  Typography,
} from "@mui/material";
import "./styles.css";
import axios from "axios";
// import { accessToken } from "../Dashboard/token";
import { getEndOfWeek, getStartOfWeek, hostName } from "../utlis/utlis";
import useMultipleUrlData from "../Hooks/useFetchHook";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50,
    },
  },
};

const minAndmaxValues1 = ["max", "min"];
const minAndmaxValues2 = ["max", "min"];

const types1 = ["<", ">", "==", ">="];
const types2 = ["<", ">", "==", ">="];

const names2 = [
  "if greater than 1 times",
  "if greater than 2 times",
  "if greater than 3 times",
  "if greater than 4 times",
  "if greater than 5 times",
  "if greater than 6 times",
];
const names4 = ["Hour", "Day", "Week", "Month"];

// function getStyles(name: string, personName: readonly string[], theme: Theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }
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

const AnalyticsFilter = (props: any) => {
  const [value, setValue] = useState<number>(0);
  const [isCodeDisplayed, setIsCodeDisplayed] = useState(false);
  const theme = useTheme();
  const [triggerValue, setTriggerValue] = useState<any>(0);
  const [triggerValue1, setTriggerValue1] = useState<any>(0);
  const [toggle, setToggle] = useState(false);
  const [minandmaxValue1, setMinandmaxValue1] = useState<any>([]);
  const [minandmaxValue, setMinandmaxValue] = useState<any>([]);
  const [operatorType1, setOperatorType1] = useState<any>([]);
  const [operatorType, setOperatorType] = useState<any>([]);
  const [noOfTimes, setNoOfTimes] = useState<any>("");
  const [filter, setFilter] = useState<any>("");

  const [getTriggerData, setGetTriggerData] = useState<any>("");
  const [triggersData, setTriggersData] = useState<any>([]);
  const [minColor, setMinColor] = useState<any>("#2BBC69");
  const [maxColor, setMaxColor] = useState<any>("#B92222");
  const [activeTimeFrame, setActiveTimeFrame] = useState<any>("");
  const [activeTimeFramep, setActiveTimeFramep] = useState<string>("");
  const [isTriggerEnabled, setTriggerEnabled] = useState(false);
  const [limitType, setLimitType] = useState("Min");
  const [comparisonOperator, setComparisonOperator] = useState("<");
  const [triggerCondition, setTriggerCondition] = useState(
    "if greater than 10 times."
  );
  const [timeUnit, setTimeUnit] = useState("Hour");
  const [selectedFilter, setSelectedFilter] = useState<any>("");
  const [activeDateFilter, setActiveDateFilter] = useState<string>("Last Day");
  const [isColored, setIsColored] = useState<any>(false);
  const [isColored1, setIsColored1] = useState<any>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<any>(false);




  // const [startDate, setStartDate] = useState<any>('');
  // const [endDate, setEndDate] = useState<any>('');


  const {
    setprediction,
    onclickAnalytics,
    analyticsDrawer,
    showMaxValue,
    analyticsMaxValue,
    showMinValue,
    analyticsMinValue,
    showSdValue,
    analyticsSdValue,
    showMeanValue,
    showMedianValue,
    analyticsMeanValue,
    analyticsMedianValue,
    setShowMore,
    showMore,
    setIsCompare,
    setShowMorePrediction,
    showMorePrediction,
    type,
    setPreviousStartDate,
    setPreviousEndDate,
    predictionType
  } = props;

  const handleLastWeekFilter = () => {

    const currentDate = new Date();
    const previousWeekStartDate = getStartOfWeek(currentDate);
    previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
    const previousWeekEndDate = getEndOfWeek(currentDate);
    previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);
  
    const formattedStartDate = previousWeekStartDate.toISOString().split('T')[0];
    const formattedEndDate = previousWeekEndDate.toISOString().split('T')[0];
  
    setPreviousStartDate(formattedStartDate);
    setPreviousEndDate(formattedEndDate);

    setSelectedFilter("last week");
  };

  const getLastmonth =  () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
  
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0);
  
    const lastMonthStartDate = lastMonthStart.toISOString().slice(0, 10);
    const lastMonthEndDate = lastMonthEnd.toISOString().slice(0, 10);
    setPreviousStartDate(lastMonthStartDate);
    setPreviousEndDate(lastMonthEndDate);
    setSelectedFilter("last month");
  }

  const timeFrameData = [
    // {
    //   display: "Last year same time",
    // },
    // {
    //   display: "Last month same time",
    // },

    // {
    //   display: "Last moth",
    //   value: "last month",
    //   handler: getLastmonth

    // },
    {
      display: "Last week",
      value: "last week",
      handler: handleLastWeekFilter,

    },
  ];

 

  const predictionData1 = [
    // {
    //   display: "Next Year",
    // },
    {
      display: "Next 7 Days",
      value: "d",
    },
    // {
    //   display: "Next 30 Days",
    //   value : "m",
    // },
  ];

  const handleGroupByChange = (value: React.SetStateAction<string>) => {
    setprediction(value);
    
  };

  const handleDiagnosticChange = (value: React.SetStateAction<string>) => {
    setPreviousStartDate(value);
    setPreviousEndDate(value);
    
  };

 

  const handleClick = () => {
    setIsCodeDisplayed(!isCodeDisplayed);
  };
  const handleChange1 = (event: SelectChangeEvent<typeof minandmaxValue>) => {
    const {
      target: { value },
    } = event;

    setMinandmaxValue(value);
  };
  const handleChange2 = (event: SelectChangeEvent<typeof operatorType>) => {
    const {
      target: { value },
    } = event;
    setOperatorType(value);
    
  };
  const handleChange5 = (event: SelectChangeEvent<typeof minandmaxValue1>) => {
    const {
      target: { value },
    } = event;

   
    setMinandmaxValue1(typeof value === "string" ? value.split(",") : value);
  };
  const handleChange6 = (event: SelectChangeEvent<typeof operatorType1>) => {
    const {
      target: { value },
    } = event;
    setOperatorType1(typeof value === "string" ? value.split(",") : value);
  };
  const handleChange3 = (event: SelectChangeEvent<typeof noOfTimes>) => {
    const {
      target: { value },
    } = event;
    setNoOfTimes(typeof value === "string" ? value.split(",") : value);
  };
  const handleChange4 = (event: SelectChangeEvent<typeof filter>) => {
    const {
      target: { value },
    } = event;
    setFilter(typeof value === "string" ? value.split(",") : value);
  };

  const handleTriggerValueChange = (event: any) => {
    setTriggerValue(event.target.value);
  };
  const handleTriggerValueChange1 = (event: any) => {
    setTriggerValue1(event.target.value);
  };

  // const toggleTrigger = () => {
  //   setTriggerEnabled(!isTriggerEnabled);
  // };

  // const handleLimitTypeChange = (type: React.SetStateAction<string>) => {
  //   setLimitType(type);
  // };

  const handleComparisonOperatorChange = (
    operator: React.SetStateAction<string>
  ) => {
    setComparisonOperator(operator);
  };

  const handleTriggerConditionChange = (
    condition: React.SetStateAction<string>
  ) => {
    setTriggerCondition(condition);
  };

  const handleTimeUnitChange = (unit: React.SetStateAction<string>) => {
    setTimeUnit(unit);
  };

  const handleFrameClick = (time: string) => {
    setActiveTimeFrame(time);
  };

  const handleFrameClickPrediction = (time: string) => {
    setActiveTimeFramep(time);
  };

  const handleMinColor = (e: any) => {
    setMinColor(e.target.value);
  };

  const handleMaxColor = (e: any) => {
    setMaxColor(e.target.value);
  };

  const onClickClose = () => {
    onclickAnalytics(analyticsDrawer);

  };
  const handleToggleMaxValues = () => {
    analyticsMaxValue(!showMaxValue);
    // analyticsStationMaxValue(!showSubstationMaxValue);
  };
  const handleToggleMinValues = () => {
    analyticsMinValue(!showMinValue);
    // analyticsStationMinValue(!showSubstationMinValue);
  };
  const handleToggleSdValues = () => {
    analyticsSdValue(!showSdValue);
    // analyticsStationSdValue(!showSubstationSdValue);
  };
  const handleToggleMeanValues = () => {
    analyticsMeanValue(!showMeanValue);
    // analyticsStationMeanValue(!showSubstationMeanValue);
  };
  const handleToggleMedianValues = () => {
    analyticsMedianValue(!showMedianValue);
    // analyticsStationMedianValue(!showSubstationMedianValue);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const accessToken = localStorage.getItem("accessToken");

  const getFunction = () => {
    axios
      .get(
        `${hostName}/api/sensor_data/getTriggerSetting?type=${type}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTriggersData(response.data?.toggle);
        setToggle(response.data?.toggle);
        setMinandmaxValue("max")
        setOperatorType(response.data?.limit?.max?.comparisonOperator);
        setTriggerValue(response.data?.limit?.max?.value)
        setMinandmaxValue1("min")
        setOperatorType1(response.data?.limit?.min?.comparisonOperator);
        setTriggerValue1(response.data?.limit?.min?.value)
        setNoOfTimes(response.data?.exceedTimes)
        setFilter(response.data?.filter)
        console.log("GET Data:", triggersData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleSubmit = (typee: string) => {
    const triggersData = {
      toggle: toggle,
      filter: filter[0],
      exceedTimes: parseInt(noOfTimes[0].replace(/\D/g, "")),
      // interval: filter[0],
      limit: {
        min: {
          value: parseInt(triggerValue1),
          comparisonOperator: operatorType1[0],
          type: "min",
        },
        max: {
          value: parseInt(triggerValue),
          comparisonOperator: operatorType[0],
          type: "max",
        },
      },
    };

 
    axios
      .post(
        `${hostName}/api/sensor_data/triggerSetting?type=${typee}`,
        // `https://api-demo-v3.helixsense.com/api/authentication/oauth2/token`,
        triggersData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          // timeout: 60000,
        }
      )
      .then((response) => {
        console.log("POST Data:", response.data);
        getFunction();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    getFunction();
  }, []);

  return (
    <>
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
          label="Analytics"
          {...a11yProps(0)}
        />

        <Tab
          sx={{
            textTransform: "capitalize",
            fontFamily: "Suisse Intl",
            fontWeight: "600",
          }}
          label="TriggerSettings"
          {...a11yProps(2)}
        />

        <div
          style={{ cursor: "pointer", marginLeft: "110px", marginTop: "10px" }}
          onClick={onClickClose}
        >
          <IoClose size={25} />
        </div>
      </Tabs>
      <div className="filter-box">
        <TabPanel value={value} index={0}>
          <div>
            <div className="filter-header-box">
              <div>
                <h1 className="filter-head">Design your Chart</h1>
              </div>
            </div>
            <MuiAccordion>
              <AccordionSummary
                expandIcon={<IoIosArrowDown className="filter-description" />}
              >
                <p className="filter-description">Descriptive Analytics</p>
              </AccordionSummary>
              <AccordionDetails>
                <div className="row-between-box">
                  <p className="filter-value-label">Minimum value</p>

                  <MuiSwitch
                    onChange={handleToggleMinValues}
                    checked={showMinValue}
                  />
                </div>
                {/* <div className="input-color-box-outer">
                  <p className="filter-value-color-label">Select color</p>
                  <div className="input-color-box-border">
                    <div
                      className="input-color-box"
                      style={{ backgroundColor: minColor }}
                    >
                      <input
                        onChange={handleMinColor}
                        type="color"
                        className="accordion-input"
                      />
                    </div>
                    <p className="filter-value-color-label">{minColor}</p>
                  </div>
                </div> */}
                <div className="row-between-box">
                  <p className="filter-value-label">Maximum value</p>
                  <MuiSwitch
                    onChange={handleToggleMaxValues}
                    checked={showMaxValue}
                  />
                </div>
                {/* <div className="input-color-box-outer">
                  <p className="filter-value-color-label">Select color</p>
                  <div className="input-color-box-border">
                    <div
                      className="input-color-box"
                      style={{ backgroundColor: maxColor }}
                    >
                      <input
                        onChange={handleMaxColor}
                        type="color"
                        className="accordion-input"
                      />
                    </div>
                    <p className="filter-value-color-label">{maxColor}</p>
                  </div>
                </div> */}
                <div className="row-between-box">
                  <p className="filter-value-label">Standard deviation</p>
                  <MuiSwitch
                    onChange={handleToggleSdValues}
                    checked={showSdValue}
                  />
                </div>
                <div className="row-between-box">
                  <p className="filter-value-label">Median</p>
                  <MuiSwitch
                    onChange={handleToggleMedianValues}
                    checked={showMedianValue}
                  />
                </div>
                <div className="row-between-box">
                  <p className="filter-value-label">Average</p>
                  <MuiSwitch
                    onChange={handleToggleMeanValues}
                    checked={showMeanValue}
                  />
                </div>
              </AccordionDetails>
            </MuiAccordion>
            <MuiAccordion>
              <AccordionSummary
                expandIcon={<IoIosArrowDown className="filter-description" />}
              >
                <p className="filter-description">Diagnostic analytics</p>
              </AccordionSummary>
              <AccordionDetails>
                <p className="filter-value-color-label">
                  Select Comparison time frame
                </p>
                <ul className="time-frame-filter-box">
                  {timeFrameData.map((each => (
                    <ListItemButton
                    sx={{
                      width: "1px",
                      border: "1px solid #0000001f",
                      height:"48px"
                    }}
                    style={{backgroundColor: showMore ? '#0b694c' : '#ffffff', color:showMore ? '#ffffff' : ''}}

                    onClick={() => {
                          setShowMore(true);
                          setShowMore(!showMore);
                          setIsColored(!isColored);
                        }}
                  >
                    <ListItem
                      sx={{
                        diplay: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      
                    >
                      {each.display}
                    </ListItem>
                  </ListItemButton>
                  )))}
                </ul>
              </AccordionDetails>
            </MuiAccordion>
            <MuiAccordion>
              <AccordionSummary
                expandIcon={<IoIosArrowDown className="filter-description" />}
              >
                <p className="filter-description">Predictive Analytics</p>
              </AccordionSummary>
              <AccordionDetails>
                
                <ul className="time-frame-filter-box">
                  {predictionData1.map((each => (
                    
                

                    <ListItemButton
                    sx={{
                      width: "1px",
                      border: "1px solid #0000001f",
                      height:"48px"
                    }}
                    style={{backgroundColor: showMorePrediction ? '#0b694c' : '#ffffff', color:showMorePrediction ? '#ffffff' : ''}}


                    onClick={() => {
                        handleFrameClick(each.display);
                        setShowMorePrediction(true);
                        setShowMorePrediction(!showMorePrediction);
                        setIsColored1(!isColored1);
                        }}
                  
                  >
                    <ListItem
                      sx={{
                        diplay: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      key={each.value}
                      // onClick={each.handler}
                    >
                      {each.display}
                    </ListItem>
                  </ListItemButton>
                  )))}
                </ul>
              </AccordionDetails>
            </MuiAccordion>
            <MuiAccordion>
              <AccordionSummary
                expandIcon={<IoIosArrowDown className="filter-description" />}
              >
                <p className="filter-description">Prescriptive Analytics</p>
              </AccordionSummary>
              <AccordionDetails></AccordionDetails>
            </MuiAccordion>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <div style={{ display: "flex" }}>
              <strong style={{ marginRight: "8px" }}>Trigger Settings</strong>
              <MuiSwitch
                checked={toggle}
                onChange={(event) => setToggle(event.target.checked)}
              />
            </div>
            <p
              style={{ fontWeight: "bold", margin: "5px", paddingTop: "20px" }}
            >
              Set Limit
            </p>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "15px" }}>
                <FormControl sx={{ width: 100 }}>
                  <Select
                    displayEmpty
                    value={minandmaxValue}
                    onChange={handleChange1}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return <em>value</em>;
                      }
                      return selected;
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {minAndmaxValues1.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        disabled={
                          (minandmaxValue1 == "max" && name == "max") ||
                          (minandmaxValue1 == "min" && name == "min")
                        }
                        // style={getStyles(name, minandmaxValue, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ width: 100, mr: 3 }}>
                  <Select
                    displayEmpty
                    value={operatorType}
                    onChange={handleChange2}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected?.length === 0) {
                        return <em>type</em>;
                      }
                      return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {types1.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        // style={getStyles(name, operatorType, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <input
                  type="text"
                  style={{ width: "60px", height: "55px" }}
                  value={triggerValue}
                  onChange={handleTriggerValueChange}
                />
              </div>
            </div>
            <button className="trigger-button" onClick={handleClick}>
              +Add Trigger
            </button>
            {isCodeDisplayed && (
              <>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "5px",
                    paddingTop: "20px",
                  }}
                >
                  Set Limit
                </p>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "15px" }}>
                    <FormControl sx={{ width: 100, height: 10 }}>
                      <Select
                        displayEmpty
                        value={minandmaxValue1}
                        onChange={handleChange5}
                        input={<OutlinedInput />}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>value</em>;
                          }
                          return selected
                        }}
                        MenuProps={MenuProps}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {minAndmaxValues1.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            disabled={
                              (minandmaxValue == "max" && name == "max") ||
                              (minandmaxValue == "min" && name == "min")
                            }
                            // style={getStyles(name, minandmaxValue1, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl sx={{ width: 100, mr: 3 }}>
                      <Select
                        displayEmpty
                        value={operatorType1}
                        onChange={handleChange6}
                        input={<OutlinedInput />}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>type</em>;
                          }

                          return selected
                        }}
                        MenuProps={MenuProps}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        {types2.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            // style={getStyles(name, operatorType1, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <input
                      type="text"
                      style={{ width: "60px", height: "55px" }}
                      value={triggerValue1}
                      onChange={handleTriggerValueChange1}
                    />
                  </div>
                </div>
              </>
            )}
            <p style={{ fontWeight: "bold", paddingTop: "25px" }}>
              Set Trigger
            </p>
            <div style={{ display: "flex" }}>
              <div>
                <FormControl sx={{ width: 200, mr: 3 }}>
                  <Select
                    displayEmpty
                    value={noOfTimes}
                    onChange={handleChange3}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>if greater than 0 times</em>;
                      }

                      return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {names2.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        // style={getStyles(name, noOfTimes, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <p
                style={{
                  fontWeight: "bold",
                  paddingTop: "15px",
                  paddingRight: "10px",
                }}
              >
                {" "}
                In{" "}
              </p>
              <div>
                <FormControl sx={{ width: 100, mr: 3 }}>
                  <Select
                    displayEmpty
                    value={filter}
                    onChange={handleChange4}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>Hour</em>;
                      }
                      return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {names4.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        // style={getStyles(name, filter, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <button
              className="trigger-button"
              onClick={() => {handleSubmit(type)
                alert("Triggered successfully")}}
            >
              Save
            </button>
          </div>
        </TabPanel>
      </div>
    </>
  );
};

export default AnalyticsFilter;
