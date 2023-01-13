const axios = require("axios");
const HttpError = require("../models/http-error");
const City = require("../models/city");

const getWeather = async (req, res, next) => {
  const city = req.params.city;

  const existingCity = await City.findOne({ name: city }).exec();

  // axios
  //   .get(
  //     `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
  //   )
  //   .then(function (response) {
  //     // console.log({ response });
  //   })
  //   .catch(function (err) {
  //     // console.log({ err });
  //     const error = new HttpError("Could not find weather for this city.", 500);
  //     return next(error);
  //   });

  res.status(200).json({ message: "worked" });
};

exports.getWeather = getWeather;
