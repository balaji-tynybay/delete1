import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import AppContext from "./context/appContext";
import { barFilterItems } from "./components/Settings/settingsComponents/helpDesk";
import AppRoutes from "./appRoutes";
import { DependentFilterItemsType } from "./types/app/types";

const initialFilterValues = [
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
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#0B694C",
    },
  },
});

function App() {

  const [isSidebarClose, setisSidebarClose] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [activeDateFilter, setActiveDateFilter] = useState({
    barOne: {
      id: barFilterItems[0].id,
      value: "",
    },
    barTwo: {
      id: barFilterItems[0].id,
      value: "",
    },
    barThree: {
      id: barFilterItems[0].id,
      value: "",
    },
  });

  const [comparisonSheetFiltersItems, setComparisonSheetFiltersItems] =
    useState<DependentFilterItemsType>(initialFilterValues);

  const handleSidebarPositon = () => {
    setisSidebarClose(!isSidebarClose);
  };

  const onClickBarOneItem = (
    item: string,
    filterId: number,
    itemId: number
  ) => {
    if (filterId === 1) {
      setActiveDateFilter((prev) => ({
        ...prev,
        barOne: {
          id: itemId,
          value: item,
        },
      }));
    } else if (filterId === 2) {
      setActiveDateFilter((prev) => ({
        ...prev,
        barTwo: {
          id: itemId,
          value: item,
        },
      }));
    } else if (filterId === 3) {
      setActiveDateFilter((prev) => ({
        ...prev,
        barThree: {
          id: itemId,
          value: item,
        },
      }));
    }
  };
  console.log(activeDateFilter);

  // useEffect(() => {
  //   const kc = Keycloak("/public/keycloak.json");
  //   kc.init({ onLoad: "login-required" }).then((authenticated: any) => {
  //     authenticated(authenticated);
  //     Keycloak(kc);
  //     if (authenticated) localStorage.setItem("accessToken", kc.token);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (keycloak !== null) {
  //     // getApps();
  //     getUserData();
  //   }

  // }, [keycloak]);

  useEffect(() => {
    if (activeDateFilter.barOne.id <= 5) {
      setComparisonSheetFiltersItems(
        barFilterItems.filter((eachItem) => eachItem.id <= 5)
      );
    } else if (
      activeDateFilter.barOne.id > 5 &&
      activeDateFilter.barOne.id <= 9
    ) {
      setComparisonSheetFiltersItems(
        barFilterItems.filter((eachItem) => {
          return eachItem.id > 5 && eachItem.id <= 9;
        })
      );
    } else if (
      activeDateFilter.barOne.id > 9 &&
      activeDateFilter.barOne.id <= 12
    ) {
      setComparisonSheetFiltersItems(
        barFilterItems.filter((eachItem) => {
          return eachItem.id > 9 && eachItem.id <= 12;
        })
      );
    } else {
      setComparisonSheetFiltersItems(
        barFilterItems.filter((eachItem) => {
          return eachItem.id > 12 && eachItem.id <= 14;
        })
      );
    }
  }, [activeDateFilter]);

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <BrowserRouter>
      <AppContext.Provider
        value={{
          isSidebarClose,
          handleSidebarPositon,
          activeDateFilter,
          comparisonSheetFiltersItems,
          onClickBarOneItem,
          isFullScreen,
          handleFullScreen,
        }}
      >
        <ThemeProvider theme={theme}>
          <AppRoutes />
        </ThemeProvider>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
