const mongoose = require("mongoose");
const DmrReport = require('./dmr_report.js');
const triggerSchemas = require("./set_trigger.js");
const HelpDesk = require("./help_desk.js");


mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.DmrReport = DmrReport
db.triggerSchemas = triggerSchemas
db.HelpDesk = HelpDesk;


module.exports = db;
