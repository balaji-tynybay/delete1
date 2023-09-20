import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

import FormControlLabel from "@mui/material/FormControlLabel";
import { IoIosArrowDown } from "react-icons/io";
import AppContext from "../../../../context/appContext";
import {
  BarFilterItemsType,
  CardFilterItemsType,
  GraphItemsType,
  TicketItemsType,
} from "../../../../types/settings/types";

import "./styles.css";

const cardsFilterItems: CardFilterItemsType = [
  {
    displayText: "Total Tickets",
    isChecked: false,
  },
  {
    displayText: "Tickets Within SLA",
    isChecked: false,
  },
  {
    displayText: "SLA Elapsed",
    isChecked: false,
  },
  {
    displayText: "Closed Tickets",
    isChecked: false,
  },
  {
    displayText: "Open Tickets",
    isChecked: false,
  },
  {
    displayText: "On Hold Tickets",
    isChecked: false,
  },
];

export const barFilterItems: BarFilterItemsType = [
  {
    displayText: "Today",
    id: 1,
  },
  {
    displayText: "Yesterday",
    id: 2,
  },
  {
    displayText: "This time last week",
    id: 3,
  },
  {
    displayText: "This time last month",
    id: 4,
  },
  {
    displayText: "This time last year",
    id: 5,
  },
  {
    displayText: "Last week",
    id: 6,
  },
  {
    displayText: "This week",
    id: 7,
  },
  {
    displayText: "This week last month",
    id: 8,
  },
  {
    displayText: "This week last year",
    id: 9,
  },
  {
    displayText: "This month",
    id: 10,
  },
  {
    displayText: "Last month",
    id: 11,
  },
  {
    displayText: "This month last year",
    id: 12,
  },
  {
    displayText: "This year",
    id: 13,
  },
  {
    displayText: "Last year",
    id: 14,
  },
];

const graphsItems: GraphItemsType = [
  {
    displayText: "Tickets",
    isChecked: false,
  },
  {
    displayText: "Avg. service response time",
    isChecked: false,
  },
  {
    displayText: "Open Tickets",
    isChecked: false,
  },
  {
    displayText: "Avg. service response time",
    isChecked: false,
  },
  {
    displayText: "Closed Tickets",
    isChecked: false,
  },
  {
    displayText: "On Hold Tickets",
    isChecked: false,
  },
];

const ticketItems: TicketItemsType = [
  {
    displayText: "Normal",
    isChecked: false,
  },
  {
    displayText: "High",
    isChecked: false,
  },
  {
    displayText: "Low",
    isChecked: false,
  },
  {
    displayText: "Critical",
    isChecked: false,
  },
  {
    displayText: "Standard",
    isChecked: false,
  },
];

