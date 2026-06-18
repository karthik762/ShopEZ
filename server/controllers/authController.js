const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password,user.password);

  if (!isMatch) {
    return res.status(400).json({
     message: "Invalid Password"
    });
  }

    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({
      message: "Login Successful",
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      address: address || "",
      phone: phone || ""
    });
    console.log("Created User ID:", user._id);
    console.log("Collection:", user.collection.name);

    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({
      message: "User Registered Successfully",
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };