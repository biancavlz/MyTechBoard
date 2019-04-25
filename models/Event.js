const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    id: String,
    name: String,
    link: String,
    local_date: String,
    local_time: String,
    city: String,
    address: String,
    company: String,
    visibility: String
  }
)

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
