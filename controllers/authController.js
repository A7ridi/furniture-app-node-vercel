const User = require("../models/User");
// const CryptoJS = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { SECRET } = process.env;

module.exports = {
  createUser: async (req, res) => {
    const { username, email, password, location } = req.body;
    const newUser = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      location,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!email || !password) {
        res.status(401).json({ message: "Please enter email & password" });
      }

      if (!user) {
        res.status(401).json({ message: "Oops! Wrong credentials" });
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        res.status(401).json({ message: "Oops! Wrong credentails" });
      }

      const token = jwt.sign({ id: user.id }, `${process.env.SECRET}`, {
        expiresIn: "7d",
      });

      const {
        password: Password,
        __v,
        createdAt,
        updatedAt,
        ...userData
      } = user._doc;

      res.status(200).json({ ...userData, token });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};
