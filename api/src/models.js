const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carSchema = new Schema({
  id: { type: String, unique: true },
  name: { type: String },
  owner: { type: String },
  price: { type: String },
  status: { type: String },
  condition: { type: String },
  mileage: { type: String },
  year: { type: Number },
  engine: { type: String },
  transmission: { type: String },
  owners: { type: String },
  inspected: { type: String },
  plate: { type: String },
  specifications: { type: String },
  safety: { type: String },
  interior: { type: String },
  electronics: { type: String },
  additional_information: { type: String },
  others: { type: String },
  image: { type: String },
  link: { type: String },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
