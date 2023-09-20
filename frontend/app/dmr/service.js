const db = require("../dmr/model/index.js");
const excelReader = require('../utills/readExcel.js')
const { Descriptive, prediction, countConsumption } = require("../utills/dashboard.js");
const moment = require("moment");

const triggerSchemas = db.triggerSchemas;

const { task2 } = require("../utills/dmrInvoke.js");

triggerSetting = async (req, res) => {
  let currentDate = new Date();
  const { sub } = req.kauth.grant.access_token.content;
  let subId = sub.split("-").join("");
  const cName = req.query.type;

  const query = { graph: cName };
  const update = {
    toggle: req.body.toggle,
    filter: req.body.filter,
    subId: subId,
    limit: {
      min: {
        value: req.body.limit.min.value,
        comparisonOperator: req.body.limit.min.comparisonOperator,
      },
      max: {
        value: req.body.limit.max.value,
        comparisonOperator: req.body.limit.max.comparisonOperator,
      },
    },
    exceedTimes: req.body.exceedTimes,
    date: currentDate,
    interval: req.body.interval,
    graph: cName,
  };
  const options = { upsert: true, new: true };

  try {
    const result = await triggerSchemas[cName].findOneAndUpdate(
      query,
      update,
      options
    );
    console.log(result);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send("something went wrong ");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

getTriggerSetting = async (req, res) => {
  const cName = req.query.type;
  const query = { graph: cName };
  try {
    const result = await triggerSchemas[cName].findOne(query);
    console.log(result);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send("something went wrong ");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

getHelpDesk = async (req, res) => {
  try {
    const result = await HelpDesk.find({});

    let data = [];
    result.forEach((element) => {
      pushData("htGrid", element.htGrid, element.updatedAt);
      pushData("transformerIC", element.transformerIC, element.updatedAt);
      pushData("transformerOG", element.transformerOG, element.updatedAt);
      pushData(
        "feederConsumptionLT",
        element.feederConsumptionLT,
        element.updatedAt
      );
      pushData(
        "DgRoomConsumption",
        element.DgRoomConsumption,
        element.updatedAt
      );
      pushData("spareFeeder", element.spareFeeder, element.updatedAt);
      pushData("AHURoom", element.AHURoom, element.updatedAt);
      pushData("liftPanel", element.liftPanel, element.updatedAt);
      pushData("risingMain", element.risingMain, element.updatedAt);
      pushData("DGUnit", element.DGUnit, element.updatedAt);
      pushData("DGRunHours", element.DGRunHours, element.updatedAt);
      pushData(
        "ChillerConsumption",
        element.ChillerConsumption,
        element.updatedAt
      );
      pushData("ChillerApproach", element.ChillerApproach, element.updatedAt);
      pushData(
        "getWaterTankValues",
        element.getWaterTankValues,
        element.updatedAt
      );
    });
    function pushData(arrayName, dataArray, date) {
      for (let i = 0; i < dataArray.length; i++) {
        if (
          dataArray[i]?.values.length !== 0 &&
          dataArray[i]?.values.length !== undefined
        ) {
          const inputObj = dataArray[i];
          const outputObj = {
            subject: generateSubject(inputObj),
            equipment_id: arrayName,
            date: date,
          };
          function generateSubject(obj) {
            let subject = obj.Source || "";
            if (Array.isArray(obj.triggerNumber)) {
              subject += " " + obj.triggerNumber.join(" ");
            }
            if (Array.isArray(obj.values)) {
              subject += " " + obj.values.join(" ");
            }
            return subject.trim();
          }
          console.log(".........", outputObj);
          data.push(outputObj);
        }
      }
    }

    if (result) {
      res.status(200).send(data);
    } else {
      res.status(400).send("something went wrong ");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

dmrData = async (req, res) => {
  try {
    if (req.query.analytics === undefined) {
      let date = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };
      let params = {
        type: req.query.type,
        filter: req.query.filter,
        groupBy: req.query.groupBy,
        elapse: req.query.elapse,
      };
      console.log("Api called ", new Date());
      let result = await task2(date, params);
      res.status(200).send(result);
    } else if (req.query.analytics === "prediction") {
      let yesterday = moment().format("YYYY-MM-DD"); // Assuming you have a valid date object in "date.endDate" variable
      let newDate = moment(yesterday).subtract(30, "days").format("YYYY-MM-DD");
      let date = {
        startDate: yesterday,
        endDate: newDate,
      };
      let params = {
        type: req.query.type,
        predictType: req.query.predictType,
        predictPeriod: req.query.predictPeriod,
        analytics: req.query.analytics,
        filter: req.query.filter,
        groupBy: req.query.groupBy,
      };

      let result = await task2(date, params);
      res.status(200).send(result);
    } else {
      res.status(400).send("data not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

pocHelix = async (req, res) => {
  try {
    const filePath = 'dmrData.xlsx'; 
    const sheetName = 'Sheet1';
    let mainData = excelReader.readExcelSheetToJson(filePath, sheetName);
    
    let DescriptiveDate = {
      mainMeter: Descriptive(mainData),
    };
   
    if(req.params.analytics !== undefined){
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
    
    let chartData = {
      mainMeter: mainData,
    };
    res.status(200).send({
      chartData: chartData,
      DescriptiveDate: DescriptiveDate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};



module.exports = {
  triggerSetting,
  getTriggerSetting,
  dmrData,
  getHelpDesk,
  pocHelix,
};
