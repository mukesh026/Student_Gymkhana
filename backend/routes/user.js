const express = require("express");
const log = require("../utils/log");
const { validateSignup, validateLogin } = require("../utils/validation");
const signUpRoute = require("../controllers/users/signup");
const loginRoute = require("../controllers/users/login");
const blogRoute = require("../controllers/users/blog");
const sathiRoute = require("../controllers/users/sathi");

const route = express.Router();

// Apply logging middleware to all routes
route.use(log);

// User authentication routes with validation
route.use('/signup', validateSignup, signUpRoute);
route.use('/login', validateLogin, loginRoute);

// Other user routes
route.use('/sathi', sathiRoute);
route.use('/blogs', blogRoute);

module.exports = route;