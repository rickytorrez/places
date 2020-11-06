const express = require("express");

const placesControllers = require("../controllers/places-controller");

const HttpError = require("../models/http-error");

const router = express.Router();

// @route   GET api/places/:id
// @desc    gets a single place by its id
// @access  Public
router.get("/:pid", placesControllers.getPlaceById);

// @route   GET api/places/user/:uid
// @desc    gets places that belong to a single user by the user id
// @access  Public
router.get("/user/:uid", placesControllers.getPlaceByUserId);

// @route   POST api/places
// @desc    creates a place
// @access  Public for now, private in the future
router.post("/", placesControllers.createPlace);

// @route   PATCH api/places/:pid
// @desc    edits a place by its id
// @access  Public for now, private in the future
router.patch("/:pid", placesControllers.updatePlace);

// @route   DELETE api/places/:pid
// @desc    deletes a place by its id
// @access  Public for now, private in the future
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
