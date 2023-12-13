const mongoose = require("mongoose");
const { Schema } = mongoose;

//name, pass to field, both type string
const exerciseSchema = new Schema({
  exerciseName: {
    type: String,
    default: null,
  },
  exerciseId: {
    type: String,
    unique: true,
  },
  exerciseStartDate: {
    type: Date,
    default: null,
  },
  exerciseEndDate: {
    type: Date,
    default: null,
  },
  exerciseTime: {
    type: Date,
    default: null,
  },
  repeatDate: {
    type: [String],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
});

const foodItemSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  calory: {
    type: Number,
    default: null,
  },
});

const foodSchema = new Schema({
  foodList: {
    type: [foodItemSchema],
    default: null,
  },
  foodId: {
    type: String,
    unique: true,
  },
  foodCategory: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
});

const userSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  userFoodList: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
    default: null,
  },
  userExerciseList: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
  todayCalory: {
    type: Number,
    default: null,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);
const Food = mongoose.model("Food", foodSchema);

module.exports = User;
