const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

// @route   GET api/places/:id
// @desc    gets a single place by its id
// @access  Public
router.get("/:pid", placesControllers.getPlaceById);

// @route   GET api/places/user/:uid
// @desc    gets places that belong to a single user by the user id
// @access  Public
router.get("/user/:uid", placesControllers.getPlacesByUserId);

// @route   POST api/places
// @desc    creates a place
// @access  Public for now, private in the future
router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

// @route   PATCH api/places/:pid
// @desc    edits a place by its id
// @access  Public for now, private in the future
router.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

// @route   DELETE api/places/:pid
// @desc    deletes a place by its id
// @access  Public for now, private in the future
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
