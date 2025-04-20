const express = require("express");
const User = require("./modals/user");
const connectToMongoDb = require("./utils/connectToMongoose");
const checkJwt = require("./middlewares/checkJwt");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Plan = require("./modals/workoutPlan");

const app = express();

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("public"));

connectToMongoDb(process.env.MONGODB_URI);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/protected-route", checkJwt, async (req, res) => {
  const user = req.body.user;
  console.log(user);

  try {
    if (!user) res.res({ error: "No User found" });

    let existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.json({ message: "User already exists", user: existingUser });
    }
    const newUser = {
      name: user.name,
      email: user.email,
      profilePicture: user.picture,
      provider: user.provider || "auth0",
    };

    const savedUser = await User.create(newUser);

    if (!savedUser)
      return res.status(500).json({ message: "Error saving user" });

    res.status(200).json({ message: "User created Succesfully" });
  } catch (e) {
    res.status(500).json({ message: "Server Error", error: e });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/vapi/generate-program", async (req, res) => {
  try {
    const data = req.data;
    console.log(data);
    const {
      age,
      weight,
      injuries,
      height,
      fitness_goal,
      workout_days,
      fitness_level,
      dietetary_restrictions,
    } = data;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.4,
        top: 0.9,
        responseMimeType: "application/json",
      },
    });

    const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
      Age: ${age}
      Height: ${height}
      Weight: ${weight}
      Injuries or limitations: ${injuries}
      Available days for workout: ${workout_days}
      Fitness goal: ${fitness_goal}
      Fitness level: ${fitness_level}
      
      As a professional coach:
      - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
      - Design exercises that match the fitness level and account for any injuries
      - Structure the workouts to specifically target the user's fitness goal
      
      CRITICAL SCHEMA INSTRUCTIONS:
      - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
      - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
      - For example: "sets": 3, "reps": 10
      - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
      - Instead use specific numbers like "reps": 12 or "reps": 15
      - For cardio, use "sets": 1, "reps": 1 or another appropriate number
      - NEVER include strings for numerical fields
      - NEVER add extra fields not shown in the example below
      
      Return a JSON object with this EXACT structure:
      {
        "schedule": ["Monday", "Wednesday", "Friday"],
        "exercises": [
          {
            "day": "Monday",
            "routines": [
              {
                "name": "Exercise Name",
                "sets": 3,
                "reps": 10
              }
            ]
          }
        ]
      }
      
      DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

    const workoutResult = await model.generateContent(workoutPrompt);
    const workoutPlanText = workoutResult.response.text();
    let workoutPlan = JSON.parse(workoutPlanText);
    workoutPlan = validateWorkoutPlan(workoutPlan);

    // Validate the input from AI
    function validateWorkoutPlan(plan) {
      const validatedPlan = {
        schedule: plan.schedule,
        exercises: plan.exercises.map((exercise) => ({
          day: exercise.day,
          routines: exercise.routines.map((routine) => ({
            name: routine.name,
            sets:
              typeof routine.sets === "number"
                ? routine.sets
                : parseInt(routine.sets) || 1,
            reps:
              typeof routine.reps === "number"
                ? routine.reps
                : parseInt(routine.reps) || 10,
          })),
        })),
      };
      return validatedPlan;
    }
    const dietPrompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
        Age: ${age}
        Height: ${height}
        Weight: ${weight}
        Fitness goal: ${fitness_goal}
        Dietary restrictions: ${dietary_restrictions}
        
        As a professional nutrition coach:
        - Calculate appropriate daily calorie intake based on the person's stats and goals
        - Create a balanced meal plan with proper macronutrient distribution
        - Include a variety of nutrient-dense foods while respecting dietary restrictions
        - Consider meal timing around workouts for optimal performance and recovery
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "dailyCalories" MUST be a NUMBER, not a string
        - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
        - ONLY include the EXACT fields shown in the example below
        - Each meal should include ONLY a "name" and "foods" array

        Return a JSON object with this EXACT structure and no other fields:
        {
          "dailyCalories": 2000,
          "meals": [
            {
              "name": "Breakfast",
              "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
            },
            {
              "name": "Lunch",
              "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
            }
          ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

    const dietResult = await model.generateContent(dietPrompt);
    const dietResultText = dietResult.response.text();
    let dietPlan = JSON.parse(dietResultText);
    dietPlan = validateDietPlan(dietPlan);

    function validateDietPlan(plan) {
      const validatedPlan = {
        dailyCalories: plan.dailyCalories,
        meals: plan.meals.map((meal) => ({
          name: meal.name,
          foods: meal.foods,
        })),
      };
      return validatedPlan;
    }
    console.log("dierPlan", dietPlan);
    console.log("workoutplan ", workoutPlan);
    // Store in MongodB next
  } catch (error) {}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Started on port 3000");
});
