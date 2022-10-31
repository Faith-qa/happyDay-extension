const express = require('express');
const router = express.Router();
const {
	getImage,
	setImage,
	deleteImage,
} = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, setImage);

router.route('/:id').delete(protect, deleteImage);

router.route('/:date').get(getImage);

module.exports = router;
