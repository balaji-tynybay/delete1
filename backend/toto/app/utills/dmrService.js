const axios = require("axios");
const FormData = require("form-data");
const moment = require("moment");
const fs = require('fs');
const { createExcell } = require("./excel.js");
const { Descriptive, prediction, countConsumption } = require("./dashboard.js");
const { groupDataByDate, groupData, groupDataByHour, search } = require("./group.js");
const { callApi ,helixsensecallApi} = require("./apiCall.js");
const { Console } = require("console");
const db = require("../dmr/model/index.js");
const querystring = require('querystring');


const triggerSchemas = db.triggerSchemas;
const HelpDesk  = db.HelpDesk;

// import('node-fetch').then(({ default: fetch }) => fetch(...args));
// import file  from  './DMR-temp.xls'
const getToken = async () => {
  const data = new FormData();
  data.append("grant_type", "password");
  data.append("username", "adming2@helixsense.com");
  data.append("password", "12345678");
  data.append("client_id", "clientkey");
  data.append("client_secret", "clientsecret");

  const res = await axios.post(
    // "https://warehouse-dev.helixsense.com/api/authentication/oauth2/token",
    "https://api-demo-v3.helixsense.com/api/authentication/oauth2/token",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    }
  );
  return res.data;
};

const helixsenseGetToken = async () => {
  const dataToSend = {
    grant_type: 'password',
    username: 'helix',
    password: 'helix',
    client_id: 'react-app',
  };

  // Convert the data to x-www-form-urlencoded format
  const formData = querystring.stringify(dataToSend);
  
  const res = await axios.post(
    "http://20.51.245.39:8080/auth/realms/Dashboard/protocol/openid-connect/token",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 60000,
    }
  );

  console.log(res.data);
  return res.data;
};



const cosumptionCalculation = (data, meterFactor, date) => {
 
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  let initialReading = {
    value: ""
  };
  let FinalReading = {
    value: ""
  };
  // console.log("--dta--",data);

  data?.length && data?.map((dt) => {
    if (
      moment(dt?.date).format("YYYY-MM-DD") ===
      moment(date.currentDate).format("YYYY-MM-DD")
    ) {
      if (!FinalReading?.value) {
        FinalReading = dt;
      } else {
        if (moment(dt.date).format() > moment(FinalReading.date).format) {
          FinalReading = dt;
        }
      }
    } else if (
      moment(dt.date).format("YYYY-MM-DD") ===
      moment(date.prevDate).format("YYYY-MM-DD")
    ) {
      if (!initialReading?.value) {
        initialReading = dt;
      } else {
        if (moment(dt.date).format() < moment(initialReading.date).format) {
          initialReading = dt;
        }
      }
    }
  });
  let consumption = meterFactor ? (FinalReading.value - initialReading.value) * meterFactor : FinalReading.value - initialReading.value
  let obj = {
    initialReading: initialReading.value === "" ? "No Reading" : initialReading.value,
    finalReading: FinalReading.value === "" ? "No Reading" : FinalReading.value,
    consumption: consumption,
    meterFactor: meterFactor
  }
  return obj;
}

const consumptionCalculation1 = (data, meterFactor) => {
  let output = [];

  
  for (let i = 0; i < data.length-1; i++) {
    let initialReading = data[i+1];
    let finalReading = data[i];

    let consumption = meterFactor ? (Number(finalReading.value)  - Number(initialReading.value)) * meterFactor : Number(finalReading.value) - Number(initialReading.value)
    let co2 =  (Number(consumption) * Number(0.85) )
   
    output.push({
      date: data[i].date,
      initialReading: initialReading.value,
      finalReading: finalReading.value,
      consumption: consumption,
      meterFactor: meterFactor,
      co2:co2
    });
  }

  let rep = output.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return rep;
};

const consumptionData = (data,meterFactor)=>{
  
  let initialReading = {
    value: 0
  };
  let FinalReading = {
    value: 0
  };;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      let dt1 = data[i][j];
      if (!FinalReading?.value) {
        FinalReading = dt1;
      } else if (!initialReading?.value) {
        initialReading = dt1;
      } else {
        if (moment(dt1.date).format() > moment(FinalReading.date).format()) {
          FinalReading = dt1;
        } else if (moment(dt1.date).format() < moment(initialReading.date).format()) {
          initialReading = dt1;
        }
      }
    }
  }
  
    
    let consumption = meterFactor ? (FinalReading.value - initialReading.value) * meterFactor : FinalReading.value - initialReading.value
    let obj = {
      initialReading: initialReading.value === "" ? "No Reading" : initialReading.value,
      finalReading: FinalReading.value === "" ? "No Reading" : FinalReading.value,
      consumption: consumption,
      meterFactor: meterFactor
    } 
    return obj;
  
}

const consumptionCalculationForMultipleData = (data, meterFactor) => {

  
 let output = []
  
  let arrayData = []
  const values = Object.values(data);
  values.map((item) => {
      arrayData.push(item)
  });
  
 
  if (arrayData){
    arrayData.map((each,i) => {
      if( i < arrayData.length-1){
        let data1 = [arrayData[i+1],arrayData[i]]
        const repValue = consumptionData(data1,meterFactor);
          output.push({
            date: each[0]?.date,
            initialReading: repValue.initialReading,
            finalReading: repValue.finalReading,
            consumption: repValue.consumption,
            meterFactor:meterFactor
          });
      }
      
    })
  }

  let rep = output.sort((a, b) => new Date(a.date) - new Date(b.date));
  return  rep ;
};



// HSD and DG find initial and final value 


const cosumptionCalculationForDgAndHsd = (data, meterFactor, date) => {
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  let initialReading = {
    value: ""
  };
  let FinalReading = {
    value: ""
  };
  data?.length && data?.map((dt) => {
    if (
      moment(dt?.date).format("YYYY-MM-DD") ===
      moment(date.currentDate).format("YYYY-MM-DD")
    ) {
      if (!FinalReading?.value) {
        FinalReading = dt;
      } else {
        if (moment(dt.date).format() > moment(FinalReading.date).format) {
          FinalReading = dt;
        }
      }
    } else if (
      moment(dt?.date).format("YYYY-MM-DD") ===
      moment(date.prevDate).format("YYYY-MM-DD")
    ) {
      if(data.length === 1) {
        initialReading =dt;
      }else{

        if (!FinalReading?.value) {
          FinalReading = dt;
        } else {
          if (moment(dt.date).format() < moment(FinalReading.date).format) {
            initialReading = dt;
          }
        }
      }
    }
  });
  let consumption = meterFactor ? (FinalReading.value - initialReading.value) * meterFactor : FinalReading.value - initialReading.value
  let obj = {
    initialReading: initialReading.value === "" ? "No Reading" : initialReading.value,
    finalReading: FinalReading.value === "" ? "No Reading" : FinalReading.value,
    consumption: consumption,
    meterFactor: meterFactor
  }
  // if(obj?.initialReading === 'No Reading' || obj?.finalReading === 'No Reading'){
  //   getData(obj);
  // }


  return obj;
}

const htGrid = (accessToken, date) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var mainMeter = new FormData();
  mainMeter.append("model", "maintenance.reading.log");
  mainMeter.append("domain", `[["equipment_id", "in", [83565]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  mainMeter.append("fields", '["equipment_id", "date", "value"]');

  var incomerMeter = new FormData();
  incomerMeter.append("model", "maintenance.reading.log");
  incomerMeter.append("domain", `[["equipment_id", "in", [83566]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  incomerMeter.append("fields", '["equipment_id", "date", "value"]');

  

  const resMain = await callApi( mainMeter, accessToken);
  const resIncommer = await callApi( incomerMeter, accessToken);

    let mainData = cosumptionCalculation(resMain.data.data, 120000, date);
    let incommerData = cosumptionCalculation(resIncommer.data.data, 1000, date);
    resolve({
      mainMeter: mainData,
      incomerMeter: incommerData,
      diffInKwh: mainData.consumption - incommerData.consumption,
    })
  // } catch (error) {
  //   resolve({
  //     mainMeter: {},
  //     incomerMeter: {},
  //     diffInKwh: 0
  //   });
  // }
})
const htGrid1 = (accessToken, date,params) => new Promise(async (resolve) => {

  var mainMeter = new FormData();
  mainMeter.append("model", "maintenance.reading.log");
  mainMeter.append("domain", `[["equipment_id", "in", [83565]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  mainMeter.append("fields", '["equipment_id", "date", "value"]');

  var incomerMeter = new FormData();
  incomerMeter.append("model", "maintenance.reading.log");
  incomerMeter.append("domain", `[["equipment_id", "in", [83566]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  incomerMeter.append("fields", '["equipment_id", "date", "value"]');

  console.log("htgrid data calling",new Date())
  let [resMain, resIncommer] = await Promise.all([ callApi( mainMeter, accessToken),callApi( incomerMeter, accessToken),
  ]);
  // console.log(resMain.data.data)
  console.log("htgrid data reciving",new Date())
    // let rep1 = groupDataByDate(resMain.data.data);
    let mainData = consumptionCalculation1(resMain.data.data, 120000, date);
    let incommerData = consumptionCalculation1(resIncommer.data.data, 1000, date);
    
    let diff = [];

const length = Math.min(mainData?.length || 0, incommerData?.length || 0);
for (let index = 0; index < length; index++) {
  const mainConsumption = mainData[index]?.consumption;
  const incommerConsumption = incommerData[index]?.consumption;
  if (mainConsumption !== undefined && incommerConsumption !== undefined) {
    const element = mainConsumption - incommerConsumption;
    diff.push({
      diffInKwh: element,
      date: mainData[index]?.date
    });
  }
}
 
  

const groupBy = params?.groupBy;

if (groupBy === 'week' || groupBy === 'month') {
  mainData = groupData(mainData, groupBy);
  incommerData = groupData(incommerData, groupBy);
  diff = groupData(diff, groupBy);
}


  if(params.analytics !== undefined){
  let resAll = await Promise.all([ prediction(mainData,params),prediction(incommerData,params),
  ]);
  let predictionData1 = resAll[0]
  let predictionData2 =  resAll[1]  
   let DescriptiveDate = {
    mainMeter:Descriptive(predictionData1),
    incomerMeter:Descriptive(predictionData2)
  }  

  resolve({
    mainMeter:predictionData1 ,
    incomerMeter: predictionData2,
    DescriptiveDate:DescriptiveDate,
  });
   }

const result = await triggerSchemas.htGrid.findOne({ graph: "htGrid" });

if (result?.toggle === true && result?.filter === params?.filter )  {
  
  const condition = [
    {
      operator: result.limit.min.comparisonOperator,
      limit: result.limit.min.value,
    }, // min <= 75000
    {
      operator: result.limit.max.comparisonOperator,
      limit: result.limit.max.value,
    }, // max >= 115000
  ];

  const countdata1 = countConsumption(mainData, condition,result.updatedAt);
  const countdata2 = countConsumption(incommerData, condition,result.updatedAt);

  
  const processAndUpdate = async (countdata, Source) => {
    if (countdata.count >= result.exceedTimes || countdata.count ===0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      console.log(countdata.values)
      const query = {
        updatedAt: { $gte: today },
        'htGrid.Source': Source, 
      }
      
      const update = {
        $set: {
          'htGrid.$.triggerNumber': countdata.count,
          'htGrid.$.values': countdata.values,
        },
      };
  
      const helpDesk = await HelpDesk.findOne(query);
  
      if (helpDesk) {
        await HelpDesk.updateOne(query, update);
      } else {
        // Add new transformerIC element
        const newElement = {
          Source: Source,
          triggerNumber: countdata.count,
          values: countdata.values,
        };
  
        await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { htGrid: { $each: [newElement], $slice: 2 } } });
      }
    }
  };

  await Promise.all([
    processAndUpdate(countdata2, "incommerData"),
    processAndUpdate(countdata1, "mainData"),
  ]);
}



let DescriptiveDate = {
  mainMeter: Descriptive(mainData),
  incomerMeter:Descriptive(incommerData),
  diff:Descriptive(diff)
} ;


let chartData = {
  incomerMeter: incommerData,
  mainMeter: mainData,
  diffInKwh: diff,
};

resolve({
  chartData: chartData,
  DescriptiveDate: DescriptiveDate,
});
})

const transformerIC = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83619]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value"]');
  trans1.append("limit", '80');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83620]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');
  trans2.append("limit", '80');

  // try {
  //   const resTrans1 = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     trans1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const resTrans2 = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     trans2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const resTrans1 = await callApi( trans1, accessToken);
  const resTrans2 = await callApi( trans2, accessToken);

    let trans1Data = cosumptionCalculation(resTrans1.data.data, 1000, date);
    let trans2Data = cosumptionCalculation(resTrans2.data.data, 1000, date);
    let DescriptiveDate = {
      mainMeter: Descriptive(trans1Data),
      incomerMeter:Descriptive(trans1Data)
    
    } ;
    resolve({
      trans1Data: trans1Data,
      trans2Data: trans2Data,
      transmissionLoss: trans1Data.consumption + trans2Data.consumption,
      DescriptiveDate:DescriptiveDate
    })
  // } catch (error) {
  //   resolve({
  //     trans1Data: {},
  //     trans2Data: {},
  //     transmissionLoss: 0
  //   });
  // }
})


const substation = async (accessToken, date,params) => {
  
  
  try {
   let resAll = await Promise.all([ transformerIC1(accessToken, date,params), transformerOG1(accessToken, date,params),
    ]);
   
    let obj = {}
   
  let data = resAll
  console.log("data",data)

let transformerIcTrans1Data = data[0].trans1Data;
let transformerIcTrans2Data = data[0].trans2Data;
let transformerOGTrans1Data = data[1].trans1Data;
let transformerOGTrans2Data = data[1].trans2Data;

let transformerLoss = [];

for (let i = 0; i < transformerIcTrans1Data.length; i++) {
  let trans1Consumption = isNaN(transformerIcTrans1Data[i].consumption) || isNaN(transformerOGTrans1Data[i].consumption) ? 0 : transformerIcTrans1Data[i].consumption +  transformerIcTrans2Data[i].consumption;
  let trans2Consumption = isNaN(transformerIcTrans2Data[i].consumption) || isNaN(transformerOGTrans2Data[i].consumption) ? 0 : transformerOGTrans1Data[i].consumption + transformerOGTrans2Data[i].consumption;

  let loss = trans2Consumption - trans1Consumption;
  
  transformerLoss.push({
    lossData: loss,
    date: transformerIcTrans1Data[i]?.date
  });
}

obj.transformerLoss= transformerLoss
obj.Descriptive= Descriptive(transformerLoss)


     
  return obj

  } catch (error) {
    console.log("error----", error);
  }
}
 
const transformerIC1 = (accessToken, date,params) => new Promise(async (resolve) => {
  
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83619]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value"]');
  trans1.append("limit", '80');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83620]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');
  trans2.append("limit", '80');

  console.log(new Date())
  const [resTrans1, resTrans2] = await Promise.all([callApi( trans1, accessToken), callApi( trans2, accessToken)]);
  console.log(new Date())
  // const resTrans1 = await callApi( trans1, accessToken);
  // const resTrans2 = await callApi( trans2, accessToken);
   
    let trans1Data = consumptionCalculation1(resTrans1.data.data, 1000, date);
    let trans2Data = consumptionCalculation1(resTrans2.data.data, 1000, date);
    let transmissionLoss = [];

    
const length = Math.min(trans1Data?.length || 0, trans2Data?.length || 0);
for (let index = 0; index < length; index++) {
  const trans1Consumption = trans1Data[index]?.consumption;
  const trans2Consumption = trans2Data[index]?.consumption;
  if (trans1Consumption !== undefined && trans2Consumption !== undefined) {
    const element = trans1Consumption + trans2Consumption;
    transmissionLoss.push({
      diffInKwh: element,
      date: trans1Data[index]?.date
    });
  }
}

