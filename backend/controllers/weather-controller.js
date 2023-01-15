const axios = require("axios");
const HttpError = require("../models/http-error");
const City = require("../models/city");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const getWeather = async (req, res, next) => {
  const city = req.params.city;

  const existingCity = await City.findOne({ name: city }).lean().exec();

  const formatResponse = (weatherArr) => {
    return weatherArr.reduce(
      (acc, obj) => {
        if (obj.date === dayjs().utc().startOf("day").format("YYYY-MM-DD")) {
          acc.today = obj;
        } else {
          let newObj = { ...obj };
          delete newObj.by_hour;
          acc.forecast.push(newObj);
        }
        return acc;
      },
      { today: {}, forecast: [] }
    );
  };

  const fetchWeather = async (city) => {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
    );
    const forecastDay = response.data.forecast.forecastday.map((day) => {
      return {
        date: dayjs(day.date).format("YYYY-MM-DD"),
        maxtemp_c: day.day.maxtemp_c,
        mintemp_c: day.day.mintemp_c,
        avgtemp_c: day.day.avgtemp_c,
        maxwind_kph: day.day.maxwind_kph,
        avghumidity: day.day.avghumidity,
        daily_chance_of_rain: day.day.daily_chance_of_rain,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon,
        },
        by_hour: day.hour.map((hour) => {
          return {
            time: hour.time,
            temp_c: hour.temp_c,
            chance_of_rain: hour.chance_of_rain,
            condition: {
              text: hour.condition.text,
              icon: hour.condition.icon,
            },
          };
        }),
      };
    });
    const newCity = new City({
      name: city,
      weather: forecastDay,
    });
    let result = {};
    try {
      await newCity.save();
      result = await formatResponse(forecastDay);
    } catch (err) {
      const error = new HttpError("Failed to create another city.", 500);
      return next(error);
    }
    return result;
  };

  let response;

  if (!existingCity) {
    try {
      response = await fetchWeather(city);
    } catch (err) {
      console.log({ err });
      const error = new HttpError("Could not find weather for this city.", 500);
      return next(error);
    }
  }

  if (existingCity) {
    response = await formatResponse(existingCity.weather);
  }

  res.status(200).json({ cityWeather: response });
};

exports.getWeather = getWeather;
