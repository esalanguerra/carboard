const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carSchema = new Schema({
  id_car: { type: String, unique: true },
  seller: { type: String },
  name: { type: String },
  price: { type: Number },
  owners: { type: String },
  condition: { type: String },
  mileage: { type: String },
  year: { type: Number },
  engine: { type: String },
  gearbox: { type: String },
  inspected: { type: String },
  driveType: { type: String },
  plate: { type: String },
  power: { type: String },
  topSpeed: { type: String },
  acceleration: { type: String },
  numberOfPeople: { type: Number },
  numberOfDoors: { type: Number },
  safety: { type: [String] },
  interior: { type: [String] },
  electronics: { type: [String] },
  additionalInfo: { type: String },
  others: { type: String },
  images: { type: [String] },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  link: { type: String },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
