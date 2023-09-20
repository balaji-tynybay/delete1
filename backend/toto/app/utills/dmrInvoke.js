const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../dmr/model/index.js");
const HelpDesk  = db.HelpDesk;
const multer = require("multer");
const upload = multer();
const {
  getDailyManagementReport,
  getToken,
  helixsenseGetToken,
  getDailyManagementReport1,
  dmrData
} = require("./dmrService.js");
const fs = require("fs");
const path = require("path");




// getDailyManagementReport

let filename = "";
async function task1() {

  const dir = path.join(process.cwd(), 'xlsx-files');
  fs.access(dir, (error) => {
    if (error) {
      fs.mkdirSync(dir, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("New Directory created successfully !!");
        }
      });
    } else {
      console.log("Given Directory already exists !!");
    }
  });

  let token = await getToken();
  let date = moment("2023-06-27").format("YYYY-MM-DD");

  let xlsxFileName = await getDailyManagementReport(token.access_token, date);
  console.log(
    "The answer to life, the universe, and everything!",
    xlsxFileName
  );
   
 

  filename = xlsxFileName;
  console.log('filename',filename)

  return filename;
}


// async function task2(date,params) {
  
//   const today = new Date();
//   today.setUTCHours(0, 0, 0, 0);
//   let tokendata = await helixsenseGetToken()
//   console.log(tokendata.access_token)
//   const [token, helpdesk] = await Promise.all([
//     helixsenseGetToken(),
//     HelpDesk.updateOne({ date: today }, { $setOnInsert: { date: today } }, { upsert: true })
//   ]);
//   console.log("login token1",new Date())
//   let DmrData = await dmrData(token.access_token, date,params);
//   console.log(new Date())
//  return DmrData;
// }
async function task2(date,params) {
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // let tokendata = await helixsenseGetToken()
  // console.log(tokendata.access_token)
  const token = await helixsenseGetToken();
  console.log("login token1",new Date())
  let DmrData = await dmrData(token.access_token, date,params);
  console.log(new Date())
 return DmrData;
}



module.exports = { task1, task2 };