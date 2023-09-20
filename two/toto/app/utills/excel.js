const moment = require("moment");
const Excel = require("exceljs");
const path = require("path");
const fs = require("fs").promises;
const libre = require("libreoffice-convert");
const { promisify } = require("util");

libre.convertAsync = promisify(libre.convert);

const fixedAfterDecimal = (value) => {
  const newDatas = value.toString().split(".");
  const finalValue = `${newDatas?.length>1 ?newDatas[0]+'.'+newDatas[1].slice(0, 3):newDatas[0]}`;
  return parseFloat(finalValue).toFixed(2);
}
const createExcell = (data, date) => {
  const {
    HtGridConsumption,
    transformerIc,
    transformerOG,
    energyMeterTower1,
    feederConsumption,
    DgRoomConsumption,
    spareFeeder,
    AHURoom,
    liftPanel,
    risingMain,
    yardConsumption,
    DgUnit,
    DgRunHours,
    chillerConsumption,
    chillerApproach,
    oprativeSummary,
    helpDesk,
    inspectionSummary,
    incedentData,
    waterTankValues,
    DgHDC,
  } = data;
  // console.log(DgHDC, "data in excell");
  var workbook = new Excel.Workbook();
  // let today = new Date(date);
  // let previousDate = new Date(date);
  // previousDate.setDate(today.getDate() - 1);
  let stringTodayDate = moment(date.currentDate).format("Do MMMM");
  // let time = moment(today).format("h:mm a");
  // console.log(stringTodayDate.toUpperCase(), time, "newDate");
  let stringYestDate = moment(date.prevDate).format("Do MMMM");
  // let time2 = moment(today).format("h:mm a");
  // console.log("---------waterTankValues---",waterTankValues);

  // const fileName = `DMR-${moment().format('lll')}.xlsx`
  // var workbookNew = aspose.cells.Workbook(`./mainExcell.xlsx`);

  // workbookNew.save(`./xlsx-files/${fileName}`, aspose.cells.FileFormatType.EXCEL_97_TO_2003);
  // return fileName;

  return workbook.xlsx.readFile("./temp.xlsx").then(async function () {
    var worksheet = workbook.getWorksheet(1);
    // worksheet.views = [{showGridLines: false}];

    var row = worksheet.getRow(8);
    row.getCell(
      1
    ).value = `${stringTodayDate.toUpperCase()} 6:00 a.m TO ${stringYestDate.toUpperCase()} 6:00 a.m`;

    let cell_c12 = HtGridConsumption.mainMeter?.initialReading || 0;
    let cell_d12 = HtGridConsumption.mainMeter?.finalReading || 0;
    let cell_f12 = HtGridConsumption.mainMeter?.meterFactor || 0;
    let cell_e12;
    let cell_g12;

    var mainMeter = worksheet.getRow(12);
    mainMeter.getCell(3).value = isNaN(cell_c12) || cell_c12 === 0 ? cell_c12 : +cell_c12.toFixed(2);
    mainMeter.getCell(4).value = isNaN(cell_d12) || cell_d12 === 0 ? cell_d12 : +cell_d12.toFixed(2);
    mainMeter.getCell(6).value = isNaN(cell_f12) || cell_f12 === 0 ? cell_f12 : +cell_f12.toFixed(2);

    cell_e12 = isNaN(cell_d12) || isNaN(cell_c12) || isNaN(cell_f12) ? "No Reading" : (cell_d12 - cell_c12) * cell_f12;
    mainMeter.getCell(5).value = isNaN(cell_e12) || cell_e12 === 0 ? cell_e12 : +cell_e12.toFixed(2);

    cell_g12 = isNaN(cell_e12) ? "No Reading" : cell_e12 * 0.85;
    mainMeter.getCell(7).value = isNaN(cell_g12) || cell_g12 === 0 ? cell_g12 : +cell_g12.toFixed(2);
    // mainMeter.getCell(5).value = { formula: '(D12-C12)*F12'};
    // mainMeter.getCell(7).value = { formula: '(E12*0.85' };

    let cell_c13 = HtGridConsumption.incomerMeter?.initialReading || 0;
    let cell_d13 = HtGridConsumption.incomerMeter?.finalReading || 0;
    let cell_f13 = HtGridConsumption.incomerMeter?.meterFactor || 0;
    let cell_e13;
    let cell_g13;

    var incomer = worksheet.getRow(13);
    incomer.getCell(3).value = isNaN(cell_c13) || cell_c13 === 0 ? cell_c13 : +cell_c13.toFixed(2);
    incomer.getCell(4).value = isNaN(cell_d13) || cell_d13 === 0 ? cell_d13 : +cell_d13.toFixed(2);
    incomer.getCell(6).value = isNaN(cell_f13) || cell_f13 === 0 ? cell_f13 : +cell_f13.toFixed(2);

    cell_e13 = isNaN(cell_d13) || isNaN(cell_c13) || isNaN(cell_f13) ? "No Reading" : (cell_d13 - cell_c13) * cell_f13;
    incomer.getCell(5).value = isNaN(cell_e13) || cell_e13 === 0 ? cell_e13 : +cell_e13.toFixed(2);

    cell_g13 = isNaN(cell_e13) ? "No Reading" : cell_e13 * 0.85;
    incomer.getCell(7).value = isNaN(cell_g13) || cell_g13 === 0 ? cell_g13 : +cell_g13.toFixed(2);
    // incomer.getCell(5).value = { formula: '(D13-C13)*F13'};
    // incomer.getCell(7).value = { formula: '(E13*0.85' };

    let cell_c16 = isNaN(cell_e12) || isNaN(cell_e13) ? "No Reading" : cell_e12 - cell_e13;
    var diffConsumption = worksheet.getRow(16);
    diffConsumption.getCell(3).value = isNaN(cell_c16) || cell_c16 === 0 ? cell_c16 : +fixedAfterDecimal(cell_c16);
    // diffConsumption.getCell(3).value = { formula: '(E12-E13)' }

    let cell_c19 = transformerIc.trans1Data?.initialReading || 0;
    let cell_d19 = transformerIc.trans1Data?.finalReading || 0;
    let cell_f19 = transformerIc.trans1Data?.meterFactor || 0;
    let cell_e19;
    var transformerIC1 = worksheet.getRow(19);
    transformerIC1.getCell(3).value = isNaN(cell_c19) || cell_c19 === 0 ? cell_c19 : +cell_c19.toFixed(2);
    transformerIC1.getCell(4).value = isNaN(cell_d19) || cell_d19 === 0 ? cell_d19 : +cell_d19.toFixed(2);
    transformerIC1.getCell(6).value = isNaN(cell_f19) || cell_f19 === 0 ? cell_f19 : +cell_f19.toFixed(2);
    cell_e19 = isNaN(cell_d19) || isNaN(cell_c19) || isNaN(cell_f19) ? "No Reading" : (cell_d19 - cell_c19) * cell_f19;
    transformerIC1.getCell(5).value = isNaN(cell_e19) || cell_e19 === 0 ? cell_e19 : +cell_e19.toFixed(2);
    // transformerIC1.getCell(5).value = { formula: '(D19-C19)*F19'};

    let cell_c20 = transformerIc.trans2Data?.initialReading || 0;
    let cell_d20 = transformerIc.trans2Data?.finalReading || 0;
    let cell_f20 = transformerIc.trans2Data?.meterFactor || 0;
    let cell_e20;
    var transformerIC2 = worksheet.getRow(20);
    transformerIC2.getCell(3).value = isNaN(cell_c20) || cell_c20 === 0 ? cell_c20 : +cell_c20.toFixed(2);
    transformerIC2.getCell(4).value = isNaN(cell_d20) || cell_d20 === 0 ? cell_d20 : +cell_d20.toFixed(2);
    transformerIC2.getCell(6).value = isNaN(cell_f20) || cell_f20 === 0 ? cell_f20 : +cell_f20.toFixed(2);

    cell_e20 = isNaN(cell_d20) || isNaN(cell_c20) || isNaN(cell_f20) ? "No Reading" : (cell_d20 - cell_c20) * cell_f20;
    transformerIC2.getCell(5).value = isNaN(cell_e20) || cell_e20 === 0 ? cell_e20 : +cell_e20.toFixed(2);
    // transformerIC2.getCell(5).value = { formula: '(D20-C20)*F20'};

    let cell_c23 = isNaN(cell_e13) || isNaN(cell_e19) || isNaN(cell_e20) ? "No Reading" : cell_e13 - (cell_e19 + cell_e20);
    var transmissionLoss = worksheet.getRow(23);
    transmissionLoss.getCell(3).value = isNaN(cell_c23) || cell_c23 === 0 ? cell_c23 : +cell_c23.toFixed(2);
    // transmissionLoss.getCell(3).value = { formula: 'E13-(E19+E20)' };

    let cell_c24 = isNaN(cell_c23) || isNaN(cell_e13) ? "No Reading" : (cell_c23 / cell_e13) * 100;
    var transmissionLoss = worksheet.getRow(24);
    transmissionLoss.getCell(3).value = isNaN(cell_c24) || cell_c24 === 0 ? cell_c24 : +cell_c24.toFixed(2);
    // transmissionLoss.getCell(3).value = { formula: '(C23/E13)*100' };

    let cell_c26 = transformerOG.trans1Data?.initialReading || 0;
    let cell_d26 = transformerOG.trans1Data?.finalReading || 0;
    let cell_f26 = transformerOG.trans1Data?.meterFactor || 0;
    let cell_e26;
    var transformerOg1 = worksheet.getRow(26);
    transformerOg1.getCell(3).value = isNaN(cell_c26) || cell_c26 === 0 ? cell_c26 : +cell_c26.toFixed(2);
    transformerOg1.getCell(4).value = isNaN(cell_d26) || cell_d26 === 0 ? cell_d26 : +cell_d26.toFixed(2);
    transformerOg1.getCell(6).value = isNaN(cell_f26) || cell_f26 === 0 ? cell_f26 : +cell_f26.toFixed(2);

    cell_e26 = isNaN(cell_d26) || isNaN(cell_c26) || isNaN(cell_f26) ? "No Reading" : (cell_d26 - cell_c26) * cell_f26;
    transformerOg1.getCell(5).value = isNaN(cell_e26) || cell_e26 === 0 ? cell_e26 : +cell_e26.toFixed(2);

    // transformerOg1.getCell(5).value = { formula: '(D26-C26)*F26'};

    let cell_c27 = transformerOG.trans2Data?.initialReading || 0;
    let cell_d27 = transformerOG.trans2Data?.finalReading || 0;
    let cell_f27 = transformerOG.trans2Data?.meterFactor || 0;
    let cell_e27;
    var transformerOg2 = worksheet.getRow(27);
    transformerOg2.getCell(3).value = isNaN(cell_c27) || cell_c27 === 0 ? cell_c27 : +cell_c27.toFixed(2);
    transformerOg2.getCell(4).value = isNaN(cell_d27) || cell_d27 === 0 ? cell_d27 : +cell_d27.toFixed(2);
    transformerOg2.getCell(6).value = isNaN(cell_f27) || cell_f27 === 0 ? cell_f27 : +cell_f27.toFixed(2);

    cell_e27 = isNaN(cell_d27) || isNaN(cell_c27) || isNaN(cell_f27) ? "No Reading" : (cell_d27 - cell_c27) * cell_f27;
    transformerOg2.getCell(5).value = isNaN(cell_e27) || cell_e27 === 0 ? cell_e27 : +cell_e27.toFixed(2);
    // transformerOg2.getCell(5).value = { formula: '(D27-C27)*F27'};

    let cell_c30 = isNaN(cell_e26) || isNaN(cell_e27) || isNaN(cell_e19) || isNaN(cell_e20) ? "No Reading" : cell_e26 + cell_e27 - (cell_e19 + cell_e20);
    var transformerLossInKWH = worksheet.getRow(30);
    transformerLossInKWH.getCell(3).value = isNaN(cell_c30) || cell_c30 === 0 ? cell_c30 : +cell_c30.toFixed(2);
    // transformerLossInKWH.getCell(3).value = { formula: '(E26+E27)-(E19+E20)' }

    let cell_c31 = isNaN(cell_c30) || isNaN(cell_e26) || isNaN(cell_e27) ? "No Reading" : (cell_c30 / (cell_e26 + cell_e27)) * 100;
    var transformerLossInPer = worksheet.getRow(31);
    transformerLossInPer.getCell(3).value = isNaN(cell_c31) || cell_c31 === 0 ? cell_c31 : +cell_c31.toFixed(2);
    // transformerLossInPer.getCell(3).value = { formula: '(C30/(E26+E27))*100 ' }

    let cell_c35 = energyMeterTower1.tw1RMU?.initialReading || 0;
    let cell_d35 = energyMeterTower1.tw1RMU?.finalReading || 0;
    let cell_f35 = energyMeterTower1.tw1RMU?.finalReading || 0;
    let cell_e35;
    var TW1RMU = worksheet.getRow(35);
    TW1RMU.getCell(3).value = isNaN(cell_c35) || cell_c35 === 0 ? cell_c35 : +cell_c35.toFixed(2);
    TW1RMU.getCell(4).value = isNaN(cell_d35) || cell_d35 === 0 ? cell_d35 : +cell_d35.toFixed(2);
    TW1RMU.getCell(6).value = isNaN(cell_f35) || cell_f35 === 0 ? cell_f35 : +cell_f35.toFixed(2);
    cell_e35 = isNaN(cell_d35) || isNaN(cell_c35) ? "No Reading" : cell_d35 - cell_c35;
    TW1RMU.getCell(5).value = isNaN(cell_e35) || cell_e35 === 0 ? cell_e35 : +cell_e35.toFixed(2);;
    // TW1RMU.getCell(5).value = { formula: '(D35-C35)'};
    // TW1RMU.getCell(7).value = cell_g35 =  energyMeterTower1.tw1RMU?.meterFactor || 0;

    let cell_c36 = energyMeterTower1.trans1Data?.initialReading || 0;
    let cell_d36 = energyMeterTower1.trans1Data?.finalReading || 0;
    let cell_f36 = energyMeterTower1.trans1Data?.finalReading || 0;
    let cell_e36;
    let cell_g36 = energyMeterTower1.trans1Data?.meterFactor || 0;
    var energyMeterTrans1 = worksheet.getRow(36);
    energyMeterTrans1.getCell(3).value = isNaN(cell_c36) || cell_c36 === 0 ? cell_c36 : +cell_c36.toFixed(2);
    energyMeterTrans1.getCell(4).value = isNaN(cell_d36) || cell_d36 === 0 ? cell_d36 : +cell_d36.toFixed(2);
    cell_e36 = isNaN(cell_c36) || isNaN(cell_d36) ? "No Reading" : cell_d36 - cell_c36;
    energyMeterTrans1.getCell(5).value = isNaN(cell_e36) || cell_e36 === 0 ? cell_e36 : +cell_e36.toFixed(2);
    // energyMeterTrans1.getCell(5).value = { formula: '(D36-C36)'};
    energyMeterTrans1.getCell(6).value = isNaN(cell_f36) || cell_f36 === 0 ? cell_f36 : +cell_f36.toFixed(2);
    energyMeterTrans1.getCell(7).value = isNaN(cell_g36) || cell_g36 === 0 ? cell_g36 : +cell_g36.toFixed(2);

    let cell_c37 = energyMeterTower1.trans2Data?.initialReading || 0;
    let cell_d37 = energyMeterTower1.trans2Data?.finalReading || 0;
    let cell_f37 = energyMeterTower1.trans2Data?.finalReading || 0;
    let cell_e37;
    let cell_g37 = energyMeterTower1.trans2Data?.meterFactor || 0;
    var energyMeterTrans2 = worksheet.getRow(37);
    energyMeterTrans2.getCell(3).value = isNaN(cell_c37) || cell_c37 === 0 ? cell_c37 : +cell_c37.toFixed(2);
    energyMeterTrans2.getCell(4).value = isNaN(cell_d37) || cell_d37 === 0 ? cell_d37 : +cell_d37.toFixed(2);
    cell_e37 = isNaN(cell_c37) || isNaN(cell_d37) ? "No Reading" : cell_d37 - cell_c37;
    energyMeterTrans2.getCell(5).value = isNaN(cell_e37) || cell_e37 === 0 ? cell_e37 : +cell_e37.toFixed(2);
    // energyMeterTrans2.getCell(5).value = { formula: '(D37-C37)'};
    energyMeterTrans2.getCell(6).value = isNaN(cell_f37) || cell_f37 === 0 ? cell_f37 : +cell_f37.toFixed(2);
    energyMeterTrans2.getCell(7).value = isNaN(cell_g37) || cell_g37 === 0 ? cell_g37 : +cell_g37.toFixed(2);

    let cell_c40 = isNaN(cell_e35) || isNaN(cell_e36) || isNaN(cell_e37) ? "No Reading" : cell_e35 - (cell_e36 + cell_e37);
    var transformerLossDistribution = worksheet.getRow(40);
    transformerLossDistribution.getCell(3).value = isNaN(cell_c40) || cell_c40 === 0 ? cell_c40 : +cell_c40.toFixed(2);
    // transformerLossDistribution.getCell(3).value = { formula: 'E35-(E36+E37)' }

    let cell_c41 =
      isNaN(cell_c40) || isNaN(cell_e35) ? "No Reading" : (cell_c40 / cell_e35) * 100;
    var DistributionLossInPer = worksheet.getRow(41);
    DistributionLossInPer.getCell(3).value = isNaN(cell_c41) || cell_c41 === 0 ? cell_c41 : +cell_c41.toFixed(2);
    // DistributionLossInPer.getCell(3).value = { formula: '(C40/E35)*100' }

    let cell_c44 = feederConsumption.base1Vent?.initialReading || 0;
    let cell_d44 = feederConsumption.base1Vent?.finalReading || 0;
    let cell_f44 = feederConsumption.base1Vent?.finalReading || 0;
    let cell_e44;
    let cell_g44 = feederConsumption.base1Vent?.meterFactor || 0;
    var feederBase1 = worksheet.getRow(44);
    feederBase1.getCell(3).value = isNaN(cell_c44) || cell_c44 === 0 ? cell_c44 : +cell_c44.toFixed(2);
    feederBase1.getCell(4).value = isNaN(cell_d44) || cell_d44 === 0 ? cell_d44 : +cell_d44.toFixed(2);
    cell_e44 = isNaN(cell_d44) || isNaN(cell_c44) ? "No Reading" : cell_d44 - cell_c44;
    feederBase1.getCell(5).value = isNaN(cell_e44) || cell_e44 === 0 ? cell_e44 : +cell_e44.toFixed(2);
    // feederBase1.getCell(5).value = { formula: '(D44-C44)'};
    feederBase1.getCell(6).value = isNaN(cell_f44) || cell_f44 === 0 ? cell_f44 : +cell_f44.toFixed(2);
    feederBase1.getCell(7).value = isNaN(cell_g44) || cell_g44 === 0 ? cell_g44 : +cell_g44.toFixed(2);

    let cell_c45 = feederConsumption.base3?.initialReading || 0;
    let cell_d45 = feederConsumption.base3?.finalReading || 0;
    let cell_f45 = feederConsumption.base3?.finalReading || 0;
    let cell_e45;
    let cell_g45 = feederConsumption.base3?.meterFactor || 0;
    var feederBase3 = worksheet.getRow(45);
    feederBase3.getCell(3).value = isNaN(cell_c45) || cell_c45 === 0 ? cell_c45 : +cell_c45.toFixed(2);
    feederBase3.getCell(4).value = isNaN(cell_d45) || cell_d45 === 0 ? cell_d45 : +cell_d45.toFixed(2);
    cell_e45 = isNaN(cell_d45) || isNaN(cell_c45) ? "No Reading" : cell_d45 - cell_c45;

    feederBase3.getCell(5).value = isNaN(cell_e45) || cell_e45 === 0 ? cell_e45 : +cell_e45.toFixed(2);
    // feederBase3.getCell(5).value = { formula: '(D45-C45)'};
    feederBase3.getCell(6).value = isNaN(cell_f45) || cell_f45 === 0 ? cell_f45 : +cell_f45.toFixed(2);
    feederBase3.getCell(7).value = isNaN(cell_g45) || cell_g45 === 0 ? cell_g45 : +cell_g45.toFixed(2);

    let cell_c46 = feederConsumption.base2?.initialReading || 0;
    let cell_d46 = feederConsumption.base2?.finalReading || 0;
    let cell_f46 = feederConsumption.base2?.finalReading || 0;
    let cell_e46;
    let cell_g46 = feederConsumption.base2?.meterFactor || 0;
    var feederBase2 = worksheet.getRow(46);
    feederBase2.getCell(3).value = isNaN(cell_c46) || cell_c46 === 0 ? cell_c46 : +cell_c46.toFixed(2);
    feederBase2.getCell(4).value = isNaN(cell_d46) || cell_d46 === 0 ? cell_d46 : +cell_d46.toFixed(2);

    cell_e46 = isNaN(cell_d46) || isNaN(cell_c46) ? "No Reading" : cell_d46 - cell_c46;
    feederBase2.getCell(5).value = isNaN(cell_e46) || cell_e46 === 0 ? cell_e46 : +cell_e46.toFixed(2);
    // feederBase2.getCell(5).value = { formula: '(D46-C46)'};
    feederBase2.getCell(6).value = isNaN(cell_f46) || cell_f46 === 0 ? cell_f46 : +cell_f46.toFixed(2);
    feederBase2.getCell(7).value = isNaN(cell_g46) || cell_g46 === 0 ? cell_g46 : +cell_g46.toFixed(2);


    let cell_c47 = feederConsumption.commonServices?.initialReading || 0;
    let cell_d47 = feederConsumption.commonServices?.finalReading || 0;
    let cell_f47 = feederConsumption.commonServices?.finalReading || 0;
    let cell_e47;
    let cell_g47 = feederConsumption.commonServices?.meterFactor || 0;
    var feederCommonService = worksheet.getRow(47);
    feederCommonService.getCell(3).value = isNaN(cell_c47) || cell_c47 === 0 ? cell_c47 : +cell_c47.toFixed(2);
    feederCommonService.getCell(4).value = isNaN(cell_d47) || cell_d47 === 0 ? cell_d47 : +cell_d47.toFixed(2);

    cell_e47 = isNaN(cell_d47) || isNaN(cell_c47) ? "No Reading" : cell_d47 - cell_c47;
    feederCommonService.getCell(5).value = isNaN(cell_e47) || cell_e47 === 0 ? cell_e47 : +cell_e47.toFixed(2);
    // feederCommonService.getCell(5).value = { formula: '(D47-C47)'};
    feederCommonService.getCell(6).value = isNaN(cell_f47) || cell_f47 === 0 ? cell_f47 : +cell_f47.toFixed(2);
    feederCommonService.getCell(7).value = isNaN(cell_g47) || cell_g47 === 0 ? cell_g47 : +cell_g47.toFixed(2);

    let cell_c50 = DgRoomConsumption.roomVent?.initialReading || 0;
    let cell_d50 = DgRoomConsumption.roomVent?.finalReading || 0;
    let cell_f50 = DgRoomConsumption.roomVent?.finalReading || 0;
    let cell_e50;
    let cell_g50 = DgRoomConsumption.roomVent?.meterFactor || 0;
    var dgVent = worksheet.getRow(50);
    dgVent.getCell(3).value = isNaN(cell_c50) || cell_c50 === 0 ? cell_c50 : +cell_c50.toFixed(2);
    dgVent.getCell(4).value = isNaN(cell_d50) || cell_d50 === 0 ? cell_d50 : +cell_d50.toFixed(2);

    cell_e50 = isNaN(cell_d50) || isNaN(cell_c50) ? "No Reading" : cell_d50 - cell_c50;
    dgVent.getCell(5).value = isNaN(cell_e50) || cell_e50 === 0 ? cell_e50 : +cell_e50.toFixed(2);
    // dgVent.getCell(5).value  = { formula: '(D50-C50)'};
    dgVent.getCell(6).value = isNaN(cell_f50) || cell_f50 === 0 ? cell_f50 : +cell_f50.toFixed(2);
    dgVent.getCell(7).value = isNaN(cell_g50) || cell_g50 === 0 ? cell_g50 : +cell_g50.toFixed(2);

    let cell_c51 = DgRoomConsumption.airWasher?.initialReading || 0;
    let cell_d51 = DgRoomConsumption.airWasher?.finalReading || 0;
    let cell_f51 = DgRoomConsumption.airWasher?.finalReading || 0;
    let cell_e51;
    let cell_g51 = DgRoomConsumption.airWasher?.meterFactor || 0;
    var dgAirWasher = worksheet.getRow(51);
    dgAirWasher.getCell(3).value = isNaN(cell_c51) || cell_c51 === 0 ? cell_c51 : +cell_c51.toFixed(2);
    dgAirWasher.getCell(4).value = isNaN(cell_d51) || cell_d51 === 0 ? cell_d51 : +cell_d51.toFixed(2);

    cell_e51 = isNaN(cell_d51) || isNaN(cell_c51) ? "No Reading" : cell_d51 - cell_c51;
    dgAirWasher.getCell(5).value = isNaN(cell_e51) || cell_e51 === 0 ? cell_e51 : +cell_e51.toFixed(2);
    // dgAirWasher.getCell(5).value = { formula: '(D51-C51)'};
    dgAirWasher.getCell(6).value = isNaN(cell_f51) || cell_f51 === 0 ? cell_f51 : +cell_f51.toFixed(2);
    dgAirWasher.getCell(7).value = isNaN(cell_g51) || cell_g51 === 0 ? cell_g51 : +cell_g51.toFixed(2);

    let cell_c52 = DgRoomConsumption.auxilary?.initialReading || 0;
    let cell_d52 = DgRoomConsumption.auxilary?.finalReading || 0;
    let cell_f52 = DgRoomConsumption.auxilary?.finalReading || 0;
    let cell_e52;
    let cell_g52 = DgRoomConsumption.auxilary?.meterFactor || 0;
    var dgAuxilary = worksheet.getRow(52);
    dgAuxilary.getCell(3).value = isNaN(cell_c52) || cell_c52 === 0 ? cell_c52 : +cell_c52.toFixed(2);
    dgAuxilary.getCell(4).value = isNaN(cell_d52) || cell_d52 === 0 ? cell_d52 : +cell_d52.toFixed(2);

    cell_e52 = isNaN(cell_d52) || isNaN(cell_c52) ? "No Reading" : cell_d52 - cell_c52;
    dgAuxilary.getCell(5).value = isNaN(cell_e52) || cell_e52 === 0 ? cell_e52 : +cell_e52.toFixed(2);
    // dgAuxilary.getCell(5).value = { formula: '(D52-C52)'};
    dgAuxilary.getCell(6).value = isNaN(cell_f52) || cell_f52 === 0 ? cell_f52 : +cell_f52.toFixed(2);
    dgAuxilary.getCell(7).value = isNaN(cell_g52) || cell_g52 === 0 ? cell_g52 : +cell_g52.toFixed(2);

    let cell_c55 = spareFeeder.tower9?.initialReading || 0;
    let cell_d55 = spareFeeder.tower9?.finalReading || 0;
    let cell_f55 = spareFeeder.tower9?.finalReading || 0;
    let cell_e55;
    let cell_g55 = spareFeeder.tower9?.meterFactor || 0;
    var feederTower9 = worksheet.getRow(55);
    feederTower9.getCell(3).value = isNaN(cell_c55) || cell_c55 === 0 ? cell_c55 : +cell_c55.toFixed(2);
    feederTower9.getCell(4).value = isNaN(cell_d55) || cell_d55 === 0 ? cell_d55 : +cell_d55.toFixed(2);

    cell_e55 = isNaN(cell_d55) || isNaN(cell_c55) ? "No Reading" : cell_d55 - cell_c55;
    feederTower9.getCell(5).value = isNaN(cell_e55) || cell_e55 === 0 ? cell_e55 : +cell_e55.toFixed(2);
    // feederTower9.getCell(5).value = { formula: '(D55-C55)'};
    feederTower9.getCell(6).value = isNaN(cell_f55) || cell_f55 === 0 ? cell_f55 : +cell_f55.toFixed(2);
    feederTower9.getCell(7).value = isNaN(cell_g55) || cell_g55 === 0 ? cell_g55 : +cell_g55.toFixed(2);

    let cell_c56 = spareFeeder.spare1?.initialReading || 0;
    let cell_d56 = spareFeeder.spare1?.finalReading || 0;
    let cell_f56 = spareFeeder.spare1?.finalReading || 0;
    let cell_e56;
    let cell_g56 = spareFeeder.spare1?.meterFactor || 0;
    var feederSpare1 = worksheet.getRow(56);
    feederSpare1.getCell(3).value = isNaN(cell_c56) || cell_c56 === 0 ? cell_c56 : +cell_c56.toFixed(2);
    feederSpare1.getCell(4).value = isNaN(cell_d56) || cell_d56 === 0 ? cell_d56 : +cell_d56.toFixed(2);

    cell_e56 = isNaN(cell_d56) || isNaN(cell_c56) ? "No Reading" : cell_d56 - cell_c56;
    feederSpare1.getCell(5).value = isNaN(cell_e56) || cell_e56 === 0 ? cell_e56 : +cell_e56.toFixed(2);
    // feederSpare1.getCell(5).value = { formula: '(D56-C56)'};
    feederSpare1.getCell(6).value = isNaN(cell_f56) || cell_f56 === 0 ? cell_f56 : +cell_f56.toFixed(2);
    feederSpare1.getCell(7).value = isNaN(cell_g56) || cell_g56 === 0 ? cell_g56 : +cell_g56.toFixed(2);

    let cell_c57 = spareFeeder.spare2?.initialReading || 0;
    let cell_d57 = spareFeeder.spare2?.finalReading || 0;
    let cell_f57 = spareFeeder.spare2?.finalReading || 0;
    let cell_e57;
    let cell_g57 = spareFeeder.spare2?.meterFactor || 0;
    var feederSpare2 = worksheet.getRow(57);
    feederSpare2.getCell(3).value = isNaN(cell_c57) || cell_c57 === 0 ? cell_c57 : +cell_c57.toFixed(2);
    feederSpare2.getCell(4).value = isNaN(cell_d57) || cell_d57 === 0 ? cell_d57 : +cell_d57.toFixed(2);

    cell_e57 = isNaN(cell_d57) || isNaN(cell_c57) ? "No Reading" : cell_d57 - cell_c57;
    feederSpare2.getCell(5).value = isNaN(cell_e57) || cell_e57 === 0 ? cell_e57 : +cell_e57.toFixed(2);
    // feederSpare2.getCell(5).value = { formula: '(D57-C57)'};
    feederSpare2.getCell(6).value = isNaN(cell_f57) || cell_f57 === 0 ? cell_f57 : +cell_f57.toFixed(2);
    feederSpare2.getCell(7).value = isNaN(cell_g57) || cell_g57 === 0 ? cell_g57 : +cell_g57.toFixed(2);

    let cell_c60 = AHURoom.AHURoom1?.initialReading || 0;
    let cell_d60 = AHURoom.AHURoom1?.finalReading || 0;
    let cell_f60 = AHURoom.AHURoom1?.finalReading || 0;
    let cell_e60;
    let cell_g60 = AHURoom.AHURoom1?.meterFactor || 0;
    var Ahu1 = worksheet.getRow(60);
    Ahu1.getCell(3).value = isNaN(cell_c60) || cell_c60 === 0 ? cell_c60 : +cell_c60.toFixed(2);
    Ahu1.getCell(4).value = isNaN(cell_d60) || cell_d60 === 0 ? cell_d60 : +cell_d60.toFixed(2);

    cell_e60 = isNaN(cell_d60) || isNaN(cell_c60) ? "No Reading" : cell_d60 - cell_c60;
    Ahu1.getCell(5).value = isNaN(cell_e60) || cell_e60 === 0 ? cell_e60 : +cell_e60.toFixed(2);
    // Ahu1.getCell(5).value = { formula: '(D60-C60)'};
    Ahu1.getCell(6).value = isNaN(cell_f60) || cell_f60 === 0 ? cell_f60 : +cell_f60.toFixed(2);
    Ahu1.getCell(7).value = isNaN(cell_g60) || cell_g60 === 0 ? cell_g60 : +cell_g60.toFixed(2);

    let cell_c61 = AHURoom.AHURoom2?.initialReading || 0;
    let cell_d61 = AHURoom.AHURoom2?.finalReading || 0;
    let cell_f61 = AHURoom.AHURoom2?.finalReading || 0;
    let cell_e61;
    let cell_g61 = AHURoom.AHURoom2?.meterFactor || 0;
    var Ahu2 = worksheet.getRow(61);
    Ahu2.getCell(3).value = isNaN(cell_c61) || cell_c61 === 0 ? cell_c61 : +cell_c61.toFixed(2);
    Ahu2.getCell(4).value = isNaN(cell_d61) || cell_d61 === 0 ? cell_d61 : +cell_d61.toFixed(2);

    cell_e61 = isNaN(cell_d61) || isNaN(cell_c61) ? "No Reading" : cell_d61 - cell_c61;
    Ahu2.getCell(5).value = isNaN(cell_e61) || cell_e61 === 0 ? cell_e61 : +cell_e61.toFixed(2);
    // Ahu2.getCell(5).value = { formula: '(D61-C61)'};
    Ahu2.getCell(6).value = isNaN(cell_f61) || cell_f61 === 0 ? cell_f61 : +cell_f61.toFixed(2);
    Ahu2.getCell(7).value = isNaN(cell_g61) || cell_g61 === 0 ? cell_g61 : +cell_g61.toFixed(2);

    let cell_c64 = liftPanel?.lift1?.initialReading || 0;
    let cell_d64 = liftPanel?.lift1?.finalReading || 0;
    let cell_f64 = liftPanel?.lift1?.finalReading || 0;
    let cell_e64;
    let cell_g64 = liftPanel?.lift1?.meterFactor || 0;
    var liftPanel1 = worksheet.getRow(64);
    liftPanel1.getCell(3).value = isNaN(cell_c64) || cell_c64 === 0 ? cell_c64 : +cell_c64.toFixed(2);
    liftPanel1.getCell(4).value = isNaN(cell_d64) || cell_d64 === 0 ? cell_d64 : +cell_d64.toFixed(2);

    cell_e64 = isNaN(cell_d64) || isNaN(cell_c64) ? "No Reading" : cell_d64 - cell_c64;
    liftPanel1.getCell(5).value = isNaN(cell_e64) || cell_e64 === 0 ? cell_e64 : +cell_e64.toFixed(2);
    // liftPanel1.getCell(5).value = { formula: '(D64-C64)'};
    liftPanel1.getCell(6).value = isNaN(cell_f64) || cell_f64 === 0 ? cell_f64 : +cell_f64.toFixed(2);
    liftPanel1.getCell(7).value = isNaN(cell_g64) || cell_g64 === 0 ? cell_g64 : +cell_g64.toFixed(2);

    let cell_c65 = liftPanel?.lift2?.initialReading || 0;
    let cell_d65 = liftPanel?.lift2?.finalReading || 0;
    let cell_f65 = liftPanel?.lift2?.finalReading || 0;
    let cell_e65;
    let cell_g65 = liftPanel?.lift2?.meterFactor || 0;
    var liftPanel2 = worksheet.getRow(65);
    liftPanel2.getCell(3).value = isNaN(cell_c65) || cell_c65 === 0 ? cell_c65 : +cell_c65.toFixed(2);
    liftPanel2.getCell(4).value = isNaN(cell_d65) || cell_d65 === 0 ? cell_d65 : +cell_d65.toFixed(2);

    cell_e65 = isNaN(cell_d65) || isNaN(cell_c65) ? "No Reading" : cell_d65 - cell_c65;
    liftPanel2.getCell(5).value = isNaN(cell_e65) || cell_e65 === 0 ? cell_e65 : +cell_e65.toFixed(2);
    // liftPanel2.getCell(5).value = { formula: '(D65-C65)'};
    liftPanel2.getCell(6).value = isNaN(cell_f65) || cell_f65 === 0 ? cell_f65 : +cell_f65.toFixed(2);
    liftPanel2.getCell(7).value = isNaN(cell_g65) || cell_g65 === 0 ? cell_g65 : +cell_g65.toFixed(2);

    let cell_c66 = liftPanel?.lift3?.initialReading || 0;
    let cell_d66 = liftPanel?.lift3?.finalReading || 0;
    let cell_f66 = liftPanel?.lift3?.finalReading || 0;
    let cell_e66;
    let cell_g66 = liftPanel?.lift3?.meterFactor || 0;
    var liftPanel3 = worksheet.getRow(66);
    liftPanel3.getCell(3).value = isNaN(cell_c66) || cell_c66 === 0 ? cell_c66 : +cell_c66.toFixed(2);
    liftPanel3.getCell(4).value = isNaN(cell_d66) || cell_d66 === 0 ? cell_d66 : +cell_d66.toFixed(2);

    cell_e66 = isNaN(cell_d66) || isNaN(cell_c66) ? "No Reading" : cell_d66 - cell_c66;
    liftPanel3.getCell(5).value = isNaN(cell_e66) || cell_e66 === 0 ? cell_e66 : +cell_e66.toFixed(2);
    // liftPanel3.getCell(5).value = { formula: '(D66-C66)'};
    liftPanel3.getCell(6).value = isNaN(cell_f66) || cell_f66 === 0 ? cell_f66 : +cell_f66.toFixed(2);
    liftPanel3.getCell(7).value = isNaN(cell_g66) || cell_g66 === 0 ? cell_g66 : +cell_g66.toFixed(2);

    let cell_c69 = risingMain?.main1?.initialReading || 0;
    let cell_d69 = risingMain?.main1?.finalReading || 0;
    let cell_f69 = risingMain?.main1?.finalReading || 0;
    let cell_e69;
    let cell_g69 = risingMain?.main1?.meterFactor || 0;
    var risingMain1 = worksheet.getRow(69);
    risingMain1.getCell(3).value = isNaN(cell_c69) || cell_c69 === 0 ? cell_c69 : +cell_c69.toFixed(2);
    risingMain1.getCell(4).value = isNaN(cell_d69) || cell_d69 === 0 ? cell_d69 : +cell_d69.toFixed(2);

    cell_e69 = isNaN(cell_d69) || isNaN(cell_c69) ? "No Reading" : cell_d69 - cell_c69;
    risingMain1.getCell(5).value = isNaN(cell_e69) || cell_e69 === 0 ? cell_e69 : +cell_e69.toFixed(2);
    // risingMain1.getCell(5).value = { formula: '(D69-C69)'};
    risingMain1.getCell(6).value = isNaN(cell_f69) || cell_f69 === 0 ? cell_f69 : +cell_f69.toFixed(2);
    risingMain1.getCell(7).value = isNaN(cell_g69) || cell_g69 === 0 ? cell_g69 : +cell_g69.toFixed(2);
    //---check up
    let cell_c70 = risingMain?.main2?.initialReading || 0;
    let cell_d70 = risingMain?.main2?.finalReading || 0;
    let cell_f70 = risingMain?.main2?.finalReading || 0;
    let cell_e70;
    let cell_g70 = risingMain?.main2?.meterFactor || 0;
    var risingMain2 = worksheet.getRow(70);
    risingMain2.getCell(3).value = isNaN(cell_c70) || cell_c70 === 0 ? cell_c70 : +cell_c70.toFixed(2);
    risingMain2.getCell(4).value = isNaN(cell_d70) || cell_d70 === 0 ? cell_d70 : +cell_d70.toFixed(2);

    cell_e70 = isNaN(cell_d70) || isNaN(cell_c70) ? "No Reading" : cell_d70 - cell_c70;
    risingMain2.getCell(5).value = isNaN(cell_e70) || cell_e70 === 0 ? cell_e70 : +cell_e70.toFixed(2);
    // risingMain2.getCell(5).value = { formula: '(D70-C70)'};
    risingMain2.getCell(6).value = isNaN(cell_f70) || cell_f70 === 0 ? cell_f70 : +cell_f70.toFixed(2);
    risingMain2.getCell(7).value = isNaN(cell_g70) || cell_g70 === 0 ? cell_g70 : +cell_g70.toFixed(2);

    let cell_c71 = risingMain?.main3?.initialReading || 0;
    let cell_d71 = risingMain?.main3?.finalReading || 0;
    let cell_f71 = risingMain?.main3?.finalReading || 0;
    let cell_e71;
    let cell_g71 = risingMain?.main3?.meterFactor || 0;
    var risingMain3 = worksheet.getRow(71);
    risingMain3.getCell(3).value = isNaN(cell_c71) || cell_c71 === 0 ? cell_c71 : +cell_c71.toFixed(2);
    risingMain3.getCell(4).value = isNaN(cell_d71) || cell_d71 === 0 ? cell_d71 : +cell_d71.toFixed(2);

    cell_e71 = isNaN(cell_d71) || isNaN(cell_c71) ? "No Reading" : cell_d71 - cell_c71;
    risingMain3.getCell(5).value = isNaN(cell_e71) || cell_e71 === 0 ? cell_e71 : +cell_e71.toFixed(2);
    // risingMain3.getCell(5).value = { formula: '(D71-C71)'};
    risingMain3.getCell(6).value = isNaN(cell_f71) || cell_f71 === 0 ? cell_f71 : +cell_f71.toFixed(2);
    risingMain3.getCell(7).value = isNaN(cell_g71) || cell_g71 === 0 ? cell_g71 : +cell_g71.toFixed(2);

    let cell_c75 = yardConsumption?.t6Tank1.initialReading || 0;
    let cell_d75 = yardConsumption?.t6Tank1.finalReading || 0;
    let cell_f75;
    let cell_e75;
    var t6Tank1 = worksheet.getRow(75);
    t6Tank1.getCell(3).value = isNaN(cell_c75) || cell_c75 === 0 ? cell_c75 : +cell_c75.toFixed(2);
    t6Tank1.getCell(4).value = isNaN(cell_d75) || cell_d75 === 0 ? cell_d75 : +cell_d75.toFixed(2);
    t6Tank1.getCell(5).value = cell_e75 = 0;

    cell_f75 = isNaN(cell_c75) || isNaN(cell_e75) || isNaN(cell_d75) ? "No Reading" : cell_c75 + cell_e75 - cell_d75;
    t6Tank1.getCell(6).value = isNaN(cell_f75) || cell_f75 === 0 ? cell_f75 : +cell_f75.toFixed(2);
    // t6Tank1.getCell(6).value = { formula: '(C75+E75)-D75' };

    let cell_c76 = yardConsumption?.t6Tank2.initialReading || 0;
    let cell_d76 = yardConsumption?.t6Tank2.finalReading || 0;
    let cell_f76;
    let cell_e76;
    let cell_g76;
    var t6Tank2 = worksheet.getRow(76);
    t6Tank2.getCell(3).value = isNaN(cell_c76) || cell_c76 === 0 ? cell_c76 : +cell_c76.toFixed(2);
    t6Tank2.getCell(4).value = isNaN(cell_d76) || cell_d76 === 0 ? cell_d76 : +cell_d76.toFixed(2);
    t6Tank2.getCell(5).value = cell_e76 = 0;

    cell_f76 = isNaN(cell_c76) || isNaN(cell_e76) || isNaN(cell_d76) ? "No Reading" : cell_c76 + cell_e76 - cell_d76;
    t6Tank2.getCell(6).value = isNaN(cell_f76) || cell_f76 === 0 ? cell_f76 : +cell_f76.toFixed(2);
    // t6Tank2.getCell(6).value = { formula: '(C76+E76)-D76' };

    let cell_c77 = yardConsumption?.t6Tank3.initialReading || 0;
    let cell_d77 = yardConsumption?.t6Tank3.finalReading || 0;
    let cell_f77;
    let cell_e77;
    let cell_g77;
    var t6Tank3 = worksheet.getRow(77);
    t6Tank3.getCell(3).value = isNaN(cell_c77) || cell_c77 === 0 ? cell_c77 : +cell_c77.toFixed(2);
    t6Tank3.getCell(4).value = isNaN(cell_d77) || cell_d77 === 0 ? cell_d77 : +cell_d77.toFixed(2);
    t6Tank3.getCell(5).value = cell_e77 = 0;

    cell_f77 = isNaN(cell_c77) || isNaN(cell_e77) || isNaN(cell_d77) ? "No Reading" : cell_c77 + cell_e77 - cell_d77;
    t6Tank3.getCell(6).value = isNaN(cell_f77) || cell_f77 === 0 ? cell_f77 : +cell_f77.toFixed(2);
    // t6Tank3.getCell(6).value = { formula: '(C77+E77)-D77' };

    let cell_c78 = yardConsumption?.t6Tank4.initialReading || 0;
    let cell_d78 = yardConsumption?.t6Tank4.finalReading || 0;
    let cell_f78;
    let cell_e78;
    let cell_g78;
    var t6Tank4 = worksheet.getRow(78);
    t6Tank4.getCell(3).value = isNaN(cell_c78) || cell_c78 === 0 ? cell_c78 : +cell_c78.toFixed(2);
    t6Tank4.getCell(4).value = isNaN(cell_d78) || cell_d78 === 0 ? cell_d78 : +cell_d78.toFixed(2);
    t6Tank4.getCell(5).value = cell_e78 = 0;

    cell_f78 = isNaN(cell_c78) || isNaN(cell_e78) || isNaN(cell_d78) ? "No Reading" : cell_c78 + cell_e78 - cell_d78;
    t6Tank4.getCell(6).value = isNaN(cell_f78) || cell_f78 === 0 ? cell_f78 : +cell_f78.toFixed(2);
    // // t6Tank4.getCell(6).value = { formula: '(C78+E78)-D78' };

    let cell_c79 = yardConsumption?.t9Tank1.initialReading || 0;
    let cell_d79 = yardConsumption?.t9Tank1.finalReading || 0;
    let cell_f79;
    let cell_e79;
    let cell_g79;
    var t9Tank1 = worksheet.getRow(79);
    t9Tank1.getCell(3).value = isNaN(cell_c79) || cell_c79 === 0 ? cell_c79 : +cell_c79.toFixed(2);
    t9Tank1.getCell(4).value = isNaN(cell_d79) || cell_d79 === 0 ? cell_d79 : +cell_d79.toFixed(2);
    t9Tank1.getCell(5).value = cell_e79 = 0;

    cell_f79 = isNaN(cell_c79) || isNaN(cell_e79) || isNaN(cell_d79) ? "No Reading" : cell_c79 + cell_e79 - cell_d79;
    t9Tank1.getCell(6).value = isNaN(cell_f79) || cell_f79 === 0 ? cell_f79 : +cell_f79.toFixed(2);
    // t9Tank1.getCell(6).value = { formula: '(C79+E79)-D79' };

    let cell_c80 = yardConsumption?.t9Tank2.initialReading || 0;
    let cell_d80 = yardConsumption?.t9Tank2.finalReading || 0;
    let cell_f80;
    let cell_e80;
    let cell_g80;
    var t9Tank2 = worksheet.getRow(80);
    t9Tank2.getCell(3).value = isNaN(cell_c80) || cell_c80 === 0 ? cell_c80 : +cell_c80.toFixed(2);
    t9Tank2.getCell(4).value = isNaN(cell_d80) || cell_d80 === 0 ? cell_d80 : +cell_d80.toFixed(2);
    t9Tank2.getCell(5).value = cell_e80 = 0;

    cell_f80 = isNaN(cell_c80) || isNaN(cell_e80) || isNaN(cell_d80) ? "No Reading" : cell_c80 + cell_e80 - cell_d80;
    t9Tank2.getCell(6).value = isNaN(cell_f80) || cell_f80 === 0 ? cell_f80 : +cell_f80.toFixed(2);
    // t9Tank2.getCell(6).value = { formula: '(C80+E80)-D80' };

    let cell_c83 = isNaN(cell_d75) ||
      isNaN(cell_d76) ||
      isNaN(cell_d77) ||
      isNaN(cell_d78) ||
      isNaN(cell_d79) ||
      isNaN(cell_d80)
      ? "No Reading"
      : cell_d75 + cell_d76 + cell_d77 + cell_d78 + cell_d79 + cell_d80;
    var totalHDC = worksheet.getRow(83);
    totalHDC.getCell(3).value = isNaN(cell_c83) || cell_c83 === 0 ? cell_c83 : +cell_c83.toFixed(2);
    // totalHDC.getCell(3).value = { formula: 'SUM(D75:D80)' };

    let cell_c87 = DgUnit?.DG1?.initialReading || 0;
    let cell_d87 = DgUnit?.DG1?.finalReading || 0;
    let cell_e87;
    var DGunit1 = worksheet.getRow(87);
    DGunit1.getCell(3).value = isNaN(cell_c87) || cell_c87 === 0 ? cell_c87 : +cell_c87.toFixed(2);
    DGunit1.getCell(4).value = isNaN(cell_d87) || cell_d87 === 0 ? cell_d87 : +cell_d87.toFixed(2);

    cell_e87 = isNaN(cell_d87) || isNaN(cell_c87) ? "No Reading" : cell_d87 - cell_c87
    DGunit1.getCell(5).value = isNaN(cell_e87) || cell_e87 === 0 ? cell_e87 : +cell_e87.toFixed(2);
    // DGunit1.getCell(5).value = { formula: '(D87-C87)' };

    let cell_c88 = DgUnit.DG2?.initialReading || 0;
    let cell_d88 = DgUnit.DG2?.finalReading || 0;
    let cell_e88;
    var DGunit2 = worksheet.getRow(88);
    DGunit2.getCell(3).value = isNaN(cell_c88) || cell_c88 === 0 ? cell_c88 : +cell_c88.toFixed(2);
    DGunit2.getCell(4).value = isNaN(cell_d88) || cell_d88 === 0 ? cell_d88 : +cell_d88.toFixed(2);

    cell_e88 = isNaN(cell_d88) || isNaN(cell_c88) ? "No Reading" : cell_d88 - cell_c88;
    DGunit2.getCell(5).value = isNaN(cell_e88) || cell_e88 === 0 ? cell_e88 : +cell_e88.toFixed(2);
    // // DGunit2.getCell(5).value = { formula: '(D88-C88)' };

    let cell_c89 = DgUnit.DG3?.initialReading || 0;
    let cell_d89 = DgUnit.DG3?.finalReading || 0;
    let cell_e89;
    var DGunit3 = worksheet.getRow(89);
    DGunit3.getCell(3).value = isNaN(cell_c89) || cell_c89 === 0 ? cell_c89 : +cell_c89.toFixed(2);
    DGunit3.getCell(4).value = isNaN(cell_d89) || cell_d89 === 0 ? cell_d89 : +cell_d89.toFixed(2);

    cell_e89 = isNaN(cell_d89) || isNaN(cell_c89) ? "No Reading" : cell_d89 - cell_c89;
    DGunit3.getCell(5).value = isNaN(cell_e89) || cell_e89 === 0 ? cell_e89 : +cell_e89.toFixed(2);
    // DGunit3.getCell(5).value = { formula: '(D89-C89)' };

    let cell_c90 = DgUnit.DG4?.initialReading || 0;
    let cell_d90 = DgUnit.DG4?.finalReading || 0;
    let cell_e90;
    var DGunit4 = worksheet.getRow(90);
    DGunit4.getCell(3).value = isNaN(cell_c90) || cell_c90 === 0 ? cell_c90 : +cell_c90.toFixed(2);
    DGunit4.getCell(4).value = isNaN(cell_d90) || cell_d90 === 0 ? cell_d90 : +cell_d90.toFixed(2);

    cell_e90 = isNaN(cell_d90) || isNaN(cell_c90) ? "No Reading" : cell_d90 - cell_c90;
    DGunit4.getCell(5).value = isNaN(cell_e90) || cell_e90 === 0 ? cell_e90 : +cell_e90.toFixed(2);

    let cell_c93 = isNaN(cell_e87) || isNaN(cell_e88) || isNaN(cell_e89) || isNaN(cell_e90) ? "No Reading" : cell_e87 + cell_e88 + cell_e89 + cell_e90;
    var totalDGEnergy = worksheet.getRow(93);
    totalDGEnergy.getCell(3).value = isNaN(cell_c93) || cell_c93 === 0 ? cell_c93 : +cell_c93.toFixed(2);
    // totalDGEnergy.getCell(3).value = { formula: 'SUM(E87:E90)' };

    let cell_c97 = DgHDC?.DG1?.initialReading || 0;
    let cell_d97 = DgHDC?.DG1?.finalReading || 0;
    let cell_f97;
    let cell_e97;
    var DGHDC1 = worksheet.getRow(97);
    DGHDC1.getCell(3).value = isNaN(cell_c97) || cell_c97 === 0 ? cell_c97 : +cell_c97.toFixed(2);
    DGHDC1.getCell(4).value = isNaN(cell_d97) || cell_d97 === 0 ? cell_d97 : +cell_d97.toFixed(2);

    cell_e97 = isNaN(cell_c97) || isNaN(cell_d97) ? "No Reading" : cell_c97 - cell_d97;
    DGHDC1.getCell(5).value = isNaN(cell_e97) || cell_e97 === 0 ? cell_e97 : +cell_e97.toFixed(2);

    cell_f97 = isNaN(cell_e87) || isNaN(cell_e97)
      ? "No Reading"
      // : isNan(cell_e87 / cell_e97)
      //   ? "No reading"
      : cell_e87 / cell_e97;
    DGHDC1.getCell(6).value = isNaN(cell_f97) || cell_f97 === 0 ? cell_f97 : +cell_f97.toFixed(2);
    // DGHDC1.getCell(5).value = { formula: '(C97-D97)' };
    // DGHDC1.getCell(6).value = { formula: '(E87/E97)' };

    let cell_c98 = DgHDC?.DG2?.initialReading || 0;
    let cell_d98 = DgHDC?.DG2?.finalReading || 0;
    let cell_f98;
    let cell_e98;
    var DGHDC2 = worksheet.getRow(98);
    DGHDC2.getCell(3).value = isNaN(cell_c98) || cell_c98 === 0 ? cell_c98 : +cell_c98.toFixed(2);
    DGHDC2.getCell(4).value = isNaN(cell_d98) || cell_d98 === 0 ? cell_d98 : +cell_d98.toFixed(2);

    cell_e98 = isNaN(cell_c98) || isNaN(cell_d98) ? "No Reading" : cell_c98 - cell_d98;
    DGHDC2.getCell(5).value = isNaN(cell_e98) || cell_e98 === 0 ? cell_e98 : +cell_e98.toFixed(2);

    cell_f98 = isNaN(cell_e88) || isNaN(cell_e98) ? "No Reading" : cell_e88 / cell_e98;
    DGHDC2.getCell(6).value = isNaN(cell_f98) || cell_f98 === 0 ? cell_f98 : +cell_f98.toFixed(2);
    // DGHDC2.getCell(5).value = { formula: '(C98-D98)' };
    // DGHDC2.getCell(6).value = { formula: '(E88/E98)' };

    let cell_c99 = DgHDC?.DG3?.initialReading || 0;
    let cell_d99 = DgHDC?.DG3?.finalReading || 0;
    let cell_f99;
    let cell_e99;
    var DGHDC3 = worksheet.getRow(99);
    DGHDC3.getCell(3).value = isNaN(cell_c99) || cell_c99 === 0 ? cell_c99 : +cell_c99.toFixed(2);
    DGHDC3.getCell(4).value = isNaN(cell_d99) || cell_d99 === 0 ? cell_d99 : +cell_d99.toFixed(2);

    cell_e99 = isNaN(cell_c99) || isNaN(cell_d99) ? "No Reading" : cell_c99 - cell_d99;
    DGHDC3.getCell(5).value = isNaN(cell_e99) || cell_e99 === 0 ? cell_e99 : +cell_e99.toFixed(2);

    cell_f99 = isNaN(cell_e89) || isNaN(cell_e99) ? "No Reading" : cell_e89 / cell_e99;
    DGHDC3.getCell(6).value = isNaN(cell_f99) || cell_f99 === 0 ? cell_f99 : +cell_f99.toFixed(2);
    // DGHDC3.getCell(5).value = { formula: '(C99-D99)' };
    // DGHDC3.getCell(6).value = { formula: '(E89/E99)' };

    let cell_c100 = DgHDC?.DG4?.initialReading || 0;
    let cell_d100 = DgHDC?.DG4?.finalReading || 0;
    let cell_f100;
    let cell_e100;
    var DGHDC4 = worksheet.getRow(100);
    DGHDC4.getCell(3).value = isNaN(cell_c100) || cell_c100 === 0 ? cell_c100 : +cell_c100.toFixed(2);
    DGHDC4.getCell(4).value = isNaN(cell_d100) || cell_d100 === 0 ? cell_d100 : +cell_d100.toFixed(2);

    cell_e100 = isNaN(cell_c100) || isNaN(cell_d100) ? "No Reading" : cell_c100 - cell_d100;
    DGHDC4.getCell(5).value = isNaN(cell_e100) || cell_e100 === 0 ? cell_e100 : +cell_e100.toFixed(2);

    cell_f100 = isNaN(cell_e90) || isNaN(cell_e100) ? "No Reading" : cell_e90 / cell_e100;
    DGHDC4.getCell(6).value = isNaN(cell_f100) || cell_f100 === 0 ? cell_f100 : +cell_f100.toFixed(2);
    // DGHDC4.getCell(5).value = { formula: '(C100-D100)' };
    // DGHDC4.getCell(6).value = { formula: '(E90/E100)' };

    let cell_c104 = DgRunHours?.DG1?.initialReading || 0;
    let cell_d104 = DgRunHours?.DG1?.finalReading || 0;
    var DGRunHours1 = worksheet.getRow(104);
    DGRunHours1.getCell(3).value = isNaN(cell_c104) || cell_c104 === 0 ? cell_c104 : +cell_c104.toFixed(2);
    DGRunHours1.getCell(4).value = isNaN(cell_d104) || cell_d104 === 0 ? cell_d104 : +cell_d104.toFixed(2);

    let cell_c105 = DgRunHours?.DG2?.initialReading || 0;
    let cell_d105 = DgRunHours?.DG2?.finalReading || 0;
    var DGRunHours2 = worksheet.getRow(105);
    DGRunHours2.getCell(3).value = isNaN(cell_c105) || cell_c105 === 0 ? cell_c105 : +cell_c105.toFixed(2);
    DGRunHours2.getCell(4).value = isNaN(cell_d105) || cell_d105 === 0 ? cell_d105 : +cell_d105.toFixed(2);

    let cell_c106 = DgRunHours?.DG3?.initialReading || 0;
    let cell_d106 = DgRunHours?.DG3?.finalReading || 0;
    var DGRunHours3 = worksheet.getRow(106);
    DGRunHours3.getCell(3).value = isNaN(cell_c106) || cell_c106 === 0 ? cell_c106 : +cell_c106.toFixed(2);
    DGRunHours3.getCell(4).value = isNaN(cell_d106) || cell_d106 === 0 ? cell_d106 : +cell_d106.toFixed(2);

    let cell_c107 = DgRunHours.DG4.initialReading || 0;
    let cell_d107 = DgRunHours.DG4.finalReading || 0;
    var DGRunHours4 = worksheet.getRow(107);
    DGRunHours4.getCell(3).value = isNaN(cell_c107) || cell_c107 === 0 ? cell_c107 : +cell_c107.toFixed(2);
    DGRunHours4.getCell(4).value = isNaN(cell_d107) || cell_d107 === 0 ? cell_d107 : +cell_d107.toFixed(2);
    // DGRunHours1.getCell(5).value = { formula: '(D79-C79)' };

    let cell_c111 = chillerConsumption?.chiller1?.initialReading || 0;
    let cell_d111 = chillerConsumption?.chiller1?.finalReading || 0;
    let cell_e111 = chillerConsumption?.chiller1?.consumption || 0;
    let cell_f111 = chillerConsumption?.chiller1?.meterFactor || 0;
    var chillerCons1 = worksheet.getRow(111);
    chillerCons1.getCell(3).value = isNaN(cell_c111) || cell_c111 === 0 ? cell_c111 : +cell_c111.toFixed(2);
    chillerCons1.getCell(4).value = isNaN(cell_d111) || cell_d111 === 0 ? cell_d111 : +cell_d111.toFixed(2);
    chillerCons1.getCell(5).value = isNaN(cell_e111) || cell_e111 === 0 ? cell_e111 : +cell_e111.toFixed(2);
    chillerCons1.getCell(6).value = isNaN(cell_f111) || cell_f111 === 0 ? cell_f111 : +cell_f111.toFixed(2);

    let cell_c112 = chillerConsumption?.chiller2?.initialReading || 0;
    let cell_d112 = chillerConsumption?.chiller2?.finalReading || 0;
    let cell_e112 = chillerConsumption?.chiller2?.consumption || 0;
    let cell_f112 = chillerConsumption?.chiller2?.meterFactor || 0;
    var chillerCons2 = worksheet.getRow(112);
    chillerCons2.getCell(3).value = isNaN(cell_c112) || cell_c112 === 0 ? cell_c112 : +cell_c112.toFixed(2);
    chillerCons2.getCell(4).value = isNaN(cell_d112) || cell_d112 === 0 ? cell_d112 : +cell_d112.toFixed(2);
    chillerCons2.getCell(5).value = isNaN(cell_e112) || cell_e112 === 0 ? cell_e112 : +cell_e112.toFixed(2);
    chillerCons2.getCell(6).value = isNaN(cell_f112) || cell_f112 === 0 ? cell_f112 : +cell_f112.toFixed(2);

    let cell_c116 = chillerApproach?.chiller1?.initialReading || 0;
    let cell_d116 = chillerApproach?.chiller1?.finalReading || 0;
    let cell_e116;
    var chillerApproach1 = worksheet.getRow(116);
    chillerApproach1.getCell(3).value = isNaN(cell_c116) || cell_c116 === 0 ? cell_c116 : +cell_c116.toFixed(2);
    chillerApproach1.getCell(4).value = isNaN(cell_d116) || cell_d116 === 0 ? cell_d116 : +cell_d116.toFixed(2);
    cell_e116 = isNaN(cell_d116) || isNaN(cell_c116) ? "No Reading" : cell_d116 - cell_c116;
    chillerApproach1.getCell(5).value = isNaN(cell_e116) || cell_e116 === 0 ? cell_e116 : +cell_e116.toFixed(2);
    // chillerApproach1.getCell(5).value = { formula: '(D116-C116)' };

    let cell_c117 = chillerApproach?.chiller2?.initialReading || 0;
    let cell_d117 = chillerApproach?.chiller2?.finalReading || 0;
    let cell_e117;
    var chillerApproach2 = worksheet.getRow(117);
    chillerApproach2.getCell(3).value = isNaN(cell_c117) || cell_c117 === 0 ? cell_c117 : +cell_c117.toFixed(2);
    chillerApproach2.getCell(4).value = isNaN(cell_d117) || cell_d117 === 0 ? cell_d117 : +cell_d117.toFixed(2);

    cell_e117 = isNaN(cell_d117) || isNaN(cell_c117) ? "No Reading" : cell_d117 - cell_c117;
    chillerApproach2.getCell(5).value = isNaN(cell_e117) || cell_e117 === 0 ? cell_e117 : +cell_e117.toFixed(2);
    // chillerApproach2.getCell(5).value = { formula: '(D117-C117)' };

    let cell_c118 = chillerApproach?.chiller3?.initialReading || 0;
    let cell_d118 = chillerApproach?.chiller3?.finalReading || 0;
    let cell_e118;
    var chillerApproach3 = worksheet.getRow(118);
    chillerApproach3.getCell(3).value = isNaN(cell_c118) || cell_c118 === 0 ? cell_c118 : +cell_c118.toFixed(2);
    chillerApproach3.getCell(4).value = isNaN(cell_d118) || cell_d118 === 0 ? cell_d118 : +cell_d118.toFixed(2);
    cell_e118 = isNaN(cell_d118) || isNaN(cell_c118) ? "No Reading" : cell_d118 - cell_c118;
    chillerApproach3.getCell(5).value = isNaN(cell_e118) || cell_e118 === 0 ? cell_e118 : +cell_e118.toFixed(2);
    // chillerApproach3.getCell(5).value = { formula: '(D118-C118)' };

    let cell_c122 = waterTankValues.consumptionFlushingWaterTankData.initialReading || 0;
    let cell_d122 = waterTankValues.consumptionFlushingWaterTankData.finalReading || 0;
    let cell_e122;
    var flushingWater = worksheet.getRow(122);
    flushingWater.getCell(3).value = isNaN(cell_c122) || cell_c122 === 0 ? cell_c122 : +cell_c122.toFixed(2);
    flushingWater.getCell(4).value = isNaN(cell_d122) || cell_d122 === 0 ? cell_d122 : +cell_d122.toFixed(2);

    cell_e122 = isNaN(cell_d122) || isNaN(cell_c122) ? "No Reading" : cell_d122 - cell_c122;
    flushingWater.getCell(5).value = isNaN(cell_e122) || cell_e122 === 0 ? cell_e122 : +cell_e122.toFixed(2);

    let cell_c123 = waterTankValues.consumptionSTPWaterTankData.initialReading || 0;
    let cell_d123 = waterTankValues.consumptionSTPWaterTankData.finalReading || 0;
    let cell_e123;
    var softener = worksheet.getRow(123);
    softener.getCell(3).value = isNaN(cell_c123) || cell_c123 === 0 ? cell_c123 : +cell_c123.toFixed(2);
    softener.getCell(4).value = isNaN(cell_d123) || cell_d123 === 0 ? cell_d123 : +cell_d123.toFixed(2);

    cell_e123 = isNaN(cell_d123) || isNaN(cell_c123) ? "No Reading" : cell_d123 - cell_c123;
    softener.getCell(5).value = isNaN(cell_e123) || cell_e123 === 0 ? cell_e123 : +cell_e123.toFixed(2);

    let cell_c124 = waterTankValues.consumptionDomesticWaterTankData.initialReading || 0;
    let cell_d124 = waterTankValues.consumptionDomesticWaterTankData.finalReading || 0;
    let cell_e124;
    var domestic = worksheet.getRow(124);
    domestic.getCell(3).value = isNaN(cell_c124) || cell_c124 === 0 ? cell_c124 : +cell_c124.toFixed(2);
    domestic.getCell(4).value = isNaN(cell_d124) || cell_d124 === 0 ? cell_d124 : +cell_d124.toFixed(2);
    cell_e124 = isNaN(cell_d124) || isNaN(cell_c124) ? "No Reading" : cell_d124 - cell_c124;
    domestic.getCell(5).value = isNaN(cell_e124) || cell_e124 === 0 ? cell_e124 : +cell_e124.toFixed(2);

    let cell_c125 = waterTankValues.consumptionWTPWaterTankData.initialReading || 0;
    let cell_d125 = waterTankValues.consumptionWTPWaterTankData.finalReading || 0;
    let cell_e125;
    var WTP = worksheet.getRow(125);
    WTP.getCell(3).value = isNaN(cell_c125) || cell_c125 === 0 ? cell_c125 : +cell_c125.toFixed(2);
    WTP.getCell(4).value = isNaN(cell_d125) || cell_d125 === 0 ? cell_d125 : +cell_d125.toFixed(2);

    cell_e125 = isNaN(cell_d125) || isNaN(cell_c125) ? "No Reading" : cell_d125 - cell_c125;
    WTP.getCell(5).value = isNaN(cell_e125) || cell_e125 === 0 ? cell_e125 : +cell_e125.toFixed(2);

    let cell_c126 = waterTankValues.consumptionFireWaterTankData.initialReading || 0;
    let cell_d126 = waterTankValues.consumptionFireWaterTankData.finalReading || 0;
    let cell_e126;
    var fire = worksheet.getRow(126);
    fire.getCell(3).value = isNaN(cell_c126) || cell_c126 === 0 ? cell_c126 : +cell_c126.toFixed(2);
    fire.getCell(4).value = isNaN(cell_d126) || cell_d126 === 0 ? cell_d126 : +cell_d126.toFixed(2);

    cell_e126 = isNaN(cell_d126) || isNaN(cell_c126) ? "No Reading" : cell_d126 - cell_c126;
    fire.getCell(5).value = isNaN(cell_e126) || cell_e126 === 0 ? cell_e126 : +cell_e126.toFixed(2);
    // fire.getCell(5).value = { formula: '(D126-C126)' };

    var secondDate = worksheet.getRow(128);
    secondDate.getCell(
      1
    ).value = `${stringTodayDate.toUpperCase()} 00:00 a.m TO ${stringYestDate.toUpperCase()} 00:00 a.m`;

    let summaryLength = Object.keys(oprativeSummary).length;
    let keys = Object.keys(oprativeSummary);
    let values = Object.values(oprativeSummary);
    let serialNo = 1;
    let totalOperative = 0;
    for (let index = 132; index < summaryLength + 132; index++) {
      var row = worksheet.getRow(index);
      row.getCell(1).value = serialNo;
      row.getCell(2).value = keys[serialNo - 1];
      totalOperative = totalOperative + values[serialNo - 1];
      row.getCell(3).value = values[serialNo - 1];
      row.getCell(7).value = values[serialNo - 1];
      // row.getCell(4).value = 0;
      serialNo = serialNo + 1;
    }

    var total = worksheet.getRow(132 + summaryLength + 1);
    total.getCell(3).value = totalOperative;

    let helpDeskLength = helpDesk.length;
    let serialHDNo = 1;

    for (let index = 207; index < helpDeskLength + 207; index++) {
      let CreatedOn = helpDesk[serialHDNo - 1].create_date;
      let newCreated = moment(CreatedOn, "YYYY-MM-DD HH:mm:ss")
        .add(330, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      if (index > 207) {
        let rowValue = [
          serialHDNo,
          `${helpDesk[serialHDNo - 1].ticket_number}-${helpDesk[serialHDNo - 1].subject
          }`,
          helpDesk[serialHDNo - 1]?.equipment_location_id[1] || "-",
          helpDesk[serialHDNo - 1]?.equipment_id[1] || "--",
          helpDesk[serialHDNo - 1].maintenance_team_id[1] || "--",
          helpDesk[serialHDNo - 1].priority_id[1] || "--",
          helpDesk[serialHDNo - 1].state_id[1] || "--",
          helpDesk[serialHDNo - 1].sla_status || "--",
          `${helpDesk[serialHDNo - 1].create_uid[1]} | ${newCreated}`,
          "--",
        ];
        var row = worksheet.insertRow(index, rowValue, "i");
      } else {
        var row = worksheet.getRow(index);
        row.getCell(1).value = serialHDNo;
        row.getCell(2).value = `${helpDesk[serialHDNo - 1].ticket_number}-${helpDesk[serialHDNo - 1].subject
          }`;
        row.getCell(3).value =
          helpDesk[serialHDNo - 1]?.equipment_location_id[1] || "-";
        row.getCell(4).value = helpDesk[serialHDNo - 1]?.equipment_id[1] || "-";
        row.getCell(5).value =
          helpDesk[serialHDNo - 1].maintenance_team_id[1] || "--";
        row.getCell(6).value = helpDesk[serialHDNo - 1].priority_id[1] || "--";
        row.getCell(7).value = helpDesk[serialHDNo - 1].state_id[1] || "--";
        row.getCell(8).value = helpDesk[serialHDNo - 1].sla_status || "--";
        row.getCell(9).value = `${helpDesk[serialHDNo - 1].create_uid[1]
          } | ${newCreated} `;
        row.getCell(10).value = "--";
      }
      serialHDNo = serialHDNo + 1;
    }

    var softService = worksheet.getRow(220 + helpDesk.length - 1);
    softService.getCell(3).value = inspectionSummary.softService.compelete;
    softService.getCell(4).value = inspectionSummary.softService.missed;
    softService.getCell(5).value = inspectionSummary.softService.upcoming;

    var mAndE = worksheet.getRow(221 + helpDesk.length - 1);
    mAndE.getCell(3).value = inspectionSummary.mAndE.compelete;
    mAndE.getCell(4).value = inspectionSummary.mAndE.missed;
    mAndE.getCell(5).value = inspectionSummary.mAndE.upcoming;

    var PmTeam = worksheet.getRow(222 + helpDesk.length - 1);
    PmTeam.getCell(3).value = inspectionSummary.PmTeam?.compelete || 0;
    PmTeam.getCell(4).value = inspectionSummary.PmTeam?.missed || 0;
    PmTeam.getCell(5).value = inspectionSummary.PmTeam?.upcoming || 0;

    let incedentLength = incedentData.length;
    let serialIncedentNo = 1;

    for (
      let index = 226 + (helpDesk.length - 1);
      index < incedentLength + 226 + (helpDesk.length - 1);
      index++
    ) {
      let CreatedOn = incedentData[serialIncedentNo - 1].create_date;
      let newCreated = moment(CreatedOn, "YYYY-MM-DD HH:mm:ss")
        .add(330, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      var row = worksheet.getRow(index);
      row.getCell(1).value = serialIncedentNo;
      row.getCell(2).value = `${incedentData[serialIncedentNo - 1].ticket_number
        }-${incedentData[serialIncedentNo - 1].subject}`;
      row.getCell(3).value =
        incedentData[serialIncedentNo - 1]?.equipment_location_id[1] || "-";
      row.getCell(4).value =
        incedentData[serialIncedentNo - 1]?.category_id[1] || "-";
      row.getCell(5).value = "-";
      row.getCell(6).value = incedentData[serialIncedentNo - 1].priority_id[1];
      row.getCell(7).value = incedentData[serialIncedentNo - 1].state_id[1];
      row.getCell(8).value = incedentData[serialIncedentNo - 1].sla_status;
      row.getCell(9).value = `${incedentData[serialIncedentNo - 1].person_name
        } | ${newCreated} `;
      row.getCell(10).value = "--";
      serialIncedentNo = serialIncedentNo + 1;
    }

    row.commit();
    const fileName = `DMR-${moment().format("lll")}`;
   const sanitizedFileName = fileName.replace(/[^\w\s\-]+/gi, '').replace(/[\s]+/gi, '_').substring(0, 30);
    await workbook.xlsx.writeFile(`./xlsx-files/${sanitizedFileName}.xlsx`);

    return `${sanitizedFileName}.xlsx`;
  });
};

module.exports = {
  createExcell,
};
