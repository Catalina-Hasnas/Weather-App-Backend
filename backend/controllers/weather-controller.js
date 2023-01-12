const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getWeather = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "secret-key");

  const userId = decodedToken.id;

  const getCity = async () => {
    const user = await User.findById(userId);
    if (!user) {
      const error = new HttpError("Could not find user with this id.", 500);
      return next(error);
    }
    const city = user.prefferences.location[0].city;

    if (!city) {
      const error = new HttpError("Could not find city of this user", 500);
      return next(error);
    }
    return city;
  };

  const city = await getCity();

  axios
    .get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
    )
    .then(function (response) {
      console.log({ response });
    })
    .catch(function (err) {
      console.log({ err });
      const error = new HttpError("Could not find weather for this city.", 500);
      return next(error);
    });

  res.status(200).json({ message: "worked" });
};

exports.getWeather = getWeather;
