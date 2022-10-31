const express = require('express');
const router = express.Router();
const {
	getAllQuotes,
	getQuote,
	setQuote,
	putQuote,
	deleteQuote,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/authMiddleware');

router
	.route('/')
	.get(protect, getAllQuotes)
	.post(protect, setQuote)
	.put(protect, putQuote)
	.delete(protect, deleteQuote);

router.route('/:date').get(protect, getQuote);

module.exports = router;
