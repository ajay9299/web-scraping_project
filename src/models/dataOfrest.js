const mongoose = require("mongoose");

const restData = new mongoose.Schema({
  name: {
    type: String,
  },

  address: {
    type: String,
  },

  urlOfimage: {
    type: String,
  },

  workhours: {
    type: String,
  },
});

const dataRest = new mongoose.model("scrapdata", restData);
module.exports = dataRest;
