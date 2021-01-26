const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

// => /api/places
app.use('/api/places', placesRoutes);
// => /api/users
app.use('/api/users', usersRoutes);

// Unknown routes middleware
app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

// Error middleware
app.use((error, req, res, next) => {
	// headersSent -> check if the response has already been sent
	if (res.headersSent) {
		// return next and forward the error since we already sent the response
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error ocurred!' });
});

mongoose
	.connect(
		`mongodb+srv://ricky123:ricky123@devcamper.xqkln.mongodb.net/prod?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((err) => {
		console.log(err);
	});
