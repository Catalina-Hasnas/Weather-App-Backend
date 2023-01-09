const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

dotenv.config();

console.log({ process: process.env.MONGODB_PASSWORD });

app.use(bodyParser.json());

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Couldn't find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unkown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://zzpetrugg:${process.env.MONGODB_PASSWORD}@cluster0.vl04ugk.mongodb.net/auth?retryWrites=true&w=majority`
  )
  .then(() => app.listen(5000))
  .catch((error) => console.log(error));
