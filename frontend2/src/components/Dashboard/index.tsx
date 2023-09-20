import "./styles.css";
  import { getEndOfWeek, getStartOfWeek } from "../utlis/utlis";

import React, { useState } from "react";

import {
  ClickAwayListener,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemButton,
  MenuItem,
  Box as MuiBox,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "./styles.css";
import PieDonutChart from "../../charts/pieDonutChart/pieDonutChart";
import Header from "../Header";

import Tables from "./Tables";
import HDGridConsumptionTabs from "./HdGridConsumptionTabs";
import { useEffect } from "react";

import { MuiTooltip } from "../Tooltip";
import { BsCalendar2Date } from "react-icons/bs";
import { IoCloseOutline, IoLinkOutline } from "react-icons/io5";
// import {file} from '../../assets/images/icons8-search.json'
import {
  DateRange,
  LocalizationProvider,
  StaticDateRangePicker,
} from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";


import { MyLottieAnimation } from "../Animation/animation";

const tableData: any[] = [];
const visitorData = [
  {
    id: 1,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
  {
    id: 2,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
  {
    id: 3,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
  {
    id: 4,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
  {
    id: 5,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
  {
    id: 6,
    name: "T#6 HSD Yard Tank#1",
    level1: "45",
    level2: "78",
    level3: "781",
    level4: "478",
  },
];
const columns: { key: string; name: string }[] = [
  // { key: "name", name: "ASSET" },
  // { key: "level1", name: "HSD Initial in Liter" },
  // { key: "level1", name: "HSD final in Liter" },
  // { key: "level1", name: "HSD Added in Liter" },
  // { key: "level1", name: "HSD Consumption - Liters" },
];

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<boolean>(false);
  const [customDatePopup, setCustomDatePopup] = useState<boolean>(false);
  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [activeGroupDateFilter, setActiveGroupDateFilter] =
    useState<string>("");
  const [dateValue, setDateValue] = useState<DateRange<Dayjs>>([null, null]);
  const [open, setOpen] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState("week");
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [selectedFilter, setSelectedFilter] = useState<any>("this week");

  const handleThisWeekFilter = () => {
    const currentDate = new Date();
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = getEndOfWeek(currentDate);

    const formattedStartDate = startOfWeek.toISOString().split("T")[0];
    const formattedEndDate = endOfWeek.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setSelectedFilter("this week");
  };
  useEffect(() => {
    handleThisWeekFilter();
  }, []);

  console.log("sai", selectedFilter);

  const handleLastWeekFilter = () => {
    const currentDate = new Date();
    const previousWeekStartDate = getStartOfWeek(currentDate);
    previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
    const previousWeekEndDate = getEndOfWeek(currentDate);
    previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);

    const formattedStartDate = previousWeekStartDate
      .toISOString()
      .split("T")[0];
    const formattedEndDate = previousWeekEndDate.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);

    setSelectedFilter("last week");
  };
  const handleLastSevenDaysFilter = () => {
    const currentDate = new Date();
    const lastSevenDaysStartDate = new Date(currentDate);
    lastSevenDaysStartDate.setDate(currentDate.getDate() - 6);
    const lastSevenDaysEndDate = new Date(currentDate);

    const formattedStartDate = lastSevenDaysStartDate
      .toISOString()
      .split("T")[0];
    const formattedEndDate = lastSevenDaysEndDate.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setSelectedFilter("last 7 days");
  };
  const getLastSixMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const lastSixMonthsStart = new Date(currentYear, currentMonth - 7, 1);
    const lastSixMonthsEnd = new Date(currentYear, currentMonth - 1, 0);

    const lastSixMonthsStartDate = lastSixMonthsStart
      .toISOString()
      .slice(0, 10);
    const lastSixMonthsEndDate = lastSixMonthsEnd.toISOString().slice(0, 10);

    setStartDate(lastSixMonthsStartDate);
    setEndDate(lastSixMonthsEndDate);
    setSelectedFilter("last six months");
  };
  const getLastThreeMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const lastThreeMonthsStart = new Date(currentYear, currentMonth - 4, 1);
    const lastThreeMonthsEnd = new Date(currentYear, currentMonth - 1, 0);

    const lastThreeMonthsStartDate = lastThreeMonthsStart
      .toISOString()
      .slice(0, 10);
    const lastThreeMonthsEndDate = lastThreeMonthsEnd
      .toISOString()
      .slice(0, 10);

    setStartDate(lastThreeMonthsStartDate);
    setEndDate(lastThreeMonthsEndDate);
    setSelectedFilter("last three months");
  };
  const getLastmonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0);

    const lastMonthStartDate = lastMonthStart.toISOString().slice(0, 10);
    const lastMonthEndDate = lastMonthEnd.toISOString().slice(0, 10);
    setStartDate(lastMonthStartDate);
    setEndDate(lastMonthEndDate);
    setSelectedFilter("last month");
  };
  const getThismonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const thisMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const thisMonthEnd = new Date(currentYear, currentMonth, 0);

    const thisMonthStartDate = thisMonthStart.toISOString().slice(0, 10);
    const thisMonthEndDate = thisMonthEnd.toISOString().slice(0, 10);

    setStartDate(thisMonthStartDate);
    setEndDate(thisMonthEndDate);
    setSelectedFilter("this month");
  };

  console.log("dateeee", startDate, endDate);

  const dateFilterData = [
    {
      diplayText: "Last 7 Days",
      value: "last 7 days",
      handler: handleLastSevenDaysFilter,
    },
    {
      diplayText: "This Week",
      value: "this week",
      handler: handleThisWeekFilter,
    },
    {
      diplayText: "Last Week",
      value: "last week",
      handler: handleLastWeekFilter,
    },
    {
      diplayText: "Last 30Days",
      value: "last 30days",
      handler: handleLastWeekFilter,
    },
    {
      diplayText: "This Month",
      value: "this month",
      handler: getThismonth,
    },
    {
      diplayText: "Last Month",
      value: "last month",
      handler: getLastmonth,
    },
    {
      diplayText: "Last Three Months",
      value: "last  three months",
      handler: getLastThreeMonths,
    },
    {
      diplayText: "Last Six Months",
      value: "last six months",
      handler: getLastSixMonths,
    },
  ];

  const groupFilterData = [
    {
      diplayText: "Week",
      value: "week",
    },
    {
      diplayText: "Month",
      value: "month",
    },
  ];

  const handleGroupByChange = (value: React.SetStateAction<string>) => {
    setGroupBy(value);
  };

  const onClickDateFilter = (filter: string) => {
    setActiveDateFilter(filter);
  };

  const onClickGroupDateFilter = (filter: string) => {
    setActiveGroupDateFilter(filter);
  };

  // const pmTeam= tower1ConsumptionDataFormate(data[7].pmTeam,"compelete")
  // const mAndE = tower1ConsumptionDataFormate(data[7].mAndE  ,"compelete")

  return (
    <div className="dashboard-container">
      <Header
        headerPath="DMR"
        nextPath=""
        profileVisible={true}
        isNavigate={false}
      />
      <div className="insights-filters-box">
        <div className="insights-filter-box"></div>
        <div className="insights-filter-box">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Export</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Export"
              className="export-filter-btn"
            >
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="Image">Image</MenuItem>
            </Select>
          </FormControl>
          <MuiTooltip title={<Typography>Date Filters </Typography>}>
            <IconButton
              onClick={() => setDateFilter(!dateFilter)}
              className="link-btn"
            >
              <BsCalendar2Date size={25} />
            </IconButton>
          </MuiTooltip>
          <Dialog maxWidth="lg" open={dateFilter}>
            <div className="dates-filter-pop-up">
              <div className="url-popup-header-box">
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Suisse Intl",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  <BsCalendar2Date size={25} />
                  Date Filters
                </Typography>
                <IconButton
                  onClick={() => setDateFilter(!dateFilter)}
                  className="btn"
                  type="button"
                >
                  <IoCloseOutline size={28} />
                </IconButton>
              </div>
              <MuiBox
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: "10px 0px 20px 0px",
                }}
                component={"ul"}
              >
                {dateFilterData.map((each) => (
                  <ListItemButton
                    sx={{
                      width: "31%",
                      border: "1px solid #0000001f",
                    }}
                    className={
                      activeDateFilter === each.diplayText
                        ? "date-filter-item date-filter-item-active"
                        : "date-filter-item"
                    }
                    onClick={
                      each.diplayText !== "Custom Date"
                        ? () => {
                            onClickDateFilter(each.diplayText);
                            setDateFilter(false);
                          }
                        : () => {
                            setCustomDatePopup(!customDatePopup);
                            onClickDateFilter(each.diplayText);
                          }
                    }
                  >
                    <ListItem
                      sx={{
                        diplay: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      key={each.value}
                      onClick={each.handler}
                    >
                      {each.diplayText}
                    </ListItem>
                  </ListItemButton>
                ))}
              </MuiBox>
              <hr />
              <br />
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: "Suisse Intl",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                <BsCalendar2Date size={25} />
                Grouping Filters
              </Typography>
              <MuiBox
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: "10px 0px 20px 0px",
                }}
                component={"ul"}
              >
                {groupFilterData.map((each) => (
                  <ListItemButton
                    sx={{
                      width: "31%",
                      border: "1px solid #0000001f",
                    }}
                    className={
                      activeGroupDateFilter === each.diplayText
                        ? "date-filter-item date-filter-item-active"
                        : "date-filter-item"
                    }
                    onClick={() => {
                      onClickGroupDateFilter(each.diplayText);
                      setDateFilter(false);
                    }}
                  >
                    <ListItem
                      sx={{
                        diplay: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      key={each.value}
                      onClick={() => {
                        handleGroupByChange(each.value);
                        setShowGroup(true);
                      }}
                    >
                      {each.diplayText}
                    </ListItem>
                  </ListItemButton>
                ))}
              </MuiBox>
            </div>
          </Dialog>
          <Dialog maxWidth="lg" open={customDatePopup}>
            <ClickAwayListener onClickAway={() => setCustomDatePopup(false)}>
              <div className="dates-filter-pop-up">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDateRangePicker
                    displayStaticWrapperAs="desktop"
                    value={dateValue}
                    onChange={(newValue) => {
                      setDateValue(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <MuiBox sx={{ mx: 2 }}> to </MuiBox>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>
              </div>
            </ClickAwayListener>
          </Dialog>
          <MuiTooltip title={<Typography>Generate URL</Typography>}>
            <IconButton
              onClick={() => setOpen(!open)}
              type="button"
              className="link-btn"
            >
              <IoLinkOutline size={25} />{" "}
            </IconButton>
          </MuiTooltip>
          <Dialog open={open} maxWidth="lg">
            <div className="url-popup-box">
              <div className="url-popup-header-box">
                <h2 className="url-popup-head-text">Generate URL</h2>

                <IconButton
                  onClick={() => setOpen(!open)}
                  className="btn"
                  type="button"
                >
                  <IoCloseOutline size={28} />
                </IconButton>
              </div>
              <div>
                <p className="url-popup-page-url-text">Page URL</p>
                <div className="url-box">
                  <p className="url-link-text">
                    https://preprod.helixsense.com//?gclid=EAIaIQobChMIuLWik
                    at_AIVRSQrCh0VhgtOEAAYASAAEgJz_PD_BwE
                  </p>
                </div>
              </div>
              <button type="button" className="apply-btn">
                Copy URL
              </button>
            </div>
          </Dialog>
        </div>
      </div>

      <div>
        <HDGridConsumptionTabs
          startDate={startDate}
          endDate={endDate}
          groupBy={groupBy}
          showGroup={showGroup}
          selectedFilter={selectedFilter}
         
        />

        <div className="visitor-container">
          <div className="pieDonutChart-container">
            <h1 className="visitor-summary">Visitor Summary</h1>
            <div className="pieDonutChart">
              <PieDonutChart
              chartData={[20, 47, 33]}
              labels={["First Phase", "Second Phase", "Third Phase"]}
              headingText={""}
              color={["#43AD40", "#262D5F", "#"]}
              tooltip={[]}
            />
              {/* <MyLottieAnimation /> */}
            </div>
          </div>
          <div className="table-visitor-details">
            <h1 className="table-visitor-details-header">Visitor Details</h1>
            <hr  className="hr-line"/>
            {/* <table>
            <thead>
              <tr>
                <th>Visitor type</th>
                <th>Name</th>
                <th>Bagde</th>
                <th>Employee</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((eachItem: any) => {
                return (
                  <>
                    <tr key={eachItem._id} className="">
                      <td>{eachItem.visitorType}</td>
                      <td>{eachItem.name}</td>
                      <td>{eachItem.bagde}</td>
                      <td>{eachItem.employee}</td>
                      <td>{eachItem.from}</td>
                      <td>{eachItem.to}</td>
                      <td>{eachItem.status}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table> */}

            <MyLottieAnimation />
          </div>
        </div>
        <div className="donutCharts-container">
          <div className="pieDonutChart-container">
            <h1 className="visitor-summary">Equipment Running Status</h1>
            <div className="pieDonutChart">
              <PieDonutChart
                chartData={[20, 47, 33]}
                labels={["PPM", "Incidents", "inceptions"]}
                headingText={""}
                color={["#43AD40", "#262D5F", "#3473BB"]}
                tooltip={[]}
              />
              {/* <MyLottieAnimation /> */}
            </div>
          </div>

          <div className="pieDonutChart-container">
            <h1 className="visitor-summary">Preventive Maintenance Summary</h1>
            <div className="pieDonutChart">
              <PieDonutChart
                chartData={[20, 47, 33]}
                labels={["First Phase", "Second Phase", "Third Phase"]}
                headingText={""}
                color={["#43AD40", "#1EBCC3", "#3473BB"]}
                tooltip={[]}
              />
              {/* <MyLottieAnimation />{" "} */}
            </div>
          </div>
          <div className="pieDonutChart-container">
            <h1 className="visitor-summary">Daily Inspection Summary</h1>
            <div className="pieDonutChart">
              <PieDonutChart
                chartData={[1, 2, 3]}
                labels={["pmTeam", "mAndE", "softService"]}
                headingText={""}
                color={["#43AD40", "#D8A620", "#BB4934"]}
                tooltip={[]}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
