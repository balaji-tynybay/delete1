const mongoose = require("mongoose");

const DmrReport = mongoose.model(
    "DmrReport",
    new mongoose.Schema(
        {
            date: {
                type: String,
                required: true
            },
            key: {
                type: String,
                required: true
            }  
        },
        { timestamps: true }
    )
);

module.exports = DmrReport;
