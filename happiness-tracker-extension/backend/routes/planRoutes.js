const express = require('express');
const router = express.Router();
const {
	getAllPlans,
	getUserPlans,
	getUserPlansOnDate,
	//createPlanOnDate,
	editPlanOnDate,
	deleteUserPlans,
} = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllPlans);

router
	.route('/:id')
	.get(protect, getUserPlans)
	.delete(protect, deleteUserPlans);

router
	.route('/:id/:date')
	.get(protect, getUserPlansOnDate)
	//.post(protect, createPlanOnDate)
	.put(protect, editPlanOnDate);

module.exports = router;
