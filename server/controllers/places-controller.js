const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1"
  }
];

// @route   GET api/places/:id
// @desc    gets a single place by its id
// @access  Public
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place }); // { place } => { place === place }
};

// @route   GET api/places/user/:uid
// @desc    gets places that belong to a single user by the user id
// @access  Public
const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ place });
};

// @route   POST api/places
// @desc    creates a place
// @access  Public for now, private in the future
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body; // const { title } = req.body => const title = req.body.title

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); // unshift(createdPlace) => first element

  res.status(201).json({ place: createdPlace });
};

// @route   PATCH api/places/:pid
// @desc    edits a place by its id
// @access  Public for now, private in the future
const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; // same as ((p) => { return p.id === placeId })

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

// @route   DELETE api/places/:pid
// @desc    deletes a place by its id
// @access  Public for now, private in the future
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId); // filter returns a brand new array

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