const groupBy = params?.groupBy;

if(groupBy === 'week' || groupBy === 'month'){
  trans1Data = groupData(trans1Data,groupBy)
  trans2Data = groupData(trans2Data,groupBy)
  transmissionLoss=groupData(transmissionLoss,groupBy)
}




let DescriptiveDate = {
  trans1Data: Descriptive(trans1Data),
  trans2Data:Descriptive(trans2Data),
  diff:Descriptive(transmissionLoss)

} ;
    

let chartData = {
  trans1Data: trans1Data,

  trans2Data: trans2Data,

  transmissionLoss: transmissionLoss,
};


if(params?.analytics !== undefined){

  if(transmissionLoss!==undefined){
    transmissionLoss.forEach(obj => {
      obj.consumption = obj.diffInKwh; // Assign the value of diffInKwh to consumption
      delete obj.diffInKwh; // Remove the diffInKwh key
  });
  }

  const [predictionData1, predictionData2, predictionData3] = await Promise.all([
    prediction(trans1Data, params),
    prediction(trans2Data, params),
    prediction(transmissionLoss, params)
  ]);
  
  const DescriptiveData = {
    trans1Data: Descriptive(predictionData1),
    trans2Data: Descriptive(predictionData2),
    transmissionLoss: Descriptive(predictionData3)
  };  

  resolve({
    trans1Data:predictionData1 ,
    trans2Data: predictionData2,
    transmissionLoss:predictionData3,
    DescriptiveDate:DescriptiveData,
  });
}

const result = await triggerSchemas.transformerIC.findOne({ graph: "transformerIC" });

if (result?.toggle === true && result?.filter === params?.filter) {

  
  const condition = [
    {
      operator: result.limit.min.comparisonOperator,
      limit: result.limit.min.value,
    }, // min <= 75000
    {
      operator: result.limit.max.comparisonOperator,
      limit: result.limit.max.value,
    }, // max >= 115000
  ];

  const countdata1 = countConsumption(trans1Data, condition,result.updatedAt);
  const countdata2 = countConsumption(trans2Data, condition,result.updatedAt);

// console.log(countdata1,countdata2)
  
const processAndUpdate = async (countdata, Source) => {
  if (countdata.count >= result.exceedTimes || countdata.count ===0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const query = {
      updatedAt: { $gte: today },
      'transformerIC.Source': Source, 
    }

    const update = {
      $set: {
        'transformerIC.$.triggerNumber': countdata.count,
        'transformerIC.$.values': countdata.values,
      },
    };

    const helpDesk = await HelpDesk.findOne(query);

    if (helpDesk) {
      await HelpDesk.updateOne(query, update);
    } else {
      // Add new transformerIC element
      const newElement = {
        Source: Source,
        triggerNumber: countdata.count,
        values: countdata.values,
      };

      await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { transformerIC: { $each: [newElement], $position: 0, $slice: 2 } } });
    }
  }
};

await Promise.all([
  processAndUpdate(countdata2, 'trans2Data'),
  processAndUpdate(countdata1, 'trans1Data'),
]);

}
resolve({
  trans1Data: trans1Data,
  trans2Data: trans2Data,
  transmissionLoss: transmissionLoss,
  chartData: chartData,
  DescriptiveDate: DescriptiveDate,
});
})

const transformerOG = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83621]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value"]');
  trans1.append("limit", '80');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83622]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');
  trans2.append("limit", '80');

  // try {
  //   const resTrans1 = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     trans1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const resTrans2 = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     trans2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );


  const resTrans1 = await callApi( trans1, accessToken);
  const resTrans2 = await callApi( trans2, accessToken);

    let trans1Data = cosumptionCalculation(resTrans1.data.data, 1000, date);
    let trans2Data = cosumptionCalculation(resTrans2.data.data, 1000, date);
    resolve({
      trans1Data: trans1Data,
      trans2Data: trans2Data,
      transmissionLoss: trans1Data.consumption + trans2Data.consumption
    })
  // } catch (error) {
  //   resolve({
  //     trans1Data: {},
  //     trans2Data: {},
  //     transmissionLoss: 0
  //   });
  // }
})

const transformerOG1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83621]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value"]');
  trans1.append("limit", '80');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83622]],["reading_id", "in", ["Active Energy EB"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');
  trans2.append("limit", '80');

  console.log(new Date())
  const [resTrans1, resTrans2] = await Promise.all([callApi( trans1, accessToken), callApi( trans2, accessToken)]);
  console.log(new Date())

    let trans1Data = consumptionCalculation1(resTrans1.data.data, 1000, date);
    let trans2Data = consumptionCalculation1(resTrans2.data.data, 1000, date);
    let diff = [];

    
    
    const length = Math.min(trans1Data?.length || 0, trans2Data?.length || 0);
    for (let index = 0; index < length; index++) {
      const trans1Consumption = trans1Data[index]?.consumption;
      const trans2Consumption = trans2Data[index]?.consumption;
      if (trans1Consumption !== undefined && trans2Consumption !== undefined) {
        const element = trans1Consumption + trans2Consumption;
        diff.push({
          diffInKwh: element,
          date: trans1Data[index]?.date
        });
      }
    }


const groupBy = params?.groupBy;

if(groupBy === 'week' || groupBy === 'month'){
      trans1Data = groupData(trans1Data,groupBy)
      trans2Data = groupData(trans2Data,groupBy)
      diff=groupData(diff,groupBy)
    }

    let DescriptiveDate = {
      trans1Data: Descriptive(trans1Data),
      trans2Data:Descriptive(trans2Data),
      diff:Descriptive(diff)
    
    } ;
   
    
    let chartData = {
      trans1Data: trans1Data,
    
      trans2Data: trans2Data,
    
      transmissionLoss: diff,
    };


    if(params?.analytics !== undefined){

      if(diff!==undefined){
        diff.forEach(obj => {
          obj.consumption = obj.diffInKwh; // Assign the value of diffInKwh to consumption
          delete obj.diffInKwh; // Remove the diffInKwh key
      });
      }
      const [predictionData1, predictionData2, predictionData3] = await Promise.all([
        prediction(trans1Data, params),
        prediction(trans2Data, params),
        prediction(diff, params)
      ]);
      
      const DescriptiveData = {
        trans1Data: Descriptive(predictionData1),
        trans2Data: Descriptive(predictionData2),
        transmissionLoss: Descriptive(predictionData3)
      };  
    
      resolve({
        trans1Data:predictionData1 ,
        trans2Data: predictionData2,
        transmissionLoss:predictionData3,
        DescriptiveDate:DescriptiveData,
      });
    }
    
    const result = await triggerSchemas.transformerOG.findOne({ graph: "transformerOG" });

    if (result?.toggle === true && result?.filter === params?.filter) {
    
      
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];
    
      // console.log(result)
    
      const countdata1 = countConsumption(trans1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(trans2Data, condition,result.updatedAt);
    
    console.log(countdata1,countdata2)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'transformerOG.Source': Source, 
        }
    
        const update = {
          $set: {
            'transformerOG.$.triggerNumber': countdata.count,
            'transformerOG.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { transformerOG: { $each: [newElement], $position: 0, $slice: 2 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata2, 'trans2Data'),
      processAndUpdate(countdata1, 'trans1Data'),
    ]);
    
    }

    resolve({
      trans1Data: trans1Data,
    
      trans2Data: trans2Data,
    
      transmissionLoss: diff,
    
      chartData: chartData,
    
      DescriptiveDate: DescriptiveDate,
    });
    
    
  // } catch (error) {
  //   resolve({
  //     trans1Data: {},
  //     trans2Data: {},
  //     transmissionLoss: 0
  //   });
  // }
})

