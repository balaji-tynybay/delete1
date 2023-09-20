const moment = require("moment");
const fs = require("fs");


// function groupDataByDate1(data) {
//   let result = [];
  
//   let groupedByDate = data.reduce(function (acc, obj) {
//     let date = obj.date.split(" ")[0];
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(obj);
//     return acc;
//   }, {});

  
//   for (let date in groupedByDate) {
//     let objs = groupedByDate[date];
//     let sum = objs.reduce(function (acc, obj) {
//       return acc + obj.value;
//     }, 0);
//     let avg = sum / objs.length;
//     let obj = {
//       date: moment(date).format("YYYY-MM-DD"),
//       value: avg,
//       equipment_id: objs[0].equipment_id,
//       id: objs[0].id,
//       reading_id: objs[0].reading_id,
//     };
//     result.push(obj);
//   }
//   return result;
// }

function groupDataByDate(rawData) {
  
  const data = rawData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const groupedData = data.reduce((acc, cur) => {
    let date = cur.date.split(' ')[0]; // extract the date from the date string
    if (!acc[moment(date).format("YYYY-MM-DD")]) {
    acc[moment(date).format("YYYY-MM-DD")] = [];
    }
    acc[moment(date).format("YYYY-MM-DD")].push(cur);
    return acc;
  },{} );
  
  return groupedData;
}

function groupDataByHour(rawData) {
  const data = rawData.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const groupedData = data.reduce((acc, cur) => {
    let dateTime = cur.date; // Assuming 'date' contains both date and time information
    let hour = moment(dateTime).format("YYYY-MM-DD HH"); // Extract the hour from the dateTime string
    
    if (!acc[hour]) {
      acc[hour] = [];
    }
    
    acc[hour].push(cur);
    return acc;
  }, {});

  return groupedData;
}


function groupDataByWeek(data) {
  const result = [];
  const sortedData = data.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  let groupStartDate = null;
  let groupEndDate = null;
  let initialReadings = [];
  let finalReadings = [];
  let consumptions = [];
  let diffInKwhs = [];
  let co2 = [];
  let meterFactor = null;

  sortedData.forEach((item, index) => {
    const currentDate = moment(item.date);
    const nextItem = sortedData[index + 1];
    const isSameWeek = nextItem && moment(nextItem.date).isoWeek() === currentDate.isoWeek();

    if (groupStartDate === null) {
      groupStartDate = currentDate.clone().startOf('isoWeek');
    }

    if (!isSameWeek) {
      groupEndDate = currentDate.clone().endOf('isoWeek');
      initialReadings.push(item.initialReading);
      finalReadings.push(item.finalReading);
      consumptions.push(item.consumption);
      meterFactor = item.meterFactor;

      if (item?.diffInKwh || item?.co2) {
              diffInKwhs.push(item.diffInKwh);
              co2.push(item.co2);
            }

      const initialReadingAvg = calculateAverage(initialReadings);
      const finalReadingAvg = calculateAverage(finalReadings);
      const consumptionAvg = calculateAverage(consumptions);


      let diffInKwhsAvg = '';
            if (diffInKwhs.length !== 0||co2.length !== 0) {
              diffInKwhsAvg = calculateAverage(diffInKwhs); 
              co2 = calculateAverage(co2); 
            }
      
      const group = {
        startDate: groupStartDate.format('YYYY-MM-DD'),
        endDate: groupEndDate.format('YYYY-MM-DD'),
        initialReading: initialReadingAvg,
        finalReading: finalReadingAvg,
        consumption: consumptionAvg,
        meterFactor: meterFactor
      };

      if (diffInKwhsAvg !== ''||co2 !== '') {
                group.diffInKwh = diffInKwhsAvg;
                group.co2 = co2;
              }

      result.push(group);

      groupStartDate = null;
      groupEndDate = null;
      initialReadings = [];
      finalReadings = [];
      consumptions = [];
      diffInKwhs = [];
      co2 = [];
    }

    initialReadings.push(item.initialReading);
    finalReadings.push(item.finalReading);
    consumptions.push(item.consumption);
    meterFactor = item.meterFactor;
  });


    const filteredResponse = result.map(obj => {
    const filteredEntries = Object.entries(obj)
      .filter(([key, value]) => key === 'startDate' || key === 'endDate' || !isNaN(value)&& (value !== '' && (!Array.isArray(value) || value.length > 0)));
    return Object.fromEntries(filteredEntries);
  });

  
  filteredResponse[0].startDate = moment(sortedData[0].date).format('YYYY-MM-DD');
  filteredResponse[filteredResponse.length - 1].endDate = moment(sortedData[sortedData.length - 1].date).format('YYYY-MM-DD');
  // console.log(filteredResponse)
  return filteredResponse;
  // return result;
}

