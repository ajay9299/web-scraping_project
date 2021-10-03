const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Constants
const PORT = 3000;

const AddressDetailRoute = require("./src/routes/addressController");
const NameDetailRoute = require("./src/routes/nameController");
const WorkHoursRoute = require("./src/routes/bussniessHourController");

// App
const app = express();
app.use(cors());
app.use(express.json());

app.use("/address", AddressDetailRoute);
app.use("/name", NameDetailRoute);
app.use("/workhour", WorkHoursRoute);

const db = "mongodb://localhost:27017/webscrap";

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`server started on port :${PORT}`);
});
