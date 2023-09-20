const mongoose = require("mongoose");

const triggerKeys = {
  'htGrid': 'htGrid1',
  'substation': 'substation',
  'transformerIC': 'transformerIC1',
  'transformerOG': 'transformerOG1',
  'tower1EbConsumption': 'tower1EbConsumption1',
  'feederConsumptionLT': 'feederConsumptionLT1',
  'DgRoomConsumption': 'DgRoomConsumption1',
  'spareFeeder': 'spareFeeder1',
  'AHURoom': 'AHURoom1',
  'liftPanel': 'liftPanel1',
  'risingMain': 'risingMain1',
  'yardConsumption': 'yardConsumption1',
  'DGUnit': 'DGUnit1',
  'DGRunHours': 'DGRunHours1',
  'ChillerConsumption': 'ChillerConsumption1',
  'ChillerApproach': 'ChillerApproach1',
  'OperativeSummary': 'OperativeSummary1',
  'helpDesk1': 'helpDesk',
  'inspectionSummary': 'inspectionSummary1',
  'getIncedent1': 'getIncedent',
  'getWaterTankValues': 'getWaterTankValues1',
  'DGHDCConsumption': 'DGHDCConsumption1'
};

const triggerSchemas = {};

for (const key in triggerKeys) {
  const value = triggerKeys[key];

  const schema = new mongoose.Schema(
    {
        subId: {
          type: String,
          required: true,
        },
        filter: {
          type: String,
          required: true,
        },
        toggle: {
          type: Boolean,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        limit: {
          min: {
            value: {
              type: Number,
            },
            comparisonOperator: {
              type: String,
              enum: ["<", ">", "<=", ">="],
            },
          },
          max: {
            value: {
              type: Number,
            },
            comparisonOperator: {
              type: String,
              enum: ["<", ">", "<=", ">="],
            },
          },
        },
        exceedTimes: {
          type: Number,
          required: true,
        },
        interval: {
          type: String,
          enum: ["hour", "week", "month"],
          required: true,
        },
        graph: {
          type: String,
          required: true,
        },
      },
    { timestamps: true }
  );

  triggerSchemas[key] = mongoose.model(value, schema);
}

module.exports = triggerSchemas;