function calculateAverage(values) {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function groupData(data, groupingType) {
  const result = [];
  const sortedData = data.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  let groupStartDate = null;
  let groupEndDate = null;
  let initialReadings = [];
  let finalReadings = [];
  let consumptions = [];
  let diffInKwhs = [];
  let co2 = [];
  let meterFactor = null;

  sortedData.forEach((item, index) => {
    const currentDate = moment(item.date);
    const nextItem = sortedData[index + 1];
    const isSameWeek = nextItem && moment(nextItem.date).isoWeek() === currentDate.isoWeek();
    const isSameMonth = nextItem && moment(nextItem.date).month() === currentDate.month();

    if (groupStartDate === null) {
      if (groupingType === 'week') {
        groupStartDate = currentDate.clone().startOf('isoWeek');
      } else if (groupingType === 'month') {
        groupStartDate = currentDate.clone().startOf('month');
      }
    }

    if ((!isSameWeek && groupingType === 'week') || (!isSameMonth && groupingType === 'month')) {
      if (groupEndDate === null) {
        if (groupingType === 'week') {
          groupEndDate = currentDate.clone().endOf('isoWeek');
        } else if (groupingType === 'month') {
          groupEndDate = currentDate.clone().endOf('month');
        }
      }

      initialReadings.push(item.initialReading);
      finalReadings.push(item.finalReading);
      consumptions.push(item.consumption);
      meterFactor = item.meterFactor;

      if (item.diffInKwh !== '' || item.co2.length > 0) {
        diffInKwhs.push(item.diffInKwh);
        co2.push(item.co2);
      }

      const initialReadingAvg = calculateAverage(initialReadings);
      const finalReadingAvg = calculateAverage(finalReadings);
      const consumptionAvg = calculateAverage(consumptions);
      let diffInKwhsAvg = '';
      let co2Avg = '';

      if (diffInKwhs.length !== 0 || co2.length !== 0) {
        diffInKwhsAvg = calculateAverage(diffInKwhs);
        co2Avg = calculateAverage(co2);
      }

      const group = {
        startDate: groupStartDate.format('YYYY-MM-DD'),
        endDate: groupEndDate.format('YYYY-MM-DD'),
        initialReading: initialReadingAvg,
        finalReading: finalReadingAvg,
        consumption: consumptionAvg,
        meterFactor: meterFactor
      };

      if (diffInKwhsAvg !== '') {
        group.diffInKwh = diffInKwhsAvg;
      }
      if (co2Avg !== '') {
        group.co2 = co2Avg;
      }

      result.push(group);

      groupStartDate = null;
      groupEndDate = null;
      initialReadings = [];
      finalReadings = [];
      consumptions = [];
      diffInKwhs = [];
      co2 = [];
    }

    initialReadings.push(item.initialReading);
    finalReadings.push(item.finalReading);
    consumptions.push(item.consumption);
    meterFactor = item.meterFactor;
  });

  const filteredResponse = result.map(obj => {
    const filteredEntries = Object.entries(obj)
      .filter(([key, value]) => key === 'startDate' || key === 'endDate' || !isNaN(value) && (value !== '' && (!Array.isArray(value) || value.length > 0)));
    return Object.fromEntries(filteredEntries);
  });

  
  if(filteredResponse[0]?.startDate!== undefined && filteredResponse[filteredResponse.length - 1]?.endDate!==undefined){
  filteredResponse[0].startDate = moment(sortedData[0].date).format('YYYY-MM-DD');
  filteredResponse[filteredResponse.length - 1].endDate = moment(sortedData[sortedData.length - 1].date).format('YYYY-MM-DD');
}
  return filteredResponse;
}

function calculateTotalConsumption(data) {
  const result = [];

  // Get all unique start dates
  const startDates = Array.from(
    new Set(
      data.consumptionFlushingWaterTankData
        .map(obj => obj.startDate)
        .concat(data.consumptionSTPWaterTankData.map(obj => obj.startDate))
        .concat(data.consumptionDomesticWaterTankData.map(obj => obj.startDate))
        .concat(data.consumptionWTPWaterTankData.map(obj => obj.startDate))
        .concat(data.consumptionFireWaterTankData.map(obj => obj.startDate))
    )
  );

  // Iterate over start dates
  for (const startDate of startDates) {
    // Initialize variables for summing consumption values
    let totalConsumptionFlushingWaterTank = 0;
    let totalConsumptionSTPWaterTank = 0;
    let totalConsumptionDomesticWaterTank = 0;
    let totalConsumptionWTPWaterTank = 0;
    let totalConsumptionFireWaterTank = 0;

    // Iterate over consumptionFlushingWaterTankData array
    for (const obj of data.consumptionFlushingWaterTankData) {
      if (obj.startDate === startDate) {
        totalConsumptionFlushingWaterTank += obj.consumption;
      }
    }

    // Iterate over consumptionSTPWaterTankData array
    for (const obj of data.consumptionSTPWaterTankData) {
      if (obj.startDate === startDate) {
        totalConsumptionSTPWaterTank += obj.consumption;
      }
    }

    // Iterate over consumptionDomesticWaterTankData array
    for (const obj of data.consumptionDomesticWaterTankData) {
      if (obj.startDate === startDate) {
        totalConsumptionDomesticWaterTank += obj.consumption;
      }
    }

    // Iterate over consumptionWTPWaterTankData array
    for (const obj of data.consumptionWTPWaterTankData) {
      if (obj.startDate === startDate) {
        totalConsumptionWTPWaterTank += obj.consumption;
      }
    }

    // Iterate over consumptionFireWaterTankData array
    for (const obj of data.consumptionFireWaterTankData) {
      if (obj.startDate === startDate) {
        totalConsumptionFireWaterTank += obj.consumption;
      }
    }

    // Calculate the sum of all the consumption values
    const totalConsumptionSum =
      totalConsumptionFlushingWaterTank +
      totalConsumptionSTPWaterTank +
      totalConsumptionDomesticWaterTank +
      totalConsumptionWTPWaterTank +
      totalConsumptionFireWaterTank;

    // Create a new object with the start date, individual consumption values, and the sum
    const totalConsumptionObj = {
      startDate: startDate,
      totalConsumptionFlushingWaterTank,
      totalConsumptionSTPWaterTank,
      totalConsumptionDomesticWaterTank,
      totalConsumptionWTPWaterTank,
      totalConsumptionFireWaterTank,
      totalConsumptionSum
    };

    // Add the new object to the result array
    result.push(totalConsumptionObj);
  }

  return result;
}


// Search function
function search(query, data) {
  const searchTerm = query.toLowerCase();
  const results = data.filter(obj => {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
        return true;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
      }
    }
    return false;
  });
  return results;
}





module.exports =  {groupDataByDate,groupDataByWeek,groupData,groupDataByHour,calculateTotalConsumption,search}