const express = require('express');
const router = express.Router();
const {
	//getAllQuestions,
	getQuestion,
	setQuestion,
	putQuestion,
	deleteQuestion,
	massUpload,
	//validate_csv,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router
	.route('/')
	//.get(protect, getAllQuestions)
	.post(protect, setQuestion)
	.put(protect, putQuestion)
	.delete(protect, deleteQuestion);

router.route('/:date').get(protect, getQuestion);
router.route('/csv').post(protect, massUpload)

module.exports = router;
