const asyncHandler = require('express-async-handler');
const BibleQuote = require('../model/bibleModel');

// @desc Get all bible quote of the day
// @route GET /api/v1/bible/all
// @access Private
const getAllBibleQuotes = asyncHandler(async (req, res) => {
	const bibleQuotes = await BibleQuote.find({});

	res.status(200).json(bibleQuotes);
});

// @desc Get bible quote of the day
// @route GET /api/v1/bible/:date
// @access Private
const getBibleQuote = asyncHandler(async (req, res) => {
	const bibleQuote = await BibleQuote.findOne({
		date: req.params.date,
	});

	res.status(200).json(bibleQuote);
});

// @desc Set bible quote of the day
// @route POST /api/v1/bible
// @access Private
const setBibleQuote = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Add bible quote data');
	}

	const exists = await BibleQuote.findOne({ date: req.body.date });

	const bibleQuote = exists
		? await BibleQuote.findByIdAndUpdate(exists._id, req.body, { new: true })
		: await new BibleQuote(req.body).save();

	res.status(200).json(bibleQuote);
});

// @desc Edit bible quote of the day
// @route PUT /api/v1/bible/
// @access Private
const putBibleQuote = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Add bible quote data');
	}

	const exists = await BibleQuote.findOne({ date: req.body.date });

	const bibleQuote = exists
		? await BibleQuote.findByIdAndUpdate(exists._id, req.body, { new: true })
		: await new BibleQuote(req.body).save();

	res.status(200).json(bibleQuote);
});

// @desc Delete bible quote of the day
// @route DELETE /api/v1/bible/
// @access Private
const deleteBibleQuote = asyncHandler(async (req, res) => {
	const bibleQuote = await BibleQuote.findByIdAndDelete(req.body.id);

	res.status(200).json({ message: `Deleted bible quote ${req.body.id}` });
});

module.exports = {
	getAllBibleQuotes,
	getBibleQuote,
	setBibleQuote,
	putBibleQuote,
	deleteBibleQuote,
};
