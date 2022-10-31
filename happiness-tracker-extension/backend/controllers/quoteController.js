const asyncHandler = require('express-async-handler');
const Quote = require('../model/quoteModel');

// @desc Get all quotes of the day
// @route GET /api/v1/quotes/all
// @access Private
const getAllQuotes = asyncHandler(async (req, res) => {
	const quotes = await Quote.find({});

	res.status(200).json(quotes);
});

// @desc Get quote of the day
// @route GET /api/v1/quotes/:date
// @access Private
const getQuote = asyncHandler(async (req, res) => {
	const quote = await Quote.findOne({ date: req.query.date });

	res.status(200).json(quote);
});

// @desc Set quote of the day
// @route POST /api/v1/quotes
// @access Private
const setQuote = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Please add quote data');
	}

	const exists = await Quote.findOne({ date: req.body.date });

	const quote = exists
		? await Quote.findByIdAndUpdate(exists._id, req.body, { new: true })
		: await new Quote(req.body).save();

	res.status(200).json(quote);
});

// @desc Edit quote of the day
// @route PUT /api/v1/quotes
// @access Private
const putQuote = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Please add quote data');
	}

	const exists = await Quote.findOne({ date: req.body.date });

	const quote = exists
		? await Quote.findByIdAndUpdate(exists._id, req.body, { new: true })
		: await new Quote(req.body).save();

	res.status(200).json(quote);
});

// @desc delete a quote
// @route GET /api/v1/quotes
// @access Private
const deleteQuote = asyncHandler(async (req, res) => {
	console.log(req);
	const quote = await Quote.findByIdAndDelete(req.body.id);

	res.status(200).json({ message: `Deleted quote ${req.body.id}` });
});

module.exports = {
	getAllQuotes,
	getQuote,
	setQuote,
	putQuote,
	deleteQuote,
};
