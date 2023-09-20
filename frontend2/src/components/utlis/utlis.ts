export const dateFormates = (dateString: string | number | Date) => {
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

export const tower1ConsumptionDataFormate = (
  data: any,
  key: any,
  convert = false
) => {
  const resultData = data?.map((eachItem: any) => {
    if (convert) {
      return dateFormates(eachItem[key]);
    } else {
      return eachItem[key];
    }
  });

  return resultData;
};

export const capitalizeFun = (item: string) => {
  const result = item.replace(
    /^[a-z]|[A-Z]/g,
    (c, i) => (i ? " " : "") + c.toUpperCase()
  );
  return result;
};

export   const getLastMonth = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
  const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0);

  const lastMonthStartDate = lastMonthStart.toISOString().slice(0, 10);
  const lastMonthEndDate = lastMonthEnd.toISOString().slice(0, 10);

  return { startDate: lastMonthStartDate, endDate: lastMonthEndDate };
};

// export   const getThisMonth = () => {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1;

//   const thisMonthStart = new Date(currentYear, currentMonth - 1, 1);
//   const thisMonthEnd = new Date(currentYear, currentMonth, 0);

//   const thisMonthStartDate = thisMonthStart.toISOString().slice(0, 10);
//   const thisMonthEndDate = thisMonthEnd.toISOString().slice(0, 10);

//   return { startDate: thisMonthStartDate, endDate: thisMonthEndDate };
// };

export const getStartOfWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek;
};

export const getEndOfWeek = (date: Date) => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (6 - date.getDay())); // Assuming the week ends on Saturday
  return endOfWeek;
};

export const handleThisWeekFilter = (
  setStartDate: (arg0: string) => void,
  setEndDate: (arg0: string) => void
) => {
  const currentDate = new Date();
  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = getEndOfWeek(currentDate);

  const formattedStartDate = startOfWeek.toISOString().split("T")[0];
  const formattedEndDate = endOfWeek.toISOString().split("T")[0];

  setStartDate(formattedStartDate);
  setEndDate(formattedEndDate);
};

export const handleLastWeekFilter = (
  setStartDate: (arg0: string) => void,
  setEndDate: (arg0: string) => void
) => {
  const currentDate = new Date();
  const previousWeekStartDate = getStartOfWeek(currentDate);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
  const previousWeekEndDate = getEndOfWeek(currentDate);
  previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);

  const formattedStartDate = previousWeekStartDate.toISOString().split("T")[0];
  const formattedEndDate = previousWeekEndDate.toISOString().split("T")[0];

  setStartDate(formattedStartDate);
  setEndDate(formattedEndDate);
};

export const handleLastSevenDaysFilter = (
  setStartDate: (arg0: string) => void,
  setEndDate: (arg0: string) => void
) => {
  const currentDate = new Date();
  const lastSevenDaysStartDate = new Date(currentDate);
  lastSevenDaysStartDate.setDate(currentDate.getDate() - 6);
  const lastSevenDaysEndDate = new Date(currentDate);

  const formattedStartDate = lastSevenDaysStartDate.toISOString().split("T")[0];
  const formattedEndDate = lastSevenDaysEndDate.toISOString().split("T")[0];

  setStartDate(formattedStartDate);
  setEndDate(formattedEndDate);
};

 export function diagonsis(data: any[][]) {
  const result :any[] = [];
  data[0]?.forEach((obj: { [x: string]: any; date?: any; }) => {
    const matchingObj = data[1].find((item: { date: string; }) => {
      const isoDateString1 = item.date.replace(" ", "T") + "+00:00";

      const isoDateString2 = obj.date?.replace(" ", "T") + "+00:00";

      const itemDate = new Date(isoDateString1);

      const objDate = new Date(isoDateString2);

      let lastweek = itemDate.getUTCDate() - 7;
      return (
        itemDate.getUTCDate() === objDate.getUTCDate() ||
        objDate.getUTCDate() === lastweek
      );
    });

    if (matchingObj !== undefined) {
      const entry: any = {};

      Object.keys(obj).forEach((key) => {
        if (key !== "date") {
          const currentValue = matchingObj[key];

          const previousValue = obj[key];

          const percentageChange =
            ((currentValue - previousValue) / previousValue) * 100;

          if (percentageChange > 0) {
            entry[key] = `${percentageChange.toFixed(2)}% increase`;
          } else if (percentageChange < 0) {
            entry[key] = `${Math.abs(percentageChange).toFixed(2)}% decrease`;
          } else {
            entry[key] = "no change";
          }
        }
      });

      entry["date"] = matchingObj["date"].replace("T", " ").replace("Z", "");

      result.push(entry);
    }
  });
  return result;
}

export function capitalize(s: string | any[])
{
    return s && s[0].toUpperCase() + s.slice(1);
}


export const hostName = "http://localhost:8081"