const SettingsHelpDesk: React.FC = () => {
  const [cardsFiterData, setCardsFilterData] = useState(cardsFilterItems);
  const [graphFilterData, setGraphFilterData] = useState(graphsItems);
  const [ticketFilterData, setTicketFilterData] = useState(ticketItems);
  const [datesFilter, setDatesFilter] = useState({
    barOne: false,
    barTwo: false,
    barThree: false,
  });

  const handleDateFilter = (id: number, value: boolean) => {
    if (id === 1) {
      setDatesFilter((prev) => ({ ...prev, barOne: value }));
    } else if (id === 2) {
      setDatesFilter((prev) => ({ ...prev, barTwo: value }));
    } else if (id === 3) {
      setDatesFilter((prev) => ({ ...prev, barThree: value }));
    }
  };

  const onClickCardsSelectAll = () => {
    setCardsFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: true }))
    );
  };

  const onClickCardsClearAll = () => {
    setCardsFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: false }))
    );
  };

  const onClickGraphSelectAll = () => {
    setGraphFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: true }))
    );
  };

  const onClickGraphClearAll = () => {
    setGraphFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: false }))
    );
  };

  const onClickTicketsSelectAll = () => {
    setTicketFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: true }))
    );
  };

  const onClickTicketsClearAll = () => {
    setTicketFilterData((prev) =>
      prev.map((each) => ({ ...each, isChecked: false }))
    );
  };

  return (
    <AppContext.Consumer>
      {(contextValue) => (
        <div className="settings-help-desk-box">
          <div className="settings-help-desk-header">
            <h1 className="settings-head-text">Helpdesk settings</h1>
            <p className="settings-description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>
          <div className="settings-cards-box">
            <p className="sub-setting-head-text">No of cards displayed</p>
            <p className="sub-setting-description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt
            </p>
            <div>
              <button
                type="button"
                onClick={onClickCardsSelectAll}
                className="setting-select-all-btn"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={onClickCardsClearAll}
                className="setting-clear-all-btn"
              >
                Clear all
              </button>
            </div>
            <div className="settings-cards-box-inner">
              {cardsFiterData.map((each, index) => (
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  labelPlacement="start"
                  control={
                    <Checkbox
                      onChange={(e) =>
                        setCardsFilterData([
                          ...cardsFiterData.map((obj, i) =>
                            i === index
                              ? { ...obj, isChecked: e.target.checked }
                              : obj
                          ),
                        ])
                      }
                      checked={each.isChecked}
                    />
                  }
                  label={each.displayText}
                />
              ))}
            </div>
          </div>
          <div className="settings-cards-box">
            <p className="sub-setting-head-text">
              Comparison sheet default view by
            </p>
            <p className="sub-setting-description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>
          <div className="settings-cards-box">
            <p className="sub-setting-head-text">
              Comparison sheet default view by dates
            </p>
            <div className="dates-filter-outer-box">
              <div className="dates-filter-inner-box">
                <p className="settings-filter-rating-text">Bar chart 1</p>

                <FormControl size="small" sx={{ minWidth: 135 }}>
                  <InputLabel id="comparison-filter-one">
                    Select date
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    label="Select date"
                    // onChange={handleChange}
                  >
                    {barFilterItems.map((each, i) => (
                      <MenuItem
                        onClick={() => {
                          contextValue.onClickBarOneItem(
                            each.displayText,
                            1,
                            i + 1
                          );
                        }}
                        value={each.displayText}
                        key={i}
                      >
                        {each.displayText}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <p className="vs-text">Vs</p>
              <div className="dates-filter-inner-box">
                <p className="settings-filter-rating-text">Bar chart 2</p>

                <FormControl size="small" sx={{ minWidth: 135 }}>
                  <InputLabel id="comparison-filter-one">
                    Select date
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    label="Select date"
                    // onChange={handleChange}
                  >
                    {contextValue.comparisonSheetFiltersItems.map((each, i) => (
                      <MenuItem
                        onClick={() => {
                          contextValue.onClickBarOneItem(
                            each.displayText,
                            2,
                            i + 1
                          );
                        }}
                        value={each.displayText}
                        key={i}
                      >
                        {each.displayText}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <p className="vs-text">Vs</p>
              <div className="dates-filter-inner-box">
                <p className="settings-filter-rating-text">Bar chart 3</p>

                <FormControl size="small" sx={{ minWidth: 135 }}>
                  <InputLabel id="comparison-filter-one">
                    Select date
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    label="Select date"
                    // onChange={handleChange}
                  >
                    {contextValue.comparisonSheetFiltersItems.map((each, i) => (
                      <MenuItem
                        onClick={() => {
                          contextValue.onClickBarOneItem(
                            each.displayText,
                            3,
                            i + 1
                          );
                        }}
                        value={each.displayText}
                        key={i}
                      >
                        {each.displayText}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="settings-cards-box">
            <p className="sub-setting-head-text">No of graphs displayed</p>
            <p className="sub-setting-description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt
            </p>
            <div>
              <button
                type="button"
                onClick={onClickGraphSelectAll}
                className="setting-select-all-btn"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={onClickGraphClearAll}
                className="setting-clear-all-btn"
              >
                Clear all
              </button>
            </div>
            <div className="settings-cards-box-inner">
              {graphFilterData.map((each, index) => (
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  labelPlacement="start"
                  control={
                    <Checkbox
                      onChange={(e) =>
                        setGraphFilterData([
                          ...graphFilterData.map((obj, i) =>
                            i === index
                              ? { ...obj, isChecked: e.target.checked }
                              : obj
                          ),
                        ])
                      }
                      checked={each.isChecked}
                    />
                  }
                  label={each.displayText}
                />
              ))}
            </div>
          </div>
          <div className="settings-cards-box">
            <p className="sub-setting-head-text">Tickets by priority</p>
            <p className="sub-setting-description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt
            </p>
            <div>
              <button
                type="button"
                onClick={onClickTicketsSelectAll}
                className="setting-select-all-btn"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={onClickTicketsClearAll}
                className="setting-clear-all-btn"
              >
                Clear all
              </button>
            </div>
            <div className="settings-cards-box-inner">
              {ticketFilterData.map((each, index) => (
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  labelPlacement="start"
                  control={
                    <Checkbox
                      onChange={(e) =>
                        setTicketFilterData([
                          ...ticketFilterData.map((obj, i) =>
                            i === index
                              ? { ...obj, isChecked: e.target.checked }
                              : obj
                          ),
                        ])
                      }
                      checked={each.isChecked}
                    />
                  }
                  label={each.displayText}
                />
              ))}
            </div>
          </div>
          <div className="settings-cards-box">
            <button type="button" className="cancel-btn">
              Reset
            </button>
            <button type="button" className="apply-btn">
              Save
            </button>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
};

export default SettingsHelpDesk;
