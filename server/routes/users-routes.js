const express = require("express");

const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

// @route   GET api/places/:id
// @desc    gets users from database
// @access  Public for now, private and only available for admin later
router.get("/", usersController.getUsers);

// @route   POST api/places/:id
// @desc    signup for user
// @access  Public
router.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail() // TEST@tEst.cOm => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersController.signup
);

// @route   POST api/places/:id
// @desc    login for user
// @access  Public
router.post("/login", usersController.login);

module.exports = router;
