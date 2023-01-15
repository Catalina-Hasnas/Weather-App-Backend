const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: { type: String, required: true },
  weather: [
    {
      date: { type: String, required: true },
      by_hour: [
        {
          time: { type: Date, required: true },
          temp_c: { type: Number, required: true },
          chance_of_rain: { type: Number, required: true },
          condition: {
            text: { type: String, required: true },
            icon: { type: String, required: true },
          },
        },
      ],
      maxtemp_c: { type: Number, required: true },
      mintemp_c: { type: Number, required: true },
      avgtemp_c: { type: Number, required: true },
      maxwind_kph: { type: Number, required: true },
      avghumidity: { type: Number, required: true },
      daily_chance_of_rain: { type: Number, required: true },
      condition: {
        text: { type: String, required: true },
        icon: { type: String, required: true },
      },
    },
  ],
});

module.exports = mongoose.model("City", citySchema);
