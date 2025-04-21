const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const model = require("./utils/genAI");

const connectToMongoDb = require("./utils/connectToMongoose");
const checkJwt = require("./middlewares/checkJwt");
const User = require("./modals/user");
const Plan = require("./modals/workoutPlan");
const {
  validateWorkoutPlan,
  validateDietPlan,
} = require("./utils/validateFunctions");

dotenv.config();

const app = express();

// Middleware setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

// Connect to MongoDB
connectToMongoDb(process.env.MONGODB_URI);

// Protected route for user verification/creation
app.post("/api/protected-route", checkJwt, async (req, res) => {
  const user = req.body.user;
  if (!user) return res.status(400).json({ error: "No User found" });

  try {
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

    res.status(200).json({ message: "User created Successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server Error", error: e });
  }
});

// AI Plan Generation Route

app.post("/vapi/generate-program", express.text(), async (req, res) => {
  console.log("req for /vapi/generate-program");
  try {
    const parsedBody = JSON.parse(req.body);

    console.log(req.body);

    const {
      user_id,
      age,
      weight,
      injuries,
      height,
      fitness_goal,
      workout_days,
      fitness_level,
      dietary_restrictions,
    } = parsedBody;

    console.log("user_id", user_id);

    if (!user_id || !age || !weight || !height || !fitness_goal) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Workout Prompt
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
    const workoutPlanText = await workoutResult.response.text();
    let workoutPlan = JSON.parse(workoutPlanText);
    workoutPlan = validateWorkoutPlan(workoutPlan);

    // Diet Prompt
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
    const dietResultText = await dietResult.response.text();
    let dietPlan = JSON.parse(dietResultText);
    dietPlan = validateDietPlan(dietPlan);

    await Plan.updateMany(
      { userId: user_id, isActive: true },
      { $set: { isActive: false } }
    );

    const plan = await Plan.create({
      userId: user_id,
      name: `${fitness_goal} Plan - ${new Date().toLocaleDateString()}`,
      workoutPlan,
      dietPlan,
    });

    // Send response
    return res.status(200).json({
      message: "Plans generated successfully",
      workoutPlan,
      dietPlan,
    });
  } catch (error) {
    console.error("❌ Error generating plan:", error.message);
    return res
      .status(500)
      .json({ message: "Could not generate plans", error: error.message });
  }
});

app.get("/getplans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Please provide ID" });
    }

    const plans = await Plan.find({ userId: id }).sort({ createdAt: -1 });

    console.log(plans);

    return res
      .status(200)
      .json({ plans: plans, message: "Fetched Plans succesfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not find plans for", id, error: error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Started on port ${PORT}`);
});
