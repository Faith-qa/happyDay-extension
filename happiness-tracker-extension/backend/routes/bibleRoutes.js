const express = require('express');
const router = express.Router();
const {
	getAllBibleQuotes,
	getBibleQuote,
	setBibleQuote,
	putBibleQuote,
	deleteBibleQuote,
} = require('../controllers/bibleController');
const { protect } = require('../middleware/authMiddleware');

router
	.route('/')
	.get(protect, getAllBibleQuotes)
	.post(protect, setBibleQuote)
	.put(protect, putBibleQuote)
	.delete(protect, deleteBibleQuote);

router.route('/:date').get(protect, getBibleQuote);

module.exports = router;