const tower1EbConsumption = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var tw1RMU = new FormData();
  tw1RMU.append("model", "maintenance.reading.log");
  tw1RMU.append("domain", `[["equipment_id", "in", [72440]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  tw1RMU.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83525]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83527]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');


  // const resTw1RMU = await callApi( tw1RMU, accessToken);
  // const resTrans1 = await callApi( trans1, accessToken);
  // const resTrans2 = await callApi( trans2, accessToken);

  // let tw1RMUData = cosumptionCalculation(resTw1RMU.data.data, 0, date);
  // let trans1Data = cosumptionCalculation(resTrans1.data.data, 0, date);
  // let trans2Data = cosumptionCalculation(resTrans2.data.data, 0, date);

  const [resTw1RMU, resTrans1, resTrans2] = await Promise.all([
  callApi(tw1RMU, accessToken),
  callApi(trans1, accessToken),
  callApi(trans2, accessToken)
]);

const [tw1RMUData, trans1Data, trans2Data] = await Promise.all([
  cosumptionCalculation(resTw1RMU.data.data, 0, date),
  cosumptionCalculation(resTrans1.data.data, 0, date),
  cosumptionCalculation(resTrans2.data.data, 0, date)
]);

  resolve({
    tw1RMU: tw1RMUData,
    trans1Data: trans1Data,
    trans2Data: trans2Data,
    transmissionLoss: trans1Data.consumption + trans2Data.consumption
  });

})
const tower1EbConsumption1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var tw1RMU = new FormData();
  tw1RMU.append("model", "maintenance.reading.log");
  tw1RMU.append("domain", `[["equipment_id", "in", [72440]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  tw1RMU.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var trans1 = new FormData();
  trans1.append("model", "maintenance.reading.log");
  trans1.append("domain", `[["equipment_id", "in", [83525]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var trans2 = new FormData();
  trans2.append("model", "maintenance.reading.log");
  trans2.append("domain", `[["equipment_id", "in", [83527]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  trans2.append("fields", '["equipment_id", "date", "value"]');

  console.log(new Date())
  const [resTw1RMU, resTrans1,resTrans2] = await Promise.all([callApi( tw1RMU, accessToken) ,callApi( trans1, accessToken),callApi( trans2, accessToken)]);
  console.log(new Date())
  let rep1 = groupDataByDate(resTrans1.data.data);
  let rep2 = groupDataByDate(resTrans2.data.data);

    
  let tw1RMUData = consumptionCalculation1(resTw1RMU.data.data, 0, date);
  let trans1Data = consumptionCalculationForMultipleData(rep1, 0, date);
  let trans2Data = consumptionCalculationForMultipleData(rep2, 0, date);





  let diff = [];
    
    const length = Math.min(trans1Data?.length || 0, trans2Data?.length || 0);
    for (let index = 0; index < length; index++) {
      const trans1Consumption = trans1Data[index]?.consumption;
      const trans2Consumption = trans2Data[index]?.consumption;
      if (trans1Consumption !== undefined && trans2Consumption !== undefined) {
        const element = trans1Consumption + trans2Consumption;
        diff.push({
          diffInKwh: element,
          date: trans1Data[index]?.date
        });
      }
    }

    const groupBy = params?.groupBy;

    if(groupBy === 'week' || groupBy === 'month'){
      tw1RMUData = groupData(tw1RMUData,groupBy)
      trans1Data = groupData(trans1Data,groupBy)
      trans2Data = groupData(trans2Data,groupBy)
      diff=groupData(diff,groupBy)
    }

    let DescriptiveDate = {
      tw1RMUData: Descriptive(tw1RMUData),
      trans1Data:Descriptive(trans1Data),
      trans2Data:Descriptive(trans2Data),
      diff:Descriptive(diff)
    }

    if(params.analytics !== undefined){

      if(diff!==undefined){
        diff.forEach(obj => {
          obj.consumption = obj.diffInKwh; // Assign the value of diffInKwh to consumption
          delete obj.diffInKwh; // Remove the diffInKwh key
      });
      }
      let predictionData1 = await prediction(tw1RMUData,params)
      let predictionData2 =   await prediction(trans1Data,params)
      let predictionData3 =   await prediction(trans2Data,params)
      let predictionData4 =   await prediction(diff,params)
      
    
      resolve({
        tw1RMU:predictionData1 ,
        trans1Data: predictionData2,
        trans2Data:predictionData3,
        transmissionLoss:predictionData4,
        // DescriptiveDate:DescriptiveData,
      });
    }


    

  resolve({
    tw1RMU: tw1RMUData,
    trans1Data: trans1Data,
    trans2Data: trans2Data,
    transmissionLoss: diff,
    DescriptiveDate:DescriptiveDate
  });

})

const feederConsumptionLT = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var basementVent = new FormData();
  basementVent.append("model", "maintenance.reading.log");
  basementVent.append("domain", `[["equipment_id", "in", [83470]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  basementVent.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var base3 = new FormData();
  base3.append("model", "maintenance.reading.log");
  base3.append("domain", `[["equipment_id", "in", [83514]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  base3.append("fields", '["equipment_id", "date", "value"]');

  var base2 = new FormData();
  base2.append("model", "maintenance.reading.log");
  base2.append("domain", `[["equipment_id", "in", [83534]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  base2.append("fields", '["equipment_id", "date", "value"]');

  var commonService = new FormData();
  commonService.append("model", "maintenance.reading.log");
  commonService.append("domain", `[["equipment_id", "in", [83520]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  commonService.append("fields", '["equipment_id", "date", "value"]');
  // try {
  //   const base1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     basementVent,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const base2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     base2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const base3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     base3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const CommonRes = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     commonService,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const base1Res = await callApi( basementVent, accessToken);
  const base2Res = await callApi( base2, accessToken);
  const base3Res = await callApi( base3, accessToken);
  const CommonRes = await callApi( commonService, accessToken);
  

    let base1Data = cosumptionCalculation(base1Res.data.data, 0, date);
    let base2Data = cosumptionCalculation(base2Res.data.data, 0, date);
    let base3Data = cosumptionCalculation(base3Res.data.data, 0, date);
    let commonServ = cosumptionCalculation(CommonRes.data.data, 0, date);
    resolve({
      base1Vent: base1Data,
      base2: base2Data,
      base3: base3Data,
      commonServices: commonServ
    })
  // } catch (error) {
  //   resolve({
  //     base1Vent: {},
  //     base2: {},
  //     base3: {},
  //     commonServices: {}
  //   });
  // }
})
const feederConsumptionLT1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  

  var basementVent = new FormData();
  basementVent.append("model", "maintenance.reading.log");
  basementVent.append("domain", `[["equipment_id", "in", [83470]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  basementVent.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var base3 = new FormData();
  base3.append("model", "maintenance.reading.log");
  base3.append("domain", `[["equipment_id", "in", [83514]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  base3.append("fields", '["equipment_id", "date", "value"]');

  var base2 = new FormData();
  base2.append("model", "maintenance.reading.log");
  base2.append("domain", `[["equipment_id", "in", [83534]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  base2.append("fields", '["equipment_id", "date", "value"]');

  var commonService = new FormData();
  commonService.append("model", "maintenance.reading.log");
  commonService.append("domain", `[["equipment_id", "in", [83520]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  commonService.append("fields", '["equipment_id", "date", "value"]');
 

  // const base1Res = await callApi( basementVent, accessToken);
  // const base2Res = await callApi( base2, accessToken);
  // const base3Res = await callApi( base3, accessToken);
  // const CommonRes = await callApi( commonService, accessToken);

  const [base1Res, base2Res, base3Res, commonRes] = await Promise.all([
  callApi(basementVent, accessToken),
  callApi(base2, accessToken),
  callApi(base3, accessToken),
  callApi(commonService, accessToken)
]);

  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''
  let rep4 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(base1Res.data.data);
    rep2 = groupDataByHour(base2Res.data.data);
    rep3 = groupDataByHour(base3Res.data.data);
    rep4 = groupDataByHour(commonRes.data.data);
  } else {
    rep1 = groupDataByDate(base1Res.data.data);
    rep2 = groupDataByDate(base2Res.data.data);
    rep3 = groupDataByDate(base3Res.data.data);
    rep4 = groupDataByDate(commonRes.data.data);
  }
  
    
    let base1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let base2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let base3Data = consumptionCalculationForMultipleData(rep3, 0, date);
    let commonServ = consumptionCalculationForMultipleData(rep4, 0, date);
    
    
    

    if(groupBy === 'week' || groupBy === 'month'){
      base1Data = groupData(base1Data,groupBy)
      base2Data = groupData(base2Data,groupBy)
      base3Data=groupData(base3Data,groupBy)
      commonServ=groupData(commonServ,groupBy)
    }

    let DescriptiveDate = {
      base1Data: Descriptive(base1Data),
      base2Data:Descriptive(base2Data),
      base3Data:Descriptive(base3Data),
      commonServ:Descriptive(commonServ)
    }

        if(params.analytics !== undefined){
    
      let predictionData1 = await prediction(base1Data,params)
      let predictionData2 =   await prediction(base2Data,params)
      let predictionData3 =   await prediction(base3Data,params)
      let predictionData4 =   await prediction(commonServ,params)
      
    
      resolve({
        base1Vent:predictionData1 ,
        base2: predictionData2,
        base3:predictionData3,
        commonServices:predictionData4,
        // DescriptiveDate:DescriptiveData,
      });
    }

    let chartData = {
      base1Vent: base1Data,
    
      base2: base2Data,
    
      base3: base3Data,
    
      commonServices: commonServ,
    };
    


    const result = await triggerSchemas.feederConsumptionLT.findOne({ graph: "feederConsumptionLT" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
    
      
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];
    
      // console.log(result)
    
      const countdata1 = countConsumption(base1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(base2Data, condition,result.updatedAt);
      const countdata3 = countConsumption(base3Data, condition,result.updatedAt);
      const countdata4 = countConsumption(commonServ, condition,result.updatedAt);
    
    console.log(countdata1,countdata2)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'feederConsumptionLT.Source': Source, 
        }
    
        const update = {
          $set: {
            'feederConsumptionLT.$.triggerNumber': countdata.count,
            'feederConsumptionLT.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { feederConsumptionLT: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'base1Data'),
      processAndUpdate(countdata2, 'base2Data'),
      processAndUpdate(countdata3, 'base3Data'),
      processAndUpdate(countdata4, 'commonServ'),
    ]);
    
    }
    resolve({
      chartData: chartData,
    
      DescriptiveDate: DescriptiveDate,
    });
  // } catch (error) {
  //   resolve({
  //     base1Vent: {},
  //     base2: {},
  //     base3: {},
  //     commonServices: {}
  //   });
  // }
})

const DgRoomConsumption = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var roomVent = new FormData();
  roomVent.append("model", "maintenance.reading.log");
  roomVent.append("domain", `[["equipment_id", "in", [83517]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  roomVent.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var airWasher = new FormData();
  airWasher.append("model", "maintenance.reading.log");
  airWasher.append("domain", `[["equipment_id", "in", [83530]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  airWasher.append("fields", '["equipment_id", "date", "value"]');

  var auxilary = new FormData();
  auxilary.append("model", "maintenance.reading.log");
  auxilary.append("domain", `[["equipment_id", "in", [83522]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  auxilary.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //  const roomVentRes = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     roomVent,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const airWasherRes = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     airWasher,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const auxilaryRes = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     auxilary,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const roomVentRes = await callApi( roomVent, accessToken);
  const airWasherRes = await callApi( airWasher, accessToken);
  const auxilaryRes = await callApi( auxilary, accessToken);


    let roomVentData = cosumptionCalculation(roomVentRes.data.data, 0, date);
    let airWasherData = cosumptionCalculation(airWasherRes.data.data, 0, date);
    let auxilaryData = cosumptionCalculation(auxilaryRes.data.data, 0, date);
    resolve({
      roomVent: roomVentData,
      airWasher: airWasherData,
      auxilary: auxilaryData,
    })
  // } catch (error) {
  //   resolve({
  //     roomVent: {},
  //     airWasher: {},
  //     auxilary: {},
  //   });
  // }
})
const DgRoomConsumption1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var roomVent = new FormData();
  roomVent.append("model", "maintenance.reading.log");
  roomVent.append("domain", `[["equipment_id", "in", [83517]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  roomVent.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var airWasher = new FormData();
  airWasher.append("model", "maintenance.reading.log");
  airWasher.append("domain", `[["equipment_id", "in", [83530]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  airWasher.append("fields", '["equipment_id", "date", "value"]');

  var auxilary = new FormData();
  auxilary.append("model", "maintenance.reading.log");
  auxilary.append("domain", `[["equipment_id", "in", [83522]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  auxilary.append("fields", '["equipment_id", "date", "value"]');

 

  // const roomVentRes = await callApi( roomVent, accessToken);
  // const airWasherRes = await callApi( airWasher, accessToken);
  // const auxilaryRes = await callApi( auxilary, accessToken);

  const [roomVentRes, airWasherRes, auxilaryRes] = await Promise.all([
    callApi(roomVent, accessToken),
    callApi(airWasher, accessToken),
    callApi(auxilary, accessToken)
  ]);
  
  

  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(roomVentRes.data.data);
    rep2 = groupDataByHour(airWasherRes.data.data);
    rep3 = groupDataByHour(auxilaryRes.data.data);
  } else {
    rep1 = groupDataByDate(roomVentRes.data.data);
    rep2 = groupDataByDate(airWasherRes.data.data);
    rep3 = groupDataByDate(auxilaryRes.data.data);
  }
  

  
  
    let roomVentData = consumptionCalculationForMultipleData(rep1, 0, date);
    let airWasherData = consumptionCalculationForMultipleData(rep2, 0, date);
    let auxilaryData = consumptionCalculationForMultipleData(rep3, 0, date);


    

    if(groupBy === 'week' || groupBy === 'month'){
      roomVentData = groupData(roomVentData,groupBy)
      airWasherData = groupData(airWasherData,groupBy)
      auxilaryData=groupData(auxilaryData,groupBy)
    }

    let DescriptiveDate = {
      roomVentData: Descriptive(roomVentData),
      airWasherData:Descriptive(airWasherData),
      auxilaryData:Descriptive(auxilaryData)
     
    }

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(roomVentData,params)
      // let predictionData2 =   await prediction(airWasherData,params)
      // let predictionData3 =   await prediction(auxilaryData,params)
      const [predictionData1, predictionData2, predictionData3] = await Promise.all([
        prediction(roomVentData, params),
        prediction(airWasherData, params),
        prediction(auxilaryData, params)
      ]);
     
      resolve({
        roomVent:predictionData1 ,
        airWasher: predictionData2,
        auxilary:predictionData3,
      });
    }


    let chartData = {
      roomVent: roomVentData,
      airWasher: airWasherData,
      auxilary: auxilaryData,
    }

    const result = await triggerSchemas.DgRoomConsumption.findOne({ graph: "DgRoomConsumption" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
  
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];

      const countdata1 = countConsumption(roomVentData, condition,result.updatedAt);
      const countdata2 = countConsumption(airWasherData, condition,result.updatedAt);
      const countdata3 = countConsumption(auxilaryData, condition,result.updatedAt);

    console.log(countdata1,countdata2,countdata3)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'DgRoomConsumption.Source': Source, 
        }
    
        const update = {
          $set: {
            'DgRoomConsumption.$.triggerNumber': countdata.count,
            'DgRoomConsumption.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { DgRoomConsumption: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'roomVentData'),
      processAndUpdate(countdata2, 'airWasherData'),
      processAndUpdate(countdata3, 'auxilaryData'),
    ]);

    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate

    })
  
})

const spareFeeder = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var tower9 = new FormData();
  tower9.append("model", "maintenance.reading.log");
  tower9.append("domain", `[["equipment_id", "in", [83523]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  tower9.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var spare1 = new FormData();
  spare1.append("model", "maintenance.reading.log");
  spare1.append("domain", `[["equipment_id", "in", [83515]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  spare1.append("fields", '["equipment_id", "date", "value"]');

  var spare2 = new FormData();
  spare2.append("model", "maintenance.reading.log");
  spare2.append("domain", `[["equipment_id", "in", [83526]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  spare2.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const tower9Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     tower9,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const spare1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     spare1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const spare2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     spare2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const tower9Res = await callApi( tower9, accessToken);
  const spare1Res = await callApi( spare1, accessToken);
  const spare2Res = await callApi( spare2, accessToken);

    let tower9Data = cosumptionCalculation(tower9Res.data.data, 0, date);
    let spare1Data = cosumptionCalculation(spare1Res.data.data, 0, date);
    let spare2Data = cosumptionCalculation(spare2Res.data.data, 0, date);
    resolve({
      tower9: tower9Data,
      spare1: spare1Data,
      spare2: spare2Data,
    })
  // } catch (error) {
  //   resolve({
  //     tower9: {},
  //     spare1: {},
  //     spare2: {},
  //   });
  // }
})
const spareFeeder1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var tower9 = new FormData();
  tower9.append("model", "maintenance.reading.log");
  tower9.append("domain", `[["equipment_id", "in", [83523]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  tower9.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var spare1 = new FormData();
  spare1.append("model", "maintenance.reading.log");
  spare1.append("domain", `[["equipment_id", "in", [83515]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  spare1.append("fields", '["equipment_id", "date", "value"]');

  var spare2 = new FormData();
  spare2.append("model", "maintenance.reading.log");
  spare2.append("domain", `[["equipment_id", "in", [83526]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  spare2.append("fields", '["equipment_id", "date", "value"]');

  
  // const tower9Res = await callApi( tower9, accessToken);
  // const spare1Res = await callApi( spare1, accessToken);
  // const spare2Res = await callApi( spare2, accessToken);
  const [tower9Res, spare1Res, spare2Res] = await Promise.all([
    callApi(tower9, accessToken),
    callApi(spare1, accessToken),
    callApi(spare2, accessToken)
  ]);
  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''

  if (groupBy === 'hour') {
   rep1 = groupDataByHour(tower9Res.data.data);
   rep2 = groupDataByHour(spare1Res.data.data);
   rep3 = groupDataByHour(spare2Res.data.data);
  } else {
   rep1 = groupDataByDate(tower9Res.data.data);
   rep2 = groupDataByDate(spare1Res.data.data);
   rep3 = groupDataByDate(spare2Res.data.data);
  }

  
    let tower9Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let spare1Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let spare2Data = consumptionCalculationForMultipleData(rep3, 0, date);

    

    if(groupBy === 'week' || groupBy === 'month'){
      tower9Data = groupData(tower9Data,groupBy)
      spare1Data = groupData(spare1Data,groupBy)
      spare2Data=groupData(spare2Data,groupBy)
    }

    let DescriptiveDate = {
      tower9Data: Descriptive(tower9Data),
      spare1Data:Descriptive(spare1Data),
      spare2Data:Descriptive(spare2Data)
     
    }
    

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(tower9Data,params)
      // let predictionData2 =   await prediction(spare1Data,params)
      // let predictionData3 =   await prediction(spare2Data,params)
      const [predictionData1, predictionData2, predictionData3] = await Promise.all([
        prediction(tower9Data, params),
        prediction(spare1Data, params),
        prediction(spare2Data, params)
      ]);
      
     
      resolve({
        tower9:predictionData1 ,
        spare1: predictionData2,
        spare2:predictionData3,
      });
    }

    let chartData = {
      tower9: tower9Data,
      spare1: spare1Data,
      spare2: spare2Data,
    }


    const result = await triggerSchemas.spareFeeder.findOne({ graph: "spareFeeder" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
  
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];

      const countdata1 = countConsumption(tower9Data, condition,result.updatedAt);
      const countdata2 = countConsumption(spare1Data, condition,result.updatedAt);
      const countdata3 = countConsumption(spare2Data, condition,result.updatedAt);

    console.log(countdata1,countdata2,countdata3)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'spareFeeder.Source': Source, 
        }
    
        const update = {
          $set: {
            'spareFeeder.$.triggerNumber': countdata.count,
            'spareFeeder.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { spareFeeder: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'tower9Data'),
      processAndUpdate(countdata2, 'spare1Data'),
      processAndUpdate(countdata3, 'spare2Data'),
    ]);

    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  // } catch (error) {
  //   resolve({
  //     tower9: {},
  //     spare1: {},
  //     spare2: {},
  //   });
  // }
})

const AHURoom = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var AHURoom1 = new FormData();
  AHURoom1.append("model", "maintenance.reading.log");
  AHURoom1.append("domain", `[["equipment_id", "in", [83516]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  AHURoom1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var AHURoom2 = new FormData();
  AHURoom2.append("model", "maintenance.reading.log");
  AHURoom2.append("domain", `[["equipment_id", "in", [83528]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  AHURoom2.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const AHU1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     AHURoom1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const AHU2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     AHURoom2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const AHU1Res = await callApi( AHURoom1, accessToken);
  const AHU2Res = await callApi( AHURoom2, accessToken);

    let AHURoom1Data = cosumptionCalculation(AHU1Res.data.data, 0, date);
    let AHURoom2Data = cosumptionCalculation(AHU2Res.data.data, 0, date);

    resolve({
      AHURoom1: AHURoom1Data,
      AHURoom2: AHURoom2Data,
    })
  // } catch (error) {
  //   resolve({
  //     AHURoom1: {},
  //     AHURoom2: {},
  //   });
  // }
})
const AHURoom1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var AHURoom1 = new FormData();
  AHURoom1.append("model", "maintenance.reading.log");
  AHURoom1.append("domain", `[["equipment_id", "in", [83516]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  AHURoom1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var AHURoom2 = new FormData();
  AHURoom2.append("model", "maintenance.reading.log");
  AHURoom2.append("domain", `[["equipment_id", "in", [83528]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  AHURoom2.append("fields", '["equipment_id", "date", "value"]');


  // const AHU1Res = await callApi( AHURoom1, accessToken);
  // const AHU2Res = await callApi( AHURoom2, accessToken);
  const [AHU1Res, AHU2Res] = await Promise.all([
    callApi(AHURoom1, accessToken),
    callApi(AHURoom2, accessToken)
  ]);


  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(AHU1Res.data.data);
    rep2 = groupDataByHour(AHU2Res.data.data);
   
  } else {
    rep1 = groupDataByDate(AHU1Res.data.data);
    rep2 = groupDataByDate(AHU2Res.data.data);
  }

  

    let AHURoom1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let AHURoom2Data = consumptionCalculationForMultipleData(rep2, 0, date);

    
    
    if(groupBy === 'week' || groupBy === 'month'){
      AHURoom1Data = groupData(AHURoom1Data,groupBy)
      AHURoom2Data = groupData(AHURoom2Data,groupBy)
    }
    
    let DescriptiveDate = {
      AHURoom1Data: Descriptive(AHURoom1Data),
      AHURoom2Data:Descriptive(AHURoom2Data),
    }

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(AHURoom1Data,params)
      // let predictionData2 =   await prediction(AHURoom2Data,params)
      const [predictionData1, predictionData2] = await Promise.all([
        prediction(AHURoom1Data, params),
        prediction(AHURoom2Data, params)
      ]);
      
     
      resolve({
        AHURoom1:predictionData1 ,
        AHURoom2: predictionData2,
      });
    }
    let chartData = {
      AHURoom1: AHURoom1Data,
      AHURoom2: AHURoom2Data,
    }


    const result = await triggerSchemas.AHURoom.findOne({ graph: "AHURoom" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
  
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];

      const countdata1 = countConsumption(AHURoom1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(AHURoom2Data, condition,result.updatedAt);

    console.log(countdata1,countdata2)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'AHURoom.Source': Source, 
        }
    
        const update = {
          $set: {
            'AHURoom.$.triggerNumber': countdata.count,
            'AHURoom.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { AHURoom: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'AHURoom1Data'),
      processAndUpdate(countdata2, 'AHURoom2Data'),
    ]);

    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  // } catch (error) {
  //   resolve({
  //     AHURoom1: {},
  //     AHURoom2: {},
  //   });
  // }
})

const liftPanel = (accessToken, date) => new Promise(async (resolve) => {


  // let today = new Date();
  // let yesterday = new Date();
  // yesterday.setDate(today.getDate() - 1);

  var lift1 = new FormData();
  lift1.append("model", "maintenance.reading.log");
  lift1.append("domain", `[["equipment_id", "in", [83518]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var lift2 = new FormData();
  lift2.append("model", "maintenance.reading.log");
  lift2.append("domain", `[["equipment_id", "in", [83519]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift2.append("fields", '["equipment_id", "date", "value"]');

  var lift3 = new FormData();
  lift3.append("model", "maintenance.reading.log");
  lift3.append("domain", `[["equipment_id", "in", [83533]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift3.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const lift1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     lift1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const lift2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     lift2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const lift3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     lift3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const lift1Res = await callApi( lift1, accessToken);
  const lift2Res = await callApi( lift2, accessToken);
  const lift3Res = await callApi( lift3, accessToken);

    let lift1Data = cosumptionCalculation(lift1Res.data.data, 0, date);
    let lift2Data = cosumptionCalculation(lift2Res.data.data, 0, date);
    let lift3Data = cosumptionCalculation(lift3Res.data.data, 0, date);
    resolve({
      lift1: lift1Data,
      lift2: lift2Data,
      lift3: lift3Data,
    })
  // } catch (error) {
  //   resolve({
  //     lift1: {},
  //     lift2: {},
  //     lift3: {},
  //   });
  // }
})
const liftPanel1 = (accessToken, date,params) => new Promise(async (resolve) => {

  var lift1 = new FormData();
  lift1.append("model", "maintenance.reading.log");
  lift1.append("domain", `[["equipment_id", "in", [83518]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var lift2 = new FormData();
  lift2.append("model", "maintenance.reading.log");
  lift2.append("domain", `[["equipment_id", "in", [83519]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift2.append("fields", '["equipment_id", "date", "value"]');

  var lift3 = new FormData();
  lift3.append("model", "maintenance.reading.log");
  lift3.append("domain", `[["equipment_id", "in", [83533]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  lift3.append("fields", '["equipment_id", "date", "value"]');

  
  // const lift1Res = await callApi( lift1, accessToken);
  // const lift2Res = await callApi( lift2, accessToken);
  // const lift3Res = await callApi( lift3, accessToken);

  const [lift1Res, lift2Res, lift3Res] = await Promise.all([
    callApi(lift1, accessToken),
    callApi(lift2, accessToken),
    callApi(lift3, accessToken)
  ]);
  
  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''
  

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(lift1Res.data.data);
   rep2 = groupDataByHour(lift2Res.data.data);
   rep3 = groupDataByHour(lift3Res.data.data);
   
  } else {
    rep1 = groupDataByDate(lift1Res.data.data);
   rep2 = groupDataByDate(lift2Res.data.data);
   rep3 = groupDataByDate(lift3Res.data.data);
  }

    
    let lift1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let lift2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let lift3Data = consumptionCalculationForMultipleData(rep3, 0, date);

    
    
    if(groupBy === 'week' || groupBy === 'month'){
      lift1Data = groupData(lift1Data,groupBy)
      lift2Data = groupData(lift2Data,groupBy)
      lift3Data=groupData(lift3Data,groupBy)
    }

    let DescriptiveDate = {
      lift1Data: Descriptive(lift1Data),
      lift2Data:Descriptive(lift2Data),
      lift3Data:Descriptive(lift3Data),

    }

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(lift1Data,params)
      // let predictionData2 =   await prediction(lift2Data,params)
      // let predictionData3 =   await prediction(lift3Data,params)
      const [predictionData1, predictionData2, predictionData3] = await Promise.all([
        prediction(lift1Data, params),
        prediction(lift2Data, params),
        prediction(lift3Data, params)
      ]);
      
     
      resolve({
        lift1:predictionData1 ,
        lift2: predictionData2,
        lift3:predictionData3,
      });
    }


    let chartData = {
      lift1: lift1Data,
      lift2: lift2Data,
      lift3: lift3Data,
    }
    const result = await triggerSchemas.liftPanel.findOne({ graph: "liftPanel" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
  
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];

      const countdata1 = countConsumption(lift1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(lift2Data, condition,result.updatedAt);
      const countdata3 = countConsumption(lift3Data, condition,result.updatedAt);

    console.log(countdata1,countdata2,countdata3)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'liftPanel.Source': Source, 
        }
    
        const update = {
          $set: {
            'liftPanel.$.triggerNumber': countdata.count,
            'liftPanel.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { liftPanel: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'lift1Data'),
      processAndUpdate(countdata2, 'lift2Data'),
      processAndUpdate(countdata3, 'lift3Data'),
    ]);

    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  // } catch (error) {
  //   resolve({
  //     lift1: {},
  //     lift2: {},
  //     lift3: {},
  //   });
  // }
})

const risingMain = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var main1 = new FormData();
  main1.append("model", "maintenance.reading.log");
  main1.append("domain", `[["equipment_id", "in", [83521]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var main2 = new FormData();
  main2.append("model", "maintenance.reading.log");
  main2.append("domain", `[["equipment_id", "in", [83532]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main2.append("fields", '["equipment_id", "date", "value"]');

  var main3 = new FormData();
  main3.append("model", "maintenance.reading.log");
  main3.append("domain", `[["equipment_id", "in", [83531]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main3.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const main1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     main1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const main2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     main2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const main3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     main3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  const main1Res = await callApi( main1, accessToken);
  const main2Res = await callApi( main2, accessToken);
  const main3Res = await callApi( main3, accessToken);

    let main1Data = cosumptionCalculation(main1Res.data.data, 0, date);
    let main2Data = cosumptionCalculation(main2Res.data.data, 0, date);
    let main3Data = cosumptionCalculation(main3Res.data.data, 0, date);
    resolve({
      main1: main1Data,
      main2: main2Data,
      main3: main3Data,
    })
  // } catch (error) {
  //   resolve({
  //     main1: {},
  //     main2: {},
  //     main3: {},
  //   });
  // }
})
const risingMain1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);



  var main1 = new FormData();
  main1.append("model", "maintenance.reading.log");
  main1.append("domain", `[["equipment_id", "in", [83521]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var main2 = new FormData();
  main2.append("model", "maintenance.reading.log");
  main2.append("domain", `[["equipment_id", "in", [83532]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main2.append("fields", '["equipment_id", "date", "value"]');

  var main3 = new FormData();
  main3.append("model", "maintenance.reading.log");
  main3.append("domain", `[["equipment_id", "in", [83531]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  main3.append("fields", '["equipment_id", "date", "value"]');

  
  const main1Res = await callApi( main1, accessToken);
  const main2Res = await callApi( main2, accessToken);
  const main3Res = await callApi( main3, accessToken);

  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(main1Res.data.data);
   rep2 = groupDataByHour(main2Res.data.data);
   rep3 = groupDataByHour(main3Res.data.data);
  
  } else {
    rep1 = groupDataByDate(main1Res.data.data);
    rep2 = groupDataByDate(main2Res.data.data);
    rep3 = groupDataByDate(main3Res.data.data);
  }


    let main1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let main2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let main3Data = consumptionCalculationForMultipleData(rep3, 0, date);

    if(groupBy === 'week' || groupBy === 'month'){
      main1Data = groupData(main1Data,groupBy)
      main2Data = groupData(main2Data,groupBy)
      main3Data=groupData(main3Data,groupBy)
    }

    let DescriptiveDate = {
      main1Data: Descriptive(main1Data),
      main2Data:Descriptive(main2Data),
      main3Data:Descriptive(main3Data),

    }

    if(params.analytics !== undefined){
    
      let predictionData1 = await prediction(main1Data,params)
      let predictionData2 =   await prediction(main2Data,params)
      let predictionData3 =   await prediction(main3Data,params)
     
      resolve({
        main1:predictionData1 ,
        main2: predictionData2,
        main3:predictionData3,
      });
    }
    let chartData = {
      main1: main1Data,
      main2: main2Data,
      main3: main3Data,
    }

    const result = await triggerSchemas.risingMain.findOne({ graph: "risingMain" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
  
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];

      const countdata1 = countConsumption(main1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(main2Data, condition,result.updatedAt);
      const countdata3 = countConsumption(main3Data, condition,result.updatedAt);

    console.log(countdata1,countdata2,countdata3)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'risingMain.Source': Source, 
        }
    
        const update = {
          $set: {
            'risingMain.$.triggerNumber': countdata.count,
            'risingMain.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { risingMain: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'main1Data'),
      processAndUpdate(countdata2, 'main2Data'),
      processAndUpdate(countdata3, 'main3Data'),
    ]);

    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  // } catch (error) {
  //   resolve({
  //     main1: {},
  //     main2: {},
  //     main3: {},
  //   });
  // }
})

const yardConsumption = (accessToken, date) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var t6Tank1 = new FormData();
  t6Tank1.append("model", "maintenance.reading.log");
  t6Tank1.append("domain", `[["equipment_id", "in", [80789]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var t6Tank2 = new FormData();
  t6Tank2.append("model", "maintenance.reading.log");
  t6Tank2.append("domain", `[["equipment_id", "in", [80790]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank2.append("fields", '["equipment_id", "date", "value"]');

  var t6Tank3 = new FormData();
  t6Tank3.append("model", "maintenance.reading.log");
  t6Tank3.append("domain", `[["equipment_id", "in", [80791]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank3.append("fields", '["equipment_id", "date", "value"]');

  var t6Tank4 = new FormData();
  t6Tank4.append("model", "maintenance.reading.log");
  t6Tank4.append("domain", `[["equipment_id", "in", [80792]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank4.append("fields", '["equipment_id", "date", "value"]');

  var t9Tank1 = new FormData();
  t9Tank1.append("model", "maintenance.reading.log");
  t9Tank1.append("domain", `[["equipment_id", "in", [83609]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t9Tank1.append("fields", '["equipment_id", "date", "value"]')

  var t9Tank2 = new FormData();
  t9Tank2.append("model", "maintenance.reading.log");
  t9Tank2.append("domain", `[["equipment_id", "in", [83610]]]`);
  t9Tank2.append("fields", '["equipment_id", "date", "value"]')
 
// t6-----------
  const t6Tank1Res = await callApi(t6Tank1, accessToken);
  const t6Tank2Res = await callApi(t6Tank2, accessToken);
  const t6Tank3Res = await callApi(t6Tank3, accessToken);
  const t6Tank4Res = await callApi(t6Tank4, accessToken);

  // t9 ----------- 

  const t9Tank1Res = await callApi(t9Tank1, accessToken);
  const t9Tank2Res = await callApi(t9Tank2, accessToken);

  
  
    let t6Tank1Data = cosumptionCalculationForDgAndHsd(t6Tank1Res.data.data, 0, date);
    let t6Tank2Data = cosumptionCalculationForDgAndHsd(t6Tank2Res.data.data, 0, date);
    let t6Tank3Data = cosumptionCalculationForDgAndHsd(t6Tank3Res.data.data, 0, date);
    let t6Tank4Data = cosumptionCalculationForDgAndHsd(t6Tank4Res.data.data, 0, date);
    let t9Tank1Data = cosumptionCalculationForDgAndHsd(t9Tank1Res.data.data, 0, date);
    let t9Tank2Data = cosumptionCalculationForDgAndHsd(t9Tank2Res.data.data, 0, date);

  

    resolve({
      t6Tank1: t6Tank1Data,
      t6Tank2: t6Tank2Data,
      t6Tank3: t6Tank3Data,
      t6Tank4: t6Tank4Data,
      t9Tank1: t9Tank1Data,
      t9Tank2: t9Tank2Data
    })
  // } catch (error) {
  //   console.log(error,"kjljlj")
  //   resolve({
  //     t6Tank1: t6Tank1Data,
  //     t6Tank2: t6Tank2Data,
  //     t6Tank3: t6Tank3Data,
  //     t6Tank4: t6Tank4Data,
  //     t9Tank1: t9Tank1Data,
  //     t9Tank2: t9Tank2Data
  //   })
  // }
})
const yardConsumption1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);


  var t6Tank1 = new FormData();
  t6Tank1.append("model", "maintenance.reading.log");
  t6Tank1.append("domain", `[["equipment_id", "in", [80789]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var t6Tank2 = new FormData();
  t6Tank2.append("model", "maintenance.reading.log");
  t6Tank2.append("domain", `[["equipment_id", "in", [80790]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank2.append("fields", '["equipment_id", "date", "value"]');

  var t6Tank3 = new FormData();
  t6Tank3.append("model", "maintenance.reading.log");
  t6Tank3.append("domain", `[["equipment_id", "in", [80791]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank3.append("fields", '["equipment_id", "date", "value"]');

  var t6Tank4 = new FormData();
  t6Tank4.append("model", "maintenance.reading.log");
  t6Tank4.append("domain", `[["equipment_id", "in", [80792]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t6Tank4.append("fields", '["equipment_id", "date", "value"]');

  var t9Tank1 = new FormData();
  t9Tank1.append("model", "maintenance.reading.log");
  t9Tank1.append("domain", `[["equipment_id", "in", [83609]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  t9Tank1.append("fields", '["equipment_id", "date", "value"]')

  var t9Tank2 = new FormData();
  t9Tank2.append("model", "maintenance.reading.log");
  t9Tank2.append("domain", `[["equipment_id", "in", [83610]]]`);
  t9Tank2.append("fields", '["equipment_id", "date", "value"]')
 
// t6-----------
  const t6Tank1Res = await callApi(t6Tank1, accessToken);
  const t6Tank2Res = await callApi(t6Tank2, accessToken);
  const t6Tank3Res = await callApi(t6Tank3, accessToken);
  const t6Tank4Res = await callApi(t6Tank4, accessToken);

  // t9 ----------- 

  const t9Tank1Res = await callApi(t9Tank1, accessToken);
  const t9Tank2Res = await callApi(t9Tank2, accessToken);


  let rep1 = groupDataByDate(t6Tank1Res.data.data);
  let rep2 = groupDataByDate(t6Tank2Res.data.data);
  let rep3 = groupDataByDate(t6Tank3Res.data.data);
  let rep4 = groupDataByDate(t6Tank4Res.data.data);
  let rep5 = groupDataByDate(t9Tank1Res.data.data);
  let rep6 = groupDataByDate(t9Tank2Res.data.data);

  
    let t6Tank1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let t6Tank2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let t6Tank3Data = consumptionCalculationForMultipleData(rep3, 0, date);
    let t6Tank4Data = consumptionCalculationForMultipleData(rep4, 0, date);
    let t9Tank1Data = consumptionCalculationForMultipleData(rep5, 0, date);
    let t9Tank2Data = consumptionCalculationForMultipleData(rep6, 0, date);


    const groupBy = params?.groupBy;
    if(groupBy === 'week' || groupBy === 'month'){
      t6Tank1Data = groupData(t6Tank1Data,groupBy)
      t6Tank2Data = groupData(t6Tank2Data,groupBy)
      t6Tank3Data=groupData(t6Tank3Data,groupBy)
      t6Tank4Data = groupData(t6Tank4Data,groupBy)
      t9Tank1Data = groupData(t9Tank1Data,groupBy)
      t9Tank2Data=groupData(t9Tank2Data,groupBy)
    }
    let DescriptiveDate = {
      t6Tank1Data: Descriptive(t6Tank1Data),
      t6Tank2Data:Descriptive(t6Tank2Data),
      t6Tank3Data:Descriptive(t6Tank3Data),
      t6Tank4Data:Descriptive(t6Tank4Data),
      t9Tank1Data:Descriptive(t9Tank1Data),
      t9Tank2Data:Descriptive(t9Tank2Data),
    }


    if(params.analytics !== undefined){
    
      let predictionData1 = await prediction(t6Tank1Data,params)
      let predictionData2 =   await prediction(t6Tank2Data,params)
      let predictionData3 =   await prediction(t6Tank3Data,params)
      let predictionData4 = await prediction(t6Tank4Data,params)
      let predictionData5 =   await prediction(t9Tank1Data,params)
      let predictionData6 =   await prediction(t9Tank2Data,params)
     
      resolve({
        t6Tank1:predictionData1 ,
        t6Tank2: predictionData2,
        t6Tank3:predictionData3,
        t6Tank4:predictionData4 ,
        t9Tank1: predictionData5,
        t9Tank2:predictionData6,
      });
    }

    resolve({
      t6Tank1: t6Tank1Data,
      t6Tank2: t6Tank2Data,
      t6Tank3: t6Tank3Data,
      t6Tank4: t6Tank4Data,
      t9Tank1: t9Tank1Data,
      t9Tank2: t9Tank2Data,
      DescriptiveDate:DescriptiveDate
    })
  
})

const DGUnit = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');

  const DG1Res = await callApi(DG1, accessToken);
  const DG2Res = await callApi(DG2, accessToken);
  const DG3Res = await callApi(DG3, accessToken);
  const DG4Res = await callApi(DG4, accessToken);

    let DG1Data = cosumptionCalculationForDgAndHsd(DG1Res.data.data, 0, date);
    let DG2Data = cosumptionCalculationForDgAndHsd(DG2Res.data.data, 0, date);
    let DG3Data = cosumptionCalculationForDgAndHsd(DG3Res.data.data, 0, date);
    let DG4Data = cosumptionCalculationForDgAndHsd(DG4Res.data.data, 0, date);

    resolve({
      DG1: DG1Data,
      DG2: DG2Data,
      DG3: DG3Data,
      DG4: DG4Data,
    })
  // } catch (error) {
  //   resolve({
  //     DG1: {},
  //     DG2: {},
  //     DG3: {},
  //     DG4: {},
  //   });
  // }
})

const DGUnit1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Active Energy"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');

  // const DG1Res = await callApi(DG1, accessToken);
  // const DG2Res = await callApi(DG2, accessToken);
  // const DG3Res = await callApi(DG3, accessToken);
  // const DG4Res = await callApi(DG4, accessToken);
  const [DG1Res, DG2Res, DG3Res, DG4Res] = await Promise.all([
    callApi(DG1, accessToken),
    callApi(DG2, accessToken),
    callApi(DG3, accessToken),
    callApi(DG4, accessToken)
  ]);

  const groupBy = params?.groupBy;

  let rep1 = ''
  let rep2 = ''
  let rep3 = ''
  let rep4 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(DG1Res.data.data);
    rep2 = groupDataByHour(DG2Res.data.data);
    rep3 = groupDataByHour(DG3Res.data.data);
    rep4 = groupDataByHour(DG4Res.data.data);  
  } else {
    rep1 = groupDataByDate(DG1Res.data.data);
    rep2 = groupDataByDate(DG2Res.data.data);
    rep3 = groupDataByDate(DG3Res.data.data);
    rep4 = groupDataByDate(DG4Res.data.data);
  }


   let DG1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let DG2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let DG3Data = consumptionCalculationForMultipleData(rep3, 0, date);
    let DG4Data = consumptionCalculationForMultipleData(rep4, 0, date);

        if(groupBy === 'week' || groupBy === 'month'){
          DG1Data = groupData(DG1Data,groupBy)
          DG2Data = groupData(DG2Data,groupBy)
          DG3Data=groupData(DG3Data,groupBy)
          DG4Data = groupData(DG4Data,groupBy)
        }

    let DescriptiveDate = {
      DG1Data: Descriptive(DG1Data),
      DG2Data:Descriptive(DG2Data),
      DG3Data:Descriptive(DG3Data),
      DG4Data:Descriptive(DG4Data), 
    }

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(DG1Data,params)
      // let predictionData2 =   await prediction(DG2Data,params)
      // let predictionData3 =   await prediction(DG3Data,params)
      // let predictionData4 = await prediction(DG4Data,params)     
      const [predictionData1, predictionData2, predictionData3, predictionData4] = await Promise.all([
        prediction(DG1Data, params),
        prediction(DG2Data, params),
        prediction(DG3Data, params),
        prediction(DG4Data, params)
      ]);
      resolve({
        DG1:predictionData1 ,
        DG2: predictionData2,
        DG3:predictionData3,
        DG4:predictionData4 ,
      });
    }

let chartData = {
  DG1: DG1Data,
  DG2: DG2Data,
  DG3: DG3Data,
  DG4: DG4Data,
}

const result = await triggerSchemas.DGUnit.findOne({ graph: "DGUnit" });
    
if (result?.toggle === true && result?.filter === params?.filter) {

  const condition = [
    {
      operator: result.limit.min.comparisonOperator,
      limit: result.limit.min.value,
    }, // min <= 75000
    {
      operator: result.limit.max.comparisonOperator,
      limit: result.limit.max.value,
    }, // max >= 115000
  ];

  const countdata1 = countConsumption(DG1Data, condition,result.updatedAt);
  const countdata2 = countConsumption(DG2Data, condition,result.updatedAt);
  const countdata3 = countConsumption(DG3Data, condition,result.updatedAt);
  const countdata4 = countConsumption(DG4Data, condition,result.updatedAt);

console.log(countdata1,countdata2,countdata3,countdata4)
  
const processAndUpdate = async (countdata, Source) => {
  if (countdata.count >= result.exceedTimes || countdata.count ===0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const query = {
      updatedAt: { $gte: today },
      'DGUnit.Source': Source, 
    }

    const update = {
      $set: {
        'DGUnit.$.triggerNumber': countdata.count,
        'DGUnit.$.values': countdata.values,
      },
    };

    const helpDesk = await HelpDesk.findOne(query);

    if (helpDesk) {
      await HelpDesk.updateOne(query, update);
    } else {
      // Add new transformerIC element
      const newElement = {
        Source: Source,
        triggerNumber: countdata.count,
        values: countdata.values,
      };

      await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { DGUnit: { $each: [newElement], $position: 0, $slice: 4 } } });
    }
  }
};

await Promise.all([
  processAndUpdate(countdata1, 'DG1Data'),
  processAndUpdate(countdata2, 'DG2Data'),
  processAndUpdate(countdata3, 'DG3Data'),
  processAndUpdate(countdata4, 'DG4Data')
]);

}
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate

    })
})

const DGHDCConsumption = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');

  const DG1Res = await callApi(DG1 , accessToken);
  const DG2Res = await callApi(DG2 , accessToken);
  const DG3Res = await callApi(DG3 , accessToken);
  const DG4Res = await callApi(DG4 , accessToken);
  // try {
  //   const DG1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const DG2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const DG3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const DG4Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG4,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

    let DG1Data = cosumptionCalculationForDgAndHsd(DG1Res.data.data, 0, date);
    let DG2Data = cosumptionCalculationForDgAndHsd(DG2Res.data.data, 0, date);
    let DG3Data = cosumptionCalculationForDgAndHsd(DG3Res.data.data, 0, date);
    let DG4Data = cosumptionCalculationForDgAndHsd(DG4Res.data.data, 0, date);
    resolve({
      DG1: DG1Data,
      DG2: DG2Data,
      DG3: DG3Data,
      DG4: DG4Data,
    })
  // } catch (error) {
  //   resolve({
  //     DG1: {},
  //     DG2: {},
  //     DG3: {},
  //     DG4: {},
  //   });
  // }
})
const DGHDCConsumption1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Fuel Level"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');

  // const DG1Res = await callApi(DG1 , accessToken);
  // const DG2Res = await callApi(DG2 , accessToken);
  // const DG3Res = await callApi(DG3 , accessToken);
  // const DG4Res = await callApi(DG4 , accessToken);

  const [DG1Res, DG2Res, DG3Res, DG4Res] = await Promise.all([
    callApi(DG1, accessToken),
    callApi(DG2, accessToken),
    callApi(DG3, accessToken),
    callApi(DG4, accessToken)
  ]);


  const groupBy = params?.groupBy;

  let rep1 = '',
   rep2 = '',
   rep3 = '',
   rep4 = ''


   
  if (groupBy === 'hour') {
    rep1 = groupDataByHour(DG1Res.data.data);
    rep2 = groupDataByHour(DG2Res.data.data);
    rep3 = groupDataByHour(DG3Res.data.data);
    rep4 = groupDataByHour(DG4Res.data.data);  
  } else {
    rep1 = groupDataByDate(DG1Res.data.data);
    rep2 = groupDataByDate(DG2Res.data.data);
    rep3 = groupDataByDate(DG3Res.data.data);
    rep4 = groupDataByDate(DG4Res.data.data);
  }
 
    let DG1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let DG2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let DG3Data = consumptionCalculationForMultipleData(rep3, 0, date);
    let DG4Data = consumptionCalculationForMultipleData(rep4, 0, date);

   
        
        if(groupBy === 'week' || groupBy === 'month'){
          DG1Data = groupData(DG1Data,groupBy)
          DG2Data = groupData(DG2Data,groupBy)
          DG3Data=groupData(DG3Data,groupBy)
          DG4Data = groupData(DG4Data,groupBy)
        }

    let DescriptiveDate = {
      DG1Data: Descriptive(DG1Data),
      DG2Data:Descriptive(DG2Data),
      DG3Data:Descriptive(DG3Data),
      DG4Data:Descriptive(DG4Data), 
    }

    if(params.analytics !== undefined){

      // let predictionData1 = await prediction(DG1Data,params)
      // let predictionData2 =   await prediction(DG2Data,params)
      // let predictionData3 =   await prediction(DG3Data,params)
      // let predictionData4 = await prediction(DG4Data,params)  
      
      const [predictionData1, predictionData2, predictionData3, predictionData4] = await Promise.all([
        prediction(DG1Data, params),
        prediction(DG2Data, params),
        prediction(DG3Data, params),
        prediction(DG4Data, params)
      ]);

      resolve({
        DG1:predictionData1 ,
        DG2: predictionData2,
        DG3:predictionData3,
        DG4:predictionData4 ,
      });
    }

    resolve({
      DG1: DG1Data,
      DG2: DG2Data,
      DG3: DG3Data,
      DG4: DG4Data,
      DescriptiveDate:DescriptiveDate
    })

})

const DGRunHours = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const DG1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const DG2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const DG3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const DG4Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     DG4,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  const DG1Res = await callApi(DG1 , accessToken);
  const DG2Res = await callApi(DG2 , accessToken);
  const DG3Res = await callApi(DG3 , accessToken);
  const DG4Res = await callApi(DG4 , accessToken);

    let DG1Data = cosumptionCalculationForDgAndHsd(DG1Res.data.data, 0, date);
    let DG2Data = cosumptionCalculationForDgAndHsd(DG2Res.data.data, 0, date);
    let DG3Data = cosumptionCalculationForDgAndHsd(DG3Res.data.data, 0, date);
    let DG4Data = cosumptionCalculationForDgAndHsd(DG4Res.data.data, 0, date);

    resolve({
      DG1: DG1Data,
      DG2: DG2Data,
      DG3: DG3Data,
      DG4: DG4Data,
    })
  // } catch (error) {
  //   resolve({
  //     DG1: {},
  //     DG2: {},
  //     DG3: {},
  //     DG4: {},
  //   });
  // }
})

const DGRunHours1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var DG1 = new FormData();
  DG1.append("model", "maintenance.reading.log");
  DG1.append("domain", `[["equipment_id", "in", [72544]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var DG2 = new FormData();
  DG2.append("model", "maintenance.reading.log");
  DG2.append("domain", `[["equipment_id", "in", [72545]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG2.append("fields", '["equipment_id", "date", "value"]');

  var DG3 = new FormData();
  DG3.append("model", "maintenance.reading.log");
  DG3.append("domain", `[["equipment_id", "in", [72546]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG3.append("fields", '["equipment_id", "date", "value"]');

  var DG4 = new FormData();
  DG4.append("model", "maintenance.reading.log");
  DG4.append("domain", `[["equipment_id", "in", [72547]],["reading_id", "in", ["Run Hours"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  DG4.append("fields", '["equipment_id", "date", "value"]');


  // const DG1Res = await callApi(DG1 , accessToken);
  // const DG2Res = await callApi(DG2 , accessToken);
  // const DG3Res = await callApi(DG3 , accessToken);
  // const DG4Res = await callApi(DG4 , accessToken);
  const [DG1Res, DG2Res, DG3Res, DG4Res] = await Promise.all([
    callApi(DG1, accessToken),
    callApi(DG2, accessToken),
    callApi(DG3, accessToken),
    callApi(DG4, accessToken)
  ]);
  
  const groupBy = params?.groupBy;

  let rep1 = '',
   rep2 = '',
   rep3 = '',
   rep4 = ''
  if (groupBy === 'hour') {
    rep1 = groupDataByHour(DG1Res.data.data);
    rep2 = groupDataByHour(DG2Res.data.data);
    rep3 = groupDataByHour(DG3Res.data.data);
    rep4 = groupDataByHour(DG4Res.data.data);  
  } else {
    rep1 = groupDataByDate(DG1Res.data.data);
    rep2 = groupDataByDate(DG2Res.data.data);
    rep3 = groupDataByDate(DG3Res.data.data);
    rep4 = groupDataByDate(DG4Res.data.data);
  }

    let DG1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let DG2Data = consumptionCalculationForMultipleData(rep2, 0, date);
    let DG3Data = consumptionCalculationForMultipleData(rep3, 0, date);
    let DG4Data = consumptionCalculationForMultipleData(rep4, 0, date);

        if(groupBy === 'week' || groupBy === 'month'){
          DG1Data = groupData(DG1Data,groupBy)
          DG2Data = groupData(DG2Data,groupBy)
          DG3Data=groupData(DG3Data,groupBy)
          DG4Data = groupData(DG4Data,groupBy)
        }

    let DescriptiveDate = {
      DG1Data: Descriptive(DG1Data),
      DG2Data:Descriptive(DG2Data),
      DG3Data:Descriptive(DG3Data),
      DG4Data:Descriptive(DG4Data), 
    }

    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(DG1Data,params)
      // let predictionData2 =   await prediction(DG2Data,params)
      // let predictionData3 =   await prediction(DG3Data,params)
      // let predictionData4 = await prediction(DG4Data,params)     

      const [predictionData1, predictionData2, predictionData3, predictionData4] = await Promise.all([
        prediction(DG1Data, params),
        prediction(DG2Data, params),
        prediction(DG3Data, params),
        prediction(DG4Data, params)
      ]);

      resolve({
        DG1:predictionData1 ,
        DG2: predictionData2,
        DG3:predictionData3,
        DG4:predictionData4 ,
      });
    }


    let chartData = {
      DG1: DG1Data,
      DG2: DG2Data,
      DG3: DG3Data,
      DG4: DG4Data,
    }

    const result = await triggerSchemas.DGRunHours.findOne({ graph: "DGRunHours" });
    
if (result?.toggle === true && result?.filter === params?.filter) {

  const condition = [
    {
      operator: result.limit.min.comparisonOperator,
      limit: result.limit.min.value,
    }, // min <= 75000
    {
      operator: result.limit.max.comparisonOperator,
      limit: result.limit.max.value,
    }, // max >= 115000
  ];

  const countdata1 = countConsumption(DG1Data, condition,result.updatedAt);
  const countdata2 = countConsumption(DG2Data, condition,result.updatedAt);
  const countdata3 = countConsumption(DG3Data, condition,result.updatedAt);
  const countdata4 = countConsumption(DG4Data, condition,result.updatedAt);

console.log(countdata1,countdata2,countdata3,countdata4)
  
const processAndUpdate = async (countdata, Source) => {
  if (countdata.count >= result.exceedTimes || countdata.count ===0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const query = {
      updatedAt: { $gte: today },
      'DGRunHours.Source': Source, 
    }

    const update = {
      $set: {
        'DGRunHours.$.triggerNumber': countdata.count,
        'DGRunHours.$.values': countdata.values,
      },
    };

    const helpDesk = await HelpDesk.findOne(query);

    if (helpDesk) {
      await HelpDesk.updateOne(query, update);
    } else {
      // Add new transformerIC element
      const newElement = {
        Source: Source,
        triggerNumber: countdata.count,
        values: countdata.values,
      };

      await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { DGRunHours: { $each: [newElement], $position: 0, $slice: 4 } } });
    }
  }
};

await Promise.all([
  processAndUpdate(countdata1, 'DG1Data'),
  processAndUpdate(countdata2, 'DG2Data'),
  processAndUpdate(countdata3, 'DG3Data'),
  processAndUpdate(countdata4, 'DG4Data')
]);

}
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  
})

const ChillerConsumption = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var chiller1 = new FormData();
  // chiller1.append("context", `{"lang": "en_US", "tz": "Asia/Kolkata", "uid": "269","active_model": "mro.equipment"}`);
  chiller1.append("model", "maintenance.reading.log");
  chiller1.append("domain", `[["equipment_id", "in", [83524]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller2 = new FormData();
  chiller2.append("model", "maintenance.reading.log");
  chiller2.append("domain", `[["equipment_id", "in", [83529]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller2.append("fields", '["equipment_id", "date", "value"]');

  // try {
  //   const chiller1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     chiller1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const chiller2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     chiller2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

    const chiller1Res = await callApi( chiller1, accessToken);
    const chiller2Res = await callApi( chiller2, accessToken);

    let chiller1Data = cosumptionCalculation(chiller1Res.data.data, 0, date);
    let chiller2Data = cosumptionCalculation(chiller2Res.data.data, 0, date);
    resolve({
      chiller1: chiller1Data,
      chiller2: chiller2Data,
    })
  // } catch (error) {
  //   reject(error);
  // }
})
const ChillerConsumption1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var chiller1 = new FormData();
  // chiller1.append("context", `{"lang": "en_US", "tz": "Asia/Kolkata", "uid": "269","active_model": "mro.equipment"}`);
  chiller1.append("model", "maintenance.reading.log");
  chiller1.append("domain", `[["equipment_id", "in", [83524]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller2 = new FormData();
  chiller2.append("model", "maintenance.reading.log");
  chiller2.append("domain", `[["equipment_id", "in", [83529]],["reading_id", "in", ["KWH"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller2.append("fields", '["equipment_id", "date", "value"]');

  

    // const chiller1Res = await callApi( chiller1, accessToken);
    // const chiller2Res = await callApi( chiller2, accessToken);

    const [chiller1Res, chiller2Res] = await Promise.all([
      callApi(chiller1, accessToken),
      callApi(chiller2, accessToken)
    ]);


    const groupBy = params?.groupBy;

  let rep1 = '',
   rep2 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(chiller1Res.data.data);
    rep2 = groupDataByHour(chiller2Res.data.data);
  } else {
    rep1 = groupDataByDate(chiller1Res.data.data);
    rep2 = groupDataByDate(chiller2Res.data.data);

    }

     

    let chiller1Data = consumptionCalculationForMultipleData(rep1, 0, date);
    let chiller2Data = consumptionCalculationForMultipleData(rep2, 0, date);

    
    if(groupBy === 'week' || groupBy === 'month'){
      chiller1Data = groupData(chiller1Data,groupBy)
      chiller2Data = groupData(chiller2Data,groupBy)
    }
    let DescriptiveDate = {
      chiller1Data: Descriptive(chiller1Data),
      chiller2Data:Descriptive(chiller2Data),
    }


    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(chiller1Data,params)
      // let predictionData2 =   await prediction(chiller2Data,params)  
      
      const [predictionData1, predictionData2] = await Promise.all([
        prediction(chiller1Data, params),
        prediction(chiller2Data, params)
      ]);

      resolve({
        chiller1:predictionData1 ,
        chiller2: predictionData2,
      });
    }

    let chartData = {
      chiller1: chiller1Data,
      chiller2: chiller2Data,
    }

    const result = await triggerSchemas.ChillerConsumption.findOne({ graph: "ChillerConsumption" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
    
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];
    
      const countdata1 = countConsumption(chiller1Data, condition,result.updatedAt);
      const countdata2 = countConsumption(chiller2Data, condition,result.updatedAt);
    
    console.log(countdata1,countdata2)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'ChillerConsumption.Source': Source, 
        }
    
        const update = {
          $set: {
            'ChillerConsumption.$.triggerNumber': countdata.count,
            'ChillerConsumption.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { ChillerConsumption: { $each: [newElement], $position: 0, $slice: 4 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'chiller1Data'),
      processAndUpdate(countdata2, 'chiller2Data'),
    ]);
    
    }
    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate,
    })
  // } catch (error) {
  //   reject(error);
  // }
})

const tempChillerCalculation = (data) => {

  
  let initialReading = {
    value: 0
  };
  let FinalReading = {
    value: 0
  };;

  
  data?.length && data?.map((dt) => {
    if (
      dt?.reading_id[1] === "Condenser water Supply Temp"
    ) {
      if (!FinalReading?.value) {
        FinalReading = dt;
      } else {
        if (moment(dt.date).format() > moment(FinalReading.date).format) {
          FinalReading = dt;
        }
      }
    } else if (
      dt?.reading_id[1] === "Condenser Saturation Temperature"
    ) {
      if (!initialReading?.value) {
        initialReading = dt;
      } else {
        if (moment(dt.date).format() < moment(initialReading.date).format) {
          initialReading = dt;
        }
      }
    }
  });

  let obj = {
    initialReading: initialReading.value === 0 ? "No Reading" : initialReading.value,
    finalReading: FinalReading.value === 0 ? "No Reading" : FinalReading.value,
    consumption: FinalReading.value - initialReading.value,
  }

  return obj;
}

const tempChillerCalculation1 = (data) => {
  const output = [];
  let arrayData = []
  const values = Object.values(data);
  values.map((item) => {
      // if (index < chillerData.length - 1) {
        
      // }
      arrayData.push(item)
  });
  if (arrayData){
    arrayData.map((each,i) => {
      if( i < arrayData.length-1){
        const tempChiller = tempChillerCalculation(arrayData[i+ 1], arrayData[i]);
          output.push({
            date: each[0]?.date,
            initialReading: tempChiller.initialReading,
            finalReading: tempChiller.finalReading,
            consumption: tempChiller.consumption,
          });
      }
      
    })
  }
  
  return output
};

const ChillerApproach = (accessToken, date) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var chiller1 = new FormData();
  chiller1.append("model", "maintenance.reading.log");
  chiller1.append("domain", `[["equipment_id", "in", [72354]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller2 = new FormData();
  chiller2.append("model", "maintenance.reading.log");
  chiller2.append("domain", `[["equipment_id", "in", [72355]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller2.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller3 = new FormData();
  chiller3.append("model", "maintenance.reading.log");
  chiller3.append("domain", `[["equipment_id", "in", [72356]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller3.append("fields", '["equipment_id", "date", "value","reading_id"]');

  // try {
  //   const chiller1Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     chiller1,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   // console.log(chiller1Res.data.data, "chiller1Res");
  //   const chiller2Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     chiller2,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const chiller3Res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     chiller3,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

    const chiller1Res = await callApi( chiller1, accessToken);
    const chiller2Res = await callApi( chiller2, accessToken);
    const chiller3Res = await callApi( chiller3, accessToken);

    let chiller1Data = tempChillerCalculation(chiller1Res.data.data);
    let chiller2Data = tempChillerCalculation(chiller2Res.data.data);
    let chiller3Data = tempChillerCalculation(chiller3Res.data.data);

    resolve({
      chiller1: chiller1Data,
      chiller2: chiller2Data,
      chiller3: chiller3Data
    })
  // } catch (error) {
  //   resolve({
  //     chiller1: {},
  //     chiller2: {},
  //     chiller3: {}
  //   });
  // }
})
const ChillerApproach1 = (accessToken, date,params) => new Promise(async (resolve) => {


  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var chiller1 = new FormData();
  chiller1.append("model", "maintenance.reading.log");
  chiller1.append("domain", `[["equipment_id", "in", [72354]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller1.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller2 = new FormData();
  chiller2.append("model", "maintenance.reading.log");
  chiller2.append("domain", `[["equipment_id", "in", [72355]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller2.append("fields", '["equipment_id", "date", "value","reading_id"]');

  var chiller3 = new FormData();
  chiller3.append("model", "maintenance.reading.log");
  chiller3.append("domain", `[["equipment_id", "in", [72356]],["reading_id", "in", ["Condenser water Supply Temp" ,"Condenser Saturation Temperature"]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  chiller3.append("fields", '["equipment_id", "date", "value","reading_id"]');

  


    // const chiller1Res = await callApi( chiller1, accessToken);
    // const chiller2Res = await callApi( chiller2, accessToken);
    // const chiller3Res = await callApi( chiller3, accessToken);

    const [chiller1Res, chiller2Res, chiller3Res] = await Promise.all([
      callApi(chiller1, accessToken),
      callApi(chiller2, accessToken),
      callApi(chiller3, accessToken)
    ]);


    const groupBy = params?.groupBy;

  let rep1 = '',
   rep2 = '',
   rep3 = ''

  if (groupBy === 'hour') {
    rep1 = groupDataByHour(chiller1Res.data.data);
     rep2 = groupDataByHour(chiller2Res.data.data);
     rep3 = groupDataByHour(chiller3Res.data.data);
  } else {
    rep1 = groupDataByDate(chiller1Res.data.data);
     rep2 = groupDataByDate(chiller2Res.data.data);
     rep3 = groupDataByDate(chiller3Res.data.data);
    }

    
     
   
   
  
   
    let chiller1Data = tempChillerCalculation1(rep1);
    let chiller2Data = tempChillerCalculation1(rep2);
    let chiller3Data = tempChillerCalculation1(rep3);

    
    
    if(groupBy === 'week' || groupBy === 'month'){
      chiller1Data = groupData(chiller1Data,groupBy)
      chiller2Data = groupData(chiller2Data,groupBy)
      chiller3Data = groupData(chiller3Data,groupBy)
    }

    let DescriptiveDate = {
      chiller1Data: Descriptive(chiller1Data),
      chiller2Data:Descriptive(chiller2Data),
      chiller3Data:Descriptive(chiller3Data),
    }
    
    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(chiller1Data,params)
      // let predictionData2 =   await prediction(chiller2Data,params)
      // let predictionData3 =   await prediction(chiller3Data,params)   

      const [predictionData1, predictionData2, predictionData3] = await Promise.all([
        prediction(chiller1Data, params),
        prediction(chiller2Data, params),
        prediction(chiller3Data, params)
      ]);

      resolve({
        chiller1:predictionData1 ,
        chiller2: predictionData2,
        chiller3:predictionData3,
      });
    }

let chartData = {
  chiller1: chiller1Data,
  chiller2: chiller2Data,
  chiller3: chiller3Data,
}

const result = await triggerSchemas.ChillerApproach.findOne({ graph: "ChillerApproach" });
    
if (result?.toggle === true && result?.filter === params?.filter) {

  const condition = [
    {
      operator: result.limit.min.comparisonOperator,
      limit: result.limit.min.value,
    }, // min <= 75000
    {
      operator: result.limit.max.comparisonOperator,
      limit: result.limit.max.value,
    }, // max >= 115000
  ];

  const countdata1 = countConsumption(chiller1Data, condition,result.updatedAt);
  const countdata2 = countConsumption(chiller2Data, condition,result.updatedAt);
  const countdata3 = countConsumption(chiller3Data, condition,result.updatedAt);

console.log(countdata1,countdata2,countdata3)
  
const processAndUpdate = async (countdata, Source) => {
  if (countdata.count >= result.exceedTimes || countdata.count ===0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const query = {
      updatedAt: { $gte: today },
      'ChillerApproach.Source': Source, 
    }

    const update = {
      $set: {
        'ChillerApproach.$.triggerNumber': countdata.count,
        'ChillerApproach.$.values': countdata.values,
      },
    };

    const helpDesk = await HelpDesk.findOne(query);

    if (helpDesk) {
      await HelpDesk.updateOne(query, update);
    } else {
      // Add new transformerIC element
      const newElement = {
        Source: Source,
        triggerNumber: countdata.count,
        values: countdata.values,
      };

      await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { ChillerApproach: { $each: [newElement], $position: 0, $slice: 4 } } });
    }
  }
};

await Promise.all([
  processAndUpdate(countdata1, 'chiller1Data'),
  processAndUpdate(countdata2, 'chiller2Data'),
  processAndUpdate(countdata3, 'chiller3Data'),
]);

}

    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate
    })
  
})

const groupByCategory = (data) => {
 let obj = {};
  data.map((dt) => {
    if (!obj[dt.category_id[1]]) {
      obj[dt.category_id[1]] = 1
    } else {
      obj[dt.category_id[1]] = obj[dt.category_id[1]] + 1
    }
  })
  return obj;
}
const groupByCategory1 = (data) => {
  let obj = {};
  console.log(data.length)
  data.forEach((dt) => {
   const category = dt.category_id[1];
   const state = dt.state;
   if (!obj[category]) {
     obj[category] = { count: 1, states: { [state]: 1 } };
   } else {
     obj[category].count++;
     obj[category].states[state] = obj[category].states[state]
       ? obj[category].states[state] + 1
       : 1;
   }
 });
   return obj;
 }

const OperativeSummary = (accessToken) => new Promise(async (resolve) => {

  var data = new FormData();
  data.append("model", "mro.equipment");
  data.append("domain", `[["is_itasset", "=", false], ["state", "=", "op"]]`);
  data.append("fields", '["category_id", "name", "state","category_id_count"]');
  data.append("groupby", '["category_id"]');
  // try {
  //   const res = await axios.post(
  //     `https://api-demo-v3.helixsense.com/api/v4/isearch_read`,
  //     data,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
    // console.log(res.data.data, "operativeRes");

    const res = await callApi( data, accessToken);

    let groupbyData = groupByCategory(res.data.data);

    resolve(groupbyData);

  // } catch (error) {
  //   reject(error);
  // }
})

const OperativeSummary1 = (accessToken) => new Promise(async (resolve) => {

  var data = new FormData();
  data.append("model", "mro.equipment");
  data.append("domain", `[["is_itasset", "=", false]]`);
  // data.append("domain", `[["is_itasset", "=", false], ["state", "=", "op"]]`);
  data.append("fields", '["category_id", "name", "state","category_id_count"]');
  data.append("groupby", '["category_id"]');
 
    const res = await callApi( data, accessToken);

    let  groupbyData = groupByCategory1(res.data.data);
    
    resolve(groupbyData);
})


const groupBywarranty_end_date = (data) => {
  const currentDate = moment();
  console.log(currentDate)
  const slabs = {
    "0-30": 0,
    "31-60": 0,
    "61-90": 0
  };

  data.forEach((obj) => {
    console.log(obj.warranty_end_date)
    const warrantyEndDate = moment(obj.warranty_end_date);
    const daysDifference = currentDate.diff(warrantyEndDate, 'days');
   
    if (daysDifference >= 0 && daysDifference <= 30) {
      slabs["0-30"]++;
    } else if (daysDifference > 30 && daysDifference <= 60) {
      slabs["31-60"]++;
    } else if (daysDifference > 60 && daysDifference <= 90) {
      slabs["61-90"]++;
    }
  });

  return slabs;
};


const AMC = (accessToken) => new Promise(async (resolve) => {

  var data = new FormData();
  data.append("model", "mro.equipment");
  data.append("domain", `[["is_itasset", "=", false],["warranty_end_date", "!=", false]]`);
  // data.append("domain", `[["is_itasset", "=", false], ["state", "=", "op"]]`);
  data.append("fields", '["category_id", "name", "state","warranty_end_date","company_id","category_id_count"]');
  data.append("groupby", '["category_id"]');
 
    const res = await callApi( data, accessToken);

    let  groupbyData = groupBywarranty_end_date(res.data.data);
    
    resolve(groupbyData);
})

const helpDesk = (accessToken, date) => new Promise(async (resolve) => {

  let today =  new Date();
  let time = today.getTime();
  let currentTime = moment(time).format("HH:mm:ss");
  var data = new FormData();
  console.log(".......................",date)
  data.append("model", "website.support.ticket");
  data.append("domain", `[["create_date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} ${currentTime}"],["create_date","<","${moment(date.currentDate).format("YYYY-MM-DD")} ${currentTime}"],["issue_type", "!=", "incident"], ["state_category_id", "=", "ope"]]`);
  data.append("fields", '["ticket_number", "subject", "priority_id","state_id","state_category_id","sla_status","create_date","create_uid","equipment_location_id","equipment_id","maintenance_team_id"]');
  
    const res = await callApi( data, accessToken);

    resolve(res.data.data);

})

const countStatusInspection = (data) => {
 let obj = {
    compelete: 0,
    missed: 0,
    upcoming: 0
  }
  
  data.map((dt) => {
    if (dt.state === "Upcoming") {
      obj.upcoming = obj.upcoming + 1 
    } else if (dt.state === "Completed") {
      obj.compelete = obj.compelete + 1
    } else if (dt.state === "Missed") {
      obj.missed = obj.missed + 1
    }
  })
  return obj;
}


const multiscreen = (accessToken, date,params) => new Promise(async (resolve) => {

  
  let today =  new Date();
  let time = today.getTime();
  let currentTime = moment(time).format("HH:mm:ss");
  var data = new FormData();
  data.append("model", "website.support.ticket");
  data.append("domain", `[["create_date",">=","${moment(date.currentDate).format("YYYY-MM-DD")} ${currentTime}"],["create_date","<","${moment(date.prevDate).format("YYYY-MM-DD")} ${currentTime}"],["issue_type", "!=", "incident"], ["state_category_id", "=", "ope"]]`);
  data.append("fields", '["ticket_number", "subject", "priority_id","state_id","state_category_id","sla_status","create_date","create_uid","equipment_location_id","equipment_id","maintenance_team_id","sla_end_date"]');


  var softService = new FormData();
  softService.append("model", "hx.inspection_checklist_log");
  softService.append("domain", `[["date","<=","${moment(date.prevDate).format("YYYY-MM-DD")} ${currentTime}"],["date",">=","${moment(date.currentDate).format("YYYY-MM-DD")} ${currentTime}"],["maintenance_team_id", "ilike", "G1-Soft Services Team"]]`);
  softService.append("fields", '["hx_inspection_list","state", "start_datetime", "end_datetime", "order_id", "order_state", "check_list_id","maintenance_team_id","company_id"]');

  var mAndETeam = new FormData();
  mAndETeam.append("model", "hx.inspection_checklist_log");
  // mAndETeam.append("domain", `[["date", "=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1-M&E Team"]]`);
  mAndETeam.append("domain", `[["date", ">=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["date", "<=", "${moment(date.prevDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1-M&E Team"]]`);
  mAndETeam.append("fields", '["hx_inspection_list","state", "start_datetime", "end_datetime", "order_id", "order_state", "check_list_id","maintenance_team_id","company_id"]');

  var PMTeam = new FormData();
  PMTeam.append("model", "hx.inspection_checklist_log");
  PMTeam.append("domain", `[["date", ">=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["date", "<=", "${moment(date.prevDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1 PM Team"]]`);
  PMTeam.append("fields", '["hx_inspection_list","state", "start_datetime", "end_datetime", "order_id", "order_state", "check_list_id","maintenance_team_id","company_id"]');

  
  let resSoftService = "";
  let resMAndE = "";
  let res = "";

  if (params.filter === "inspections") {
  [resSoftService, resMAndE] = await Promise.all([
    callApi(softService, accessToken),
    callApi(mAndETeam, accessToken)
  ]);
  }else if(params.filter === "helpdesk"){
    res = await callApi(data, accessToken);
  }else {
    [resSoftService, resMAndE,res] = await Promise.all([
      callApi(softService, accessToken),
      callApi(mAndETeam, accessToken),
      callApi(data, accessToken)
    ]);
  }

  
  let softServiceData = resSoftService.data?.data !== undefined ? countStatusInspection(resSoftService.data?.data) : 0;
  let mAndEData =  resMAndE.data?.data !== undefined ? countStatusInspection(resMAndE.data?.data) : 0;
  let PmTeamData = PMTeam.data?.data !== undefined ? countStatusInspection(PMTeam.data?.data) : 0;

  function updateKeyInArray(arr, oldKey, newKey) {
    return arr.map(obj => {
      const { [oldKey]: value, ...rest } = obj;
      return { ...rest, [newKey]: value };
    });
  }

  
 

let SoftService = resSoftService.data?.data.map(obj => {
  const { state, ...rest } = obj;
  const status = state === 'Missed' || state === 'Upcoming' ? 'Open' : state === 'Completed' ? 'Closed' : state;
  return { ...rest, status,subject: obj.check_list_id[1] };
});

let MAndE = resMAndE.data?.data.map(obj => {
  const { state, ...rest } = obj;
  const status = state === 'Missed' || state === 'Upcoming' ? 'Open' : state === 'Completed' ? 'Closed' : state;
  return { ...rest, status,subject: obj.check_list_id[1] };
});
  
let helpDesk = res.data?.data.map(obj => {
  const { create_date, sla_end_date, ...rest } = obj;
  return { ...rest, start_datetime: create_date, end_datetime: sla_end_date, status: obj.state_id[1] };
});

  let combinedArray = [
    ...(Array.isArray(resSoftService.data?.data) ? SoftService : []),
    ...(Array.isArray(resMAndE.data?.data) ? MAndE : []),
    ...(Array.isArray(PMTeam.data?.data) ? PMTeam.data.data : []),
    ...(Array.isArray(res.data?.data) ? helpDesk : [])
  ];

  const counts = combinedArray.reduce((result, obj) => {
    const { status } = obj;
    if (status === "Open") {
      result.openCount += 1;
    } else if (status === "Closed") {
      result.closedCount += 1;
    }
    return result;
  }, { openCount: 0, closedCount: 0 });

  // console.log("hiii",counts);

if(params.groupBy!==undefined){
  combinedArray=search(params.groupBy,combinedArray)
}


let dateDate = updateKeyInArray(combinedArray,"start_datetime","date")
console.log(dateDate.length);
let elapseDate =""
const currentDateAndTime = moment();
if(params.elapse==="sla"){
 elapseDate = dateDate.filter(({ end_datetime }) => {
  return moment(end_datetime, 'YYYY-MM-DD HH:mm:ss').isBefore(currentDateAndTime);
});

console.log("sla",elapseDate.length);
}else if(params.elapse==="oneHourSla"){
  const oneHourBefore = moment(currentDateAndTime).subtract(1, 'hour');
   elapseDate = dateDate.filter(({ end_datetime }) => {
    return moment(end_datetime, 'YYYY-MM-DD HH:mm:ss').isBetween(oneHourBefore, currentDateAndTime);
  });
  console.log("oneHourSla",elapseDate.length);
}else{
  elapseDate=dateDate
}

let groupedData = groupDataByDate(elapseDate)

// console.log(groupedData)
const countByDate = {};

for (const date in groupedData) {
  const objects = groupedData[date];
  let openCount = 0;
  let closedCount = 0;

  objects.forEach(obj => {
    if (obj.status === "Open") {
      openCount++;
    } else if (obj.status === "Closed") {
      closedCount++;
    }
  });

  countByDate[date] = {
    data: objects,
    chartData: {
      open: openCount,
      closed: closedCount
    }
  };
}

function fillMissingDates(data, startDate, endDate) {
  const result = {};

  let currentDate = new Date(startDate);
  let lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const dateString = formatDate(currentDate);

    if (data[dateString]) {
      result[dateString] = data[dateString];
    } else {
      result[dateString] = {
        data: [0],
        chartData: {
          open: 0,
          closed: 0
        }
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}


function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

const filledData = fillMissingDates(countByDate, date.currentDate, date.prevDate);


  resolve({
    teamCount:{
      softService: softServiceData,
      mAndE: mAndEData,
      PmTeam: PmTeamData,
    },
    totalCount:counts,
    tickets:filledData
  });

})

const inspectionSummary = (accessToken, date) => new Promise(async (resolve) => {
  
  let today =  new Date();
  let time = today.getTime();
  let currentTime = moment(time).format("HH:mm:ss");
  
  var softService = new FormData();
  softService.append("model", "hx.inspection_checklist_log");
  softService.append("domain", `[["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} ${currentTime}"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} ${currentTime}"],["maintenance_team_id", "ilike", "G1-Soft Services Team"]]`);
  softService.append("fields", '["state", "maintenance_team_id"]');

  var mAndETeam = new FormData();
  mAndETeam.append("model", "hx.inspection_checklist_log");
  mAndETeam.append("domain", `[["date", "=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1-M&E Team"]]`);
  mAndETeam.append("fields", '["state", "maintenance_team_id"]');

  var PMTeam = new FormData();
  PMTeam.append("model", "hx.inspection_checklist_log");
  PMTeam.append("domain", `[["date", "=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1 PM Team"]]`);
  PMTeam.append("fields", '["state", "maintenance_team_id"]');


  let PmTeamData = {}

  const resSoftService = await callApi(softService, accessToken);
  const resMAndE = await callApi(mAndETeam , accessToken);


    let softServiceData = countStatusInspection(resSoftService.data.data);
    let mAndEData = countStatusInspection(resMAndE.data.data);

    resolve({
      softService: softServiceData,
      mAndE: mAndEData,
      PmTeam: PmTeamData
    });

})
const inspectionSummary1 = (accessToken, date) => new Promise(async (resolve) => {
  
  let today =  new Date();
  let time = today.getTime();
  let currentTime = moment(time).format("HH:mm:ss");
  
  var softService = new FormData();
  softService.append("model", "hx.inspection_checklist_log");
  softService.append("domain", `[["date","<=","${moment(date.prevDate).format("YYYY-MM-DD")} ${currentTime}"],["date",">=","${moment(date.currentDate).format("YYYY-MM-DD")} ${currentTime}"],["maintenance_team_id", "ilike", "G1-Soft Services Team"]]`);
  softService.append("fields", '["state", "maintenance_team_id"]');

  var mAndETeam = new FormData();
  mAndETeam.append("model", "hx.inspection_checklist_log");
  // mAndETeam.append("domain", `[["date", "=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1-M&E Team"]]`);
  mAndETeam.append("domain", `[["date", ">=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["date", "<=", "${moment(date.prevDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1-M&E Team"]]`);
  mAndETeam.append("fields", '["state", "maintenance_team_id"]');

  var PMTeam = new FormData();
  PMTeam.append("model", "hx.inspection_checklist_log");
  PMTeam.append("domain", `[["date", ">=", "${moment(date.currentDate).format("YYYY-MM-DD")}"],["date", "<=", "${moment(date.prevDate).format("YYYY-MM-DD")}"],["maintenance_team_id", "ilike", "G1 PM Team"]]`);
  PMTeam.append("fields", '["state", "maintenance_team_id"]');


  // let PmTeamData = {}

  const resSoftService = await callApi(softService, accessToken);
  const resMAndE = await callApi(mAndETeam , accessToken);
  const PmTeamData = await callApi(PMTeam , accessToken);



  console.log(PmTeamData.data.data.length)
    let softServiceData = countStatusInspection(resSoftService.data.data);
    let mAndEData = countStatusInspection(resMAndE.data.data);

    resolve({
      softService: softServiceData,
      mAndE: mAndEData,
      PmTeam: PmTeamData
    });

})

const getIncedent = (accessToken) => new Promise(async (resolve) => {
  var data = new FormData();
  data.append("model", 'website.support.ticket');
  data.append("domain", `[["issue_type", "=", "incident"]]`);
  data.append(
    "fields", `["ticket_number","create_date","priority_id","category_id","subject","incident_state" , "incident_type_id","state_id","equipment_location_id","sla_status","person_name"]`
  );



    const res = await callApi( data, accessToken);

    resolve(res.data.data);

})

const getWaterTankValues = (accessToken, date) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var flushingWaterTank = new FormData();
  flushingWaterTank.append('model', 'maintenance.reading.log');
  flushingWaterTank.append('domain', `[["equipment_id", "in",[83557]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  flushingWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var STPWaterTank = new FormData();
  STPWaterTank.append('model', 'maintenance.reading.log');
  STPWaterTank.append('domain', `[["equipment_id", "in",[83563]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  STPWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var domesticWaterTank = new FormData();
  domesticWaterTank.append('model', 'maintenance.reading.log');
  domesticWaterTank.append('domain', `[["equipment_id", "in",[83554]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  domesticWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var WTPWaterTank = new FormData();
  WTPWaterTank.append('model', 'maintenance.reading.log');
  WTPWaterTank.append('domain', `[["equipment_id", "in",[83550]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  WTPWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var FireWaterTank = new FormData();
  FireWaterTank.append('model', 'maintenance.reading.log');
  FireWaterTank.append('domain', `[["equipment_id", "in",[83551]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  FireWaterTank.append('fields', '["equipment_id", "date", "value"]');



    let flushingWaterTankData = await callApi( flushingWaterTank, accessToken);
    let STPWaterTankData = await callApi( STPWaterTank, accessToken);
    let WTPWaterTankData = await callApi( WTPWaterTank, accessToken);
    let FireWaterTankData = await callApi( FireWaterTank, accessToken);
    let domesticWaterTankData = await callApi( domesticWaterTank, accessToken);

    flushingWaterTankData = flushingWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    STPWaterTankData = STPWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    domesticWaterTankData = domesticWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    WTPWaterTankData = WTPWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    FireWaterTankData = FireWaterTankData?.data?.data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })


    let consumptionFlushingWaterTankData = cosumptionCalculation(flushingWaterTankData, 0, date);

    let consumptionSTPWaterTankData = cosumptionCalculation(STPWaterTankData, 0, date);

    let consumptionDomesticWaterTankData = cosumptionCalculation(domesticWaterTankData, 0, date);
    let consumptionWTPWaterTankData = cosumptionCalculation(WTPWaterTankData, 0, date);
    let consumptionFireWaterTankData = cosumptionCalculation(FireWaterTankData, 0, date);


    // console.log("--------consumptionFlushingWaterTankData---",consumptionFlushingWaterTankData);
    // console.log("--------consumptionSTPWaterTankData---",consumptionSTPWaterTankData);
    // console.log("--------consumptionDomesticWaterTankData---",consumptionDomesticWaterTankData);
    // console.log("--------consumptionWTPWaterTankData---",consumptionWTPWaterTankData);
    // console.log("--------consumptionFireWaterTankData---",consumptionFireWaterTankData);

    resolve({
      consumptionFlushingWaterTankData: consumptionFlushingWaterTankData,
      consumptionSTPWaterTankData: consumptionSTPWaterTankData,
      consumptionDomesticWaterTankData: consumptionDomesticWaterTankData,
      consumptionWTPWaterTankData: consumptionWTPWaterTankData,
      consumptionFireWaterTankData: consumptionFireWaterTankData
    });
  // } catch (error) {
  //   console.log("error- water tank", error);
  //   reject(error);

  // }

})

const getWaterTankValues1 = (accessToken, date,params) => new Promise(async (resolve) => {

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  var flushingWaterTank = new FormData();
  flushingWaterTank.append('model', 'maintenance.reading.log');
  flushingWaterTank.append('domain', `[["equipment_id", "in",[83557]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  flushingWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var STPWaterTank = new FormData();
  STPWaterTank.append('model', 'maintenance.reading.log');
  STPWaterTank.append('domain', `[["equipment_id", "in",[83563]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  STPWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var domesticWaterTank = new FormData();
  domesticWaterTank.append('model', 'maintenance.reading.log');
  domesticWaterTank.append('domain', `[["equipment_id", "in",[83554]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  domesticWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var WTPWaterTank = new FormData();
  WTPWaterTank.append('model', 'maintenance.reading.log');
  WTPWaterTank.append('domain', `[["equipment_id", "in",[83550]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  WTPWaterTank.append('fields', '["equipment_id", "date", "value"]');

  var FireWaterTank = new FormData();
  FireWaterTank.append('model', 'maintenance.reading.log');
  FireWaterTank.append('domain', `[["equipment_id", "in",[83551]],["date",">=","${moment(date.prevDate).format("YYYY-MM-DD")} 00:20:00"],["date","<","${moment(date.currentDate).format("YYYY-MM-DD")} 04:30:00"]]`);
  FireWaterTank.append('fields', '["equipment_id", "date", "value"]');

  

    // let flushingWaterTankData = await callApi( flushingWaterTank, accessToken);
    // let STPWaterTankData = await callApi( STPWaterTank, accessToken);
    // let WTPWaterTankData = await callApi( WTPWaterTank, accessToken);
    // let FireWaterTankData = await callApi( FireWaterTank, accessToken);
    // let domesticWaterTankData = await callApi( domesticWaterTank, accessToken);

    let [
      flushingWaterTankData,
      STPWaterTankData,
      WTPWaterTankData,
      FireWaterTankData,
      domesticWaterTankData
    ] = await Promise.all([
      callApi(flushingWaterTank, accessToken),
      callApi(STPWaterTank, accessToken),
      callApi(WTPWaterTank, accessToken),
      callApi(FireWaterTank, accessToken),
      callApi(domesticWaterTank, accessToken)
    ]);

    flushingWaterTankData = flushingWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
   
    STPWaterTankData = STPWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    domesticWaterTankData = domesticWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    WTPWaterTankData = WTPWaterTankData?.data?.data.filter(d => d.value !== 0).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    FireWaterTankData = FireWaterTankData?.data?.data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })


  const groupBy = params?.groupBy;

  let rep1 = '',
   rep2 = '',
   rep3 = '',
   rep4 = '',
   rep5 = ''
  if (groupBy === 'hour') {
    rep1 = groupDataByHour(flushingWaterTankData);
     rep2 = groupDataByHour(STPWaterTankData);
     rep3 = groupDataByHour(domesticWaterTankData);
     rep4 = groupDataByHour(WTPWaterTankData);
     rep5 = groupDataByHour(FireWaterTankData);
  } else {
     rep1 = groupDataByDate(flushingWaterTankData);
     rep2 = groupDataByDate(STPWaterTankData);
     rep3 = groupDataByDate(domesticWaterTankData);
     rep4 = groupDataByDate(WTPWaterTankData);
     rep5 = groupDataByDate(FireWaterTankData);
  }

     

    let consumptionFlushingWaterTankData = consumptionCalculationForMultipleData(rep1, 0, date);

    let consumptionSTPWaterTankData = consumptionCalculationForMultipleData(rep2, 0, date);

    let consumptionDomesticWaterTankData = consumptionCalculationForMultipleData(rep3, 0, date);
    let consumptionWTPWaterTankData = consumptionCalculationForMultipleData(rep4, 0, date);
    let consumptionFireWaterTankData = consumptionCalculationForMultipleData(rep5, 0, date);

   
    if(groupBy === 'week' || groupBy === 'month'){
      consumptionFlushingWaterTankData = groupData(consumptionFlushingWaterTankData,groupBy)
      consumptionSTPWaterTankData = groupData(consumptionSTPWaterTankData,groupBy)
      consumptionDomesticWaterTankData = groupData(consumptionDomesticWaterTankData,groupBy)
      consumptionWTPWaterTankData = groupData(consumptionWTPWaterTankData,groupBy)
      consumptionFireWaterTankData = groupData(consumptionFireWaterTankData,groupBy)
    }

    let DescriptiveDate = {
      consumptionFlushingWaterTankData: Descriptive(consumptionFlushingWaterTankData),
      consumptionSTPWaterTankData:Descriptive(consumptionSTPWaterTankData),
      consumptionDomesticWaterTankData:Descriptive(consumptionDomesticWaterTankData),
      consumptionWTPWaterTankData:Descriptive(consumptionWTPWaterTankData),
      consumptionFireWaterTankData:Descriptive(consumptionFireWaterTankData),
    } 


    if(params.analytics !== undefined){
    
      // let predictionData1 = await prediction(consumptionFlushingWaterTankData,params)
      // let predictionData2 =   await prediction(consumptionSTPWaterTankData,params)
      // let predictionData3 =   await prediction(consumptionDomesticWaterTankData,params)   
      // let predictionData4 =   await prediction(consumptionWTPWaterTankData,params)   
      // let predictionData5 =   await prediction(consumptionFireWaterTankData,params)   

      const [
        predictionData1,
        predictionData2,
        predictionData3,
        predictionData4,
        predictionData5
      ] = await Promise.all([
        prediction(consumptionFlushingWaterTankData, params),
        prediction(consumptionSTPWaterTankData, params),
        prediction(consumptionDomesticWaterTankData, params),
        prediction(consumptionWTPWaterTankData, params),
        prediction(consumptionFireWaterTankData, params)
      ]);
      resolve({
        consumptionFlushingWaterTankData:predictionData1 ,
        consumptionSTPWaterTankData: predictionData2,
        consumptionDomesticWaterTankData:predictionData3,
        consumptionWTPWaterTankData:predictionData4,
        consumptionFireWaterTankData:predictionData5,
      });
    }

    let chartData  = {
      consumptionFlushingWaterTankData: consumptionFlushingWaterTankData,
      consumptionSTPWaterTankData: consumptionSTPWaterTankData,
      consumptionDomesticWaterTankData: consumptionDomesticWaterTankData,
      consumptionWTPWaterTankData: consumptionWTPWaterTankData,
      consumptionFireWaterTankData: consumptionFireWaterTankData,
    }
    // let TotalConsumption = calculateTotalConsumption(chartData)
    // console.log(TotalConsumption)
    const result = await triggerSchemas.getWaterTankValues.findOne({ graph: "getWaterTankValues" });
    
    if (result?.toggle === true && result?.filter === params?.filter) {
    
      const condition = [
        {
          operator: result.limit.min.comparisonOperator,
          limit: result.limit.min.value,
        }, // min <= 75000
        {
          operator: result.limit.max.comparisonOperator,
          limit: result.limit.max.value,
        }, // max >= 115000
      ];
    
      const countdata1 = countConsumption(consumptionFlushingWaterTankData, condition,result.updatedAt);
      const countdata2 = countConsumption(consumptionSTPWaterTankData, condition,result.updatedAt);
      const countdata3 = countConsumption(consumptionDomesticWaterTankData, condition,result.updatedAt);
      const countdata4 = countConsumption(consumptionWTPWaterTankData, condition,result.updatedAt);
      const countdata5 = countConsumption(consumptionFireWaterTankData, condition,result.updatedAt);
    
    console.log(countdata1,countdata2,countdata3,countdata4)
      
    const processAndUpdate = async (countdata, Source) => {
      if (countdata.count >= result.exceedTimes || countdata.count ===0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const query = {
          updatedAt: { $gte: today },
          'getWaterTankValues.Source': Source, 
        }
    
        const update = {
          $set: {
            'getWaterTankValues.$.triggerNumber': countdata.count,
            'getWaterTankValues.$.values': countdata.values,
          },
        };
    
        const helpDesk = await HelpDesk.findOne(query);
    
        if (helpDesk) {
          await HelpDesk.updateOne(query, update);
        } else {
          // Add new transformerIC element
          const newElement = {
            Source: Source,
            triggerNumber: countdata.count,
            values: countdata.values,
          };
    
          await HelpDesk.updateOne({ updatedAt: { $gte: today } }, { $push: { getWaterTankValues: { $each: [newElement], $position: 0, $slice: 5 } } });
        }
      }
    };
    
    await Promise.all([
      processAndUpdate(countdata1, 'consumptionFlushingWaterTankData'),
      processAndUpdate(countdata2, 'consumptionSTPWaterTankData'),
      processAndUpdate(countdata3, 'consumptionDomesticWaterTankData'),
      processAndUpdate(countdata4, 'consumptionWTPWaterTankData'),
      processAndUpdate(countdata5, 'consumptionFireWaterTankData')
    ]);
    
    }


    resolve({
      chartData:chartData,
      DescriptiveDate:DescriptiveDate,
    });
  

})



const getDailyManagementReport = async (accessToken, date) => {
  
  let newDate = new Date(date)
  let today = moment(newDate).format("YYYY-MM-DD");
  let yesterday = moment(today).subtract(1, 'day').format("YYYY-MM-DD")
  // yesterday.setDate(today.getDate() - 1);

  let DateObj = {
    prevDate: yesterday,
    currentDate: today,
  }
  try {
  let resAll = await Promise.all([htGrid(accessToken, DateObj), transformerIC(accessToken, DateObj), transformerOG(accessToken, DateObj),
    tower1EbConsumption(accessToken, DateObj), feederConsumptionLT(accessToken, DateObj), DgRoomConsumption(accessToken, DateObj), spareFeeder(accessToken, DateObj),
    AHURoom(accessToken, DateObj), liftPanel(accessToken, DateObj), risingMain(accessToken, DateObj), yardConsumption(accessToken, DateObj),
    DGUnit(accessToken, DateObj), DGRunHours(accessToken, DateObj), ChillerConsumption(accessToken, DateObj), ChillerApproach(accessToken, DateObj),
    OperativeSummary(accessToken, DateObj), helpDesk(accessToken, DateObj), inspectionSummary(accessToken, DateObj),getIncedent(accessToken, DateObj),getWaterTankValues(accessToken, DateObj),
    DGHDCConsumption(accessToken, DateObj)]);
    // console.log(resAll[3], "resAll[3]");
    // let yesdData = await yardConsumption(accessToken);
    // console.log(resAll[10],"yesdData")
    let obj = {
      HtGridConsumption: resAll[0],
      transformerIc: resAll[1],
      transformerOG: resAll[2],
      energyMeterTower1: resAll[3],
      feederConsumption: resAll[4],
      DgRoomConsumption: resAll[5],
      spareFeeder: resAll[6],
      AHURoom: resAll[7],
      liftPanel: resAll[8],
      risingMain: resAll[9],
      yardConsumption: resAll[10],
      DgUnit: resAll[11],
      DgRunHours: resAll[12],
      chillerConsumption: resAll[13],

      chillerApproach: resAll[14],
      oprativeSummary: resAll[15],
      helpDesk: resAll[16],
      inspectionSummary: resAll[17],
      incedentData: resAll[18],
      waterTankValues: resAll[19],
      DgHDC: resAll[20]
    }
   
    // console.log(obj, "check dtaat")
    // fs.writeFile('output.json', JSON.stringify(obj), err => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log('Data has been written to output.json file');
    // });
    let created = createExcell(obj, DateObj);
    
    return created;
  } catch (error) {
    console.log("error----", error);
  }
}

const getDailyManagementReport1 = async (accessToken, date) => {
  
  let newDate = date.startDate
  let today = moment(newDate).format("YYYY-MM-DD");
  let yesterday = moment(date.endDate).format("YYYY-MM-DD")
  

  let DateObj = {
    prevDate: yesterday,
    currentDate: today,
  }

  try {
   let resAll = await Promise.all([htGrid1(accessToken, DateObj), transformerIC1(accessToken, DateObj), transformerOG1(accessToken, DateObj),
      tower1EbConsumption1(accessToken, DateObj),feederConsumptionLT1(accessToken, DateObj),DgRoomConsumption1(accessToken, DateObj),spareFeeder1(accessToken, DateObj),
      AHURoom1(accessToken, DateObj),liftPanel1(accessToken, DateObj),risingMain1(accessToken, DateObj), yardConsumption1(accessToken, DateObj), DGUnit1(accessToken, DateObj),
      DGRunHours1(accessToken, DateObj),ChillerConsumption1(accessToken, DateObj),ChillerApproach1(accessToken, DateObj),OperativeSummary1(accessToken, DateObj),helpDesk(accessToken, DateObj),
      inspectionSummary1(accessToken, DateObj),getIncedent(accessToken, DateObj),getWaterTankValues1(accessToken, DateObj),DGHDCConsumption1(accessToken, DateObj)
    ]);
   
    

    let obj = {
      HtGridConsumption: resAll[0],
      transformerIc: resAll[1],
      transformerOG: resAll[2],
      energyMeterTower1: resAll[3],
      feederConsumption: resAll[4],
      DgRoomConsumption: resAll[5],
      spareFeeder: resAll[6],
      AHURoom: resAll[7],
      liftPanel: resAll[8],
      risingMain: resAll[9],
      yardConsumption: resAll[10],
      DgUnit: resAll[11],
      DgRunHours: resAll[12],
      chillerConsumption: resAll[13],
      chillerApproach: resAll[14],
      oprativeSummary: resAll[15],
      helpDesk: resAll[16],
      inspectionSummary: resAll[17],
      incedentData: resAll[18],
      waterTankValues: resAll[19],
      DgHDC: resAll[20]
      
    }
   
  
 
  return obj

  } catch (error) {
    console.log("error----", error);
  }
}

const pochelixapi = (accessToken, date,params) => new Promise(async (resolve) => {

  var mainMeter = 'rakesh'

  let resMain = await helixsensecallApi( mainMeter, accessToken);

    
  let mainData = resMain.data.data;

  
let DescriptiveDate = {
  mainMeter: Descriptive(mainData),
} ;


let chartData = {
  mainMeter: mainData,
};

resolve({
  chartData: chartData,
  DescriptiveDate: DescriptiveDate,
});
})


const dmrData = async (accessToken, date, params) => {

  let newDate = date.startDate;
  let today = moment(newDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  let yesterday = moment(date.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

  let DateObj = {
    prevDate: yesterday,
    currentDate: today,
  }
  
  const functions = {
    'htGrid': htGrid1,
    'substation': substation,
    'transformerIC': transformerIC1,
    'transformerOG': transformerOG1,
    'tower1EbConsumption': tower1EbConsumption1,
    'feederConsumptionLT': feederConsumptionLT1,
    'DgRoomConsumption': DgRoomConsumption1,
    'spareFeeder': spareFeeder1,
    'AHURoom': AHURoom1,
    'liftPanel': liftPanel1,
    'risingMain': risingMain1,
    'yardConsumption': yardConsumption1,
    'DGUnit': DGUnit1,
    'DGRunHours': DGRunHours1,
    'ChillerConsumption': ChillerConsumption1,
    'ChillerApproach': ChillerApproach1,
    'OperativeSummary': OperativeSummary1,
    'helpDesk1': helpDesk,
    'inspectionSummary': inspectionSummary1,
    'getIncedent1': getIncedent,
    'getWaterTankValues': getWaterTankValues1,
    'AMC': AMC,
    'DGHDCConsumption': DGHDCConsumption1,
    'multiscreen': multiscreen,
    'pochelixapi':pochelixapi

  };

  const func = functions[params.type];
  if (func) {
    const res = await func(accessToken, DateObj,params);
    try {
      fs.writeFile('rep.json', JSON.stringify(res), err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Data has been written to output.json file');
      });
    } catch (error) {
      console.log("error----", error);
    }
    return res;
  } else {
    throw new Error(`Invalid type specified: ${type}`);
  }
}


module.exports =  {
  getToken,
  helixsenseGetToken,
  getDailyManagementReport,
  getDailyManagementReport1,
  dmrData
}