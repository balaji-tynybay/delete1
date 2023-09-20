import React from "react";
import { barFilterItems } from "../components/Settings/settingsComponents/helpDesk";
import { DependentFilterItemsType } from "../types/app/types";

const AppContext = React.createContext({
  isSidebarClose: false,
  isFullScreen: false,
  activeDateFilter: {
    barOne: {
      id: 0,
      value: "",
    },
    barTwo: {
      id: 0,
      value: "",
    },
    barThree: {
      id: 0,
      value: "",
      
    },
  },
  comparisonSheetFiltersItems: [] as DependentFilterItemsType,
  handleSidebarPositon: () => {},
  handleFullScreen: () => {},
  onClickBarOneItem: (item: string, filterId: number, itemId: number) => {},
});

export default AppContext;
