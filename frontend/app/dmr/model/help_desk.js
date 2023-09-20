const mongoose = require("mongoose");

const helpDeskSchema = new mongoose.Schema({
    htGrid: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: [String], // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    transformerIC: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: [String], // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    transformerOG: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: [String], // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    feederConsumptionLT: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: [String], // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    DgRoomConsumption: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: [String], // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    spareFeeder: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    AHURoom: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    liftPanel: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    risingMain: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    DGUnit: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    DGRunHours: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    ChillerConsumption: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    ChillerApproach: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    getWaterTankValues: [{
        Source: {
            type: String, // Define as an array of strings
          },
      triggerNumber: {
        type: String, // Define as an array of strings
      },
      values: {
        type: [String], // Define as an array of dates
      }
    }],
    date:{
        type: Date, // Define as an array of dates
      }
  },{ timestamps: true }
  );
  
  const HelpDesk = mongoose.model('HelpDesk', helpDeskSchema);

module.exports = HelpDesk;

