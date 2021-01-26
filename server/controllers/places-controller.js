const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

// @route   GET api/places/:id
// @desc    gets a single place by its id
// @access  Public
const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId);
	} catch (err) {
		// if something is wrong with the req.params
		const error = new HttpError(
			'Something went wrong, could not find a place.',
			500
		);
		return next(error);
	}

	// if place does not exist
	if (!place) {
		const error = new HttpError(
			'Could not find a place for the provided id.',
			404
		);
		return next(error);
	}

	res.json({ place: place.toObject({ getters: true }) });
};

// @route   GET api/places/user/:uid
// @desc    gets places that belong to a single user by the user id
// @access  Public
const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	// let places

	let userWithPlaces;

	try {
		userWithPlaces = await User.findById(userId).populate('places');
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later.',
			500
		);
		return next(error);
	}

	// if(!places || places.length === 0){}

	if (!userWithPlaces || userWithPlaces.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		);
	}

	res.json({
		places: userWithPlaces.places.map((place) =>
			place.toObject({ getters: true })
		),
	});
};

// @route   POST api/places
// @desc    creates a place
// @access  Public for now, private in the future
const createPlace = async (req, res, next) => {
	// errors object from the req in the setup on the places-router
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { title, description, address, creator } = req.body; // const { title } = req.body => const title = req.body.title

	let coordinates;

	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg', // => @TODO
		creator,
	});

	// checks to see if user provided - (creator) exists
	let user;

	try {
		user = await User.findById(creator);
	} catch (err) {
		const error = new HttpError('Creating place failed, please try again', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find user for provided id', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();

		// storing the place
		await createdPlace.save({ session: sess });

		// adding the place to our user's places array with mongoose's push method
		user.places.push(createdPlace);

		// save the updated user
		await user.save({ session: sess });

		// session commits the transaction
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Creating place failed, please try again', 500);
		return next(error); // => stops the code execution if we have an error
	}
	res.status(201).json({ place: createdPlace });
};

// @route   PATCH api/places/:pid
// @desc    edits a place by its id
// @access  Public for now, private in the future
const updatePlace = async (req, res, next) => {
	// errors object from the req in the setup on the places-router
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find the place.',
			404
		);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new Http(
			'Something went wrong, could not update the place',
			500
		);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

// @route   DELETE api/places/:pid
// @desc    deletes a place by its id
// @access  Public for now, private in the future
const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId).populate('creator');
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place with that id.',
			404
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError('Could not find place for this id', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();

		// deleting the place
		await place.remove({ session: sess });

		// removing the place from the creator's places array
		place.creator.places.pull(place);

		// save the updated user
		await place.creator.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete the place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
