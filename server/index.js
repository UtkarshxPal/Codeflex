const express = require("express");
const User = require("./modals/user");
const connectToMongoDb = require("./utils/connectToMongoose");
const checkJwt = require("./middlewares/checkJwt");

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Started on port 3000");
});
