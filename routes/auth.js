const express = require("express");
const Router = express.Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchdata = require("../middleware/fetchdata");


require("dotenv").config();

const JWT_SECRET = 'gfg_jwt_secret_key';

// Create a User using : POST '/api/auth'
Router.post(
  "/",
  [
    check("name", "name length should be 5 to 10 characters").isLength({
      min: 5,
      max: 10,
    }),
    check("email", "Invalid Email").isEmail(),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // If some error occurs, then this
    // block of code will run
    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    try {
      const salt = await bcryptjs.genSalt(10);
      const sacPass = await bcryptjs.hash(req.body.password, salt);

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry with this email already exists" });
      }
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: sacPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtAuth = jwt.sign(data, JWT_SECRET);

      res.json({ jwtAuth});
    } catch (err) {
      res.status(500).json({ error: "error accur" });
      console.log(err);
    }
  }
);


// Login User No Login require
Router.post(
  "/Login",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Password must be contain").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // If some error occurs, then this
    // block of code will run
    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      const passwordCompaire = await bcryptjs.compare(password, user.password);

      if (!passwordCompaire) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtAuth = jwt.sign(data, JWT_SECRET);
      res.json({ jwtAuth });
    } catch (err) {
      res.status(500).json({ error: "error accur" });
      console.log(err);
    }
  }
);

//   Get Info User
Router.post("/getDetails", fetchdata, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    // if(!user){
    //     return res.status(500).json({ error: "User Not available" });
    // }
    res.send(user);
  } catch (err) {
    res.status(500).json({ err });
  }
});


module.exports = Router;
