const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  id_car: { type: String, unique: true },
  seller: { type: String },
  name: { type: String },
  price: { type: String },
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
  numberOfPeople: { type: String },
  numberOfDoors: { type: String },
  safety: { type: [String] },
  interior: { type: [String] },
  electronics: { type: [String] },
  additionalInfo: { type: String },
  others: { type: String },
  image: { type: [String] },
  phone: { type: String },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;