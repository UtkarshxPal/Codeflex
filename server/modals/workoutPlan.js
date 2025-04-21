const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    sets: {
      type: Number,
    },
    reps: Number,
    duration: Number,
    description: String,
    exercises: [String],
  },
  { _id: false }
);

const exerciseDaySchema = new mongoose.Schema(
  {
    day: String,
    routines: [routineSchema],
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    schedule: [String],
    exercises: [exerciseDaySchema],
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    dailyCalories: Number,
    meals: [
      {
        name: String,
        foods: [String],
      },
    ],
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: { type: String },
    workoutPlan: workoutPlanSchema,
    dietPlan: dietPlanSchema,
    isActive: { type: Boolean, index: true, default: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
