const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
// ////////////////////////////////////////// MONGOOSE CONNECT /////////////////////////////////
mongoose.connect("mongodb://localhost:27017/hackathon_data_base", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ////////////////////////////////////////// CROP SCHEMA /////////////////////////////////

const cropSchema = new mongoose.Schema({
  cropName: String,
  plantingDate: Date,
  harvestDate: Date,
  estimatedYield: Number,
});

const Crop = mongoose.model("Crop", cropSchema);

// ////////////////////////////////////////// USER SCHEMA /////////////////////////////////

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  landnumber: String,
  crops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop" }],
});

const User = mongoose.model("User", userSchema);


//////////////////////////////////////// RETAILER SCHEMA /////////////////////////////////

const retailerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  gstNumber: String,
  panNumber: String,
  address: String,
  // Add more fields as needed
});

const Retailer = mongoose.model("Retailer", retailerSchema);

/////////////////////////////////////// POST REQUEST FOR /api/retailerSignup //////////////////////////////////////////////

app.post("/api/retailerSignup", async (req, res) => {
  try {
    const newRetailer = new Retailer(req.body);
    const savedRetailer = await newRetailer.save();

    res.json({ message: "Retailer signed up successfully", retailer: savedRetailer });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

/////////////////////////////////////// POST REQUEST FOR /api/retailerLogin //////////////////////////////////////////////

app.post("/api/retailerLogin", async (req, res) => {
  try {
    const retailerEmail = req.body.email;
    const retailerPassword = req.body.password;

    const retailer = await Retailer.findOne({ email: retailerEmail }).exec();

    if (!retailer) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    const isPasswordValid = retailerPassword === retailer.password;

    if (isPasswordValid) {
      // Password is correct, return the entire retailer data
      res.json({ passwordMatch: true, retailer });
    } else {
      // Password is incorrect
      res.json({ passwordMatch: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

///////////////////////////////////////////    POST REQUEST FOR /api/users     ////////////////////////////////////////////////

app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    res.json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

/////////////////////////////////////////////    POST REQUEST FOR /api/addcrop //////////////////////////////////////////////

app.post("/api/addCrop", async (req, res) => {
  try {
    const { userName, crop } = req.body;

    const user = await User.findOne({ name: userName }).exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newCrop = new Crop(crop);

    const savedCrop = await newCrop.save();

    user.crops.push(savedCrop);

    const updatedUser = await user.save();

    res.json({ message: "Crop added successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////////  GET REQUEST FOR /api/checkAvailability  ////////////////////////////////////////////////////

app.get("/api/checkAvailability", async (req, res) => {
  try {
    const type = req.query.type;
    const value = req.query.value;

    if (!type || !value) {
      return res.status(400).json({
        error: "Type and value are required in the query parameters.",
      });
    }

    const isAvailable = !(await User.exists({ [type]: value }));

    res.json({ available: isAvailable });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

////////////////////////////////////////// GET REQUEST FOR /api/checkpassword /////////////////////////////////////////////////

app.get("/api/checkpassword", async (req, res) => {
  try {
    const phoneNumber = req.query.value;

    if (!phoneNumber) {
      return res.status(400).json({
        error: "Phone number is required in the query parameters.",
      });
    }

    const user = await User.findOne({ phone: phoneNumber }).exec();

    if (!user) {
      return res.json({ error: "User not found" });
    }

    const providedPassword = req.query.password;

    if (!providedPassword) {
      return res.status(400).json({
        error: "Password is required in the query parameters.",
      });
    }

    const isPasswordValid = providedPassword === user.password;

    if (isPasswordValid) {
      // Password is correct, return the entire user data
      res.json({ passwordMatch: true, user });
    } else {
      // Password is incorrect
      res.json({ passwordMatch: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

///////////////////////////////////////   GET REQUEST FOR /api/users   ////////////////////////////////////////////////////

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal sever error",
    });
  }
});

///////////////////////////////////////   GET REQUEST FOR /api/userByName    ////////////////////////////////////////////////////

app.get("/api/userByName", async (req, res) => {
  try {
    const userName = req.query.name;
    console.log("Fetching user data for:", userName);

    if (!userName) {
      return res
        .status(400)
        .json({ error: "User name is required in the query parameters." });
    }

    const user = await User.findOne({ name: userName })
      .populate("crops")
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////////   GET REQUEST FOR /api/addCrop   ////////////////////////////////////////////////////

app.get("/api/addCrop", async (req, res) => {
  try {
    const users = await Crop.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal sever error",
    });
  }
});

///////////////////////////////////////   GET REQUEST FOR /api/users////////////////////////////////////////////////////
// NEW ROUTE for fetching all users and their crops
app.get("/api/allUsersAndCrops", async (req, res) => {
  try {
    const users = await User.find().populate("crops");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal sever error",
    });
  }
});

///////////////////////////////////////   GET REQUEST FOR /api/users////////////////////////////////////////////////////

/////////////////////////////////////// app.listen     ////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
