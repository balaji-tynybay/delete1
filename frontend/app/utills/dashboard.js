const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");


 Descriptive = (data) => {
  // Get the keys of the first object in the array
  if (data[0] !== undefined) {
    const keys = Object.keys(data[0]);
   
    // Initialize empty objects for each calculation
    const minValues = {};
    const maxValues = {};
    const standardDeviations = {};
    const medians = {};
    const mean = {};

    // Loop through each key and perform the required calculation
    keys.forEach((key) => {
      const values = data.map((obj) => obj[key]);
      const numericValues = values.map(value => parseFloat(value));
      minValues[key] = Math.min(...numericValues);
      maxValues[key] = Math.max(...numericValues);
      standardDeviations[key] = calculateStandardDeviation(numericValues);
      medians[key] = calculateMedian(numericValues);
      mean[key] = calculateMean(numericValues);
    });

    // Helper function to calculate standard deviation
    function calculateStandardDeviation(values) {
      const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
      const variance =
        values.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
        (values.length - 1);
      return Math.sqrt(variance);
    }
    // Helper function to calculate mean
    function calculateMean(values) {
      let sum = 0;
      let count = 0;
    
      for (const value of values) {
        const numericValue = parseFloat(value);
        
        if (!isNaN(numericValue)) {
          sum += numericValue;
          count++;
        }
      }
    
      if (count === 0) {
        return 0; // or handle the case when all values are invalid
      }
    
      const mean = sum / count;
      return mean;
    }
    // Helper function to calculate median
    function calculateMedian(values) {
      values.sort((a, b) => a - b);
      const mid = Math.floor(values.length / 2);
      return values.length % 2 !== 0
        ? values[mid]
        : (values[mid - 1] + values[mid]) / 2;
    }

    const result = {
      MinimumValues: minValues,
      MaximumValue: maxValues,
      StandardDeviations: standardDeviations,
      Medians: medians,
      Means: mean,
    };

    return [result];
  } else {
    return [];
  }
};

 prediction = async (data, params, callback) => {
 
  if (data.length !== 0) {
    const newData = data.map(({ date, consumption }) => ({
      date,
      consumption,
    }));

    
    let rawData = newData;
    let predictType = params.predictType;
    let predictPeriod = params.predictPeriod;

    try {
      let data1 = { data: rawData };
      data1 = JSON.stringify(data1);

     
      
      let python = spawn("python3", [
        path.join(process.cwd(), "./", "scripts/dashboard.py"),
        data1,
        predictType,
        predictPeriod,
      ]);

      let dataToSend = {};
      python.stdout.on("data", async function (data) {
        
        dataToSend = data.toString("utf-8");
      });

      const rep = await new Promise((resolve) => {
        python.on("close", async (code) => {
          console.log(`child process close all stdio with code ${code}`);
          resolve(callback(dataToSend));
        });
      });


      
      return JSON.parse(rep.replace(/'/g, '"'));

      // Access the dataToSend variable here (it will be an empty string until data is received)
      function callback(data) {
        // console.log("hiiiiiiiiiiiiiii",data)
        return data;
      }

      // return  predictDatarep
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }else{
    return [];
  }
};

 countConsumption = (data, conditions,setDate) => {

const currentDate = new Date(setDate).getTime();
const next7Days = currentDate + (7 * 24 * 60 * 60 * 1000);


const filteredData = data.filter(row => {
  const date = new Date(row.date).getTime();
  return date >= currentDate && date <= next7Days;
});

  
  const values = [];
  const operators = {
    "<": (a, b) => a < b,
    ">": (a, b) => a > b,
    "<=": (a, b) => a <= b,
    ">=": (a, b) => a >= b,
  };

  
  let count = filteredData.reduce((acc, obj) => {
    const conditionMet = conditions.every(({ operator, limit }) => {
      return operators[operator](obj.consumption, limit);
    });

    if (conditionMet) {
      values.push(obj.consumption);
      return acc + 1;
    }
    return acc;
  }, 0);

  
  return {
    count,
    values,
  };
};

// const consumptionLimit = 98000;
// const operator = "<=";
// const result = countConsumption(data, consumptionLimit, operator);
// console.log(`Number of objects meeting the condition: ${result.count}`);
// console.log(`Dates of objects meeting the condition: ${result.matchingDates.join(", ")}`);

// // Helixapp_autodeploy_nodejs\scripts\dashborad.py


module.exports = {
  Descriptive,
  prediction,
  countConsumption
};