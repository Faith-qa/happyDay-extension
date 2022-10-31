/**
 * Controller functions for all plan routes
 */

const asyncHandler = require('express-async-handler');
const Plan = require('../model/planModel');
const { findOneAndUpdate } = require('../model/userModel');
const User = require('../model/userModel');

// @desc Get all plans
// @route GET /api/v1/plans
// @access Private
const getAllPlans = asyncHandler(async (req, res) => {
	const plans = await Plan.find({});

	res.status(200).json(plans);
});

// @desc Get plans for specific user
// @route GET /api/v1/plans/:id
// @access Private
const getUserPlans = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	const plan = await Plan.find({ user: req.params.id });

	if (!user) {
		res.status(401);
		throw new Error('User not found');
	}

	// Prevent user from accessing plans that don't belong to them
	if (req.user.id !== req.params.id) {
		res.status(401);
		throw new Error('Unauthorized');
	}

	res.status(200).json(plan);
});

// @desc Get all plans on specific date
// @route GET /api/v1/plans/:id/:date
// @access Private
const getUserPlansOnDate = asyncHandler(async (req, res) => {
	console.log("userid : ", req.params.id);
	console.log("date: ", req.params.date);
	
	const userid = req.params.id;
	const date2 = req.params.date;
	const plan = await Plan.findOne({user: userid, date: date2})
	console.log(plan)
	console.log("I made it here")

	let toLog = plan ? plan : 'plan was not found my g';

	console.log(toLog);
	console.log(new Date(req.params.date));

	res.status(200).json(plan);
});

// @desc Set plan
// @route POST /api/v1/plans/:id/:date
// @access Private
// const createPlanOnDate = asyncHandler(async (req, res) => {
// 	if (!req.body) {
// 		res.status(400);

// 		throw new Error('Please add plan data');
// 	}

// 	const exists = await Plan.findOne({ date: req.body.date });
// 	const user = await User.findById(req.user.id);

// 	if (!user || user.id !== req.params.id) {
// 		res.status(401);
// 		throw new Error('User not found');
// 	}

// 	const plan = exists
// 		? await Plan.findByIdAndUpdate(exists._id, req.body, { new: true })
// 		: await new Plan(req.body).save();

// 	res.status(200).json(plan);
// });

// @desc Edit plan
// @route PUT /api/v1/plans/:id/:date
// @access Private
const editPlanOnDate = asyncHandler(async (req, res) => {
	try {
		if (!req.body) {
			res.status(400);
	
			throw new Error('Please add plan data');
		}
		
	
		const updates = req.body;
	
		const newPlan = await Plan.findOneAndUpdate({user: req.body.user, date: req.body.date}, updates, {upsert: true, new: true});
		console.log("I AM HERE: ",newPlan)
		res.status(200).json(newPlan)

	}catch(error){console.log(error)};
	
});
	// create new object to push to db, convert user._id from body to mongoose object id

	// const exists = await Plan.findOneAndUpdate({
	// 	date: req.body.date,
	// 	user: req.body.user,
	// });
	// console.log(req.body.date);
	// console.log(new Date(req.body.date));
	// console.log(req.params.date);
	// console.log(exists.id);
	// console.log(req.body.date === req.params.date);
	// const user = await User.findById(req.user.id);
	//console.log(exists);
	// console.log(exists._id)
	// if (req.user.id !== req.params.id) {
	// 	res.status(401);
	// 	throw new Error('Unauthorized');
	// }

	// //const updates = req.body;
	// console.log(updates)

	// if (exists) {
	// 	var plan = await Plan.findByIdAndUpdate({_id: exists._id}, updates, {new: true})
	// }
	// // } else {
	// 	plan = await Plan.create(updates);
	// };
	// console.log("this is updated plan: ", plan);
	// const plan = exists
	// 	? await Plan.findByIdAndUpdate(
	// 			exists._id, updates, {new: true})
	// 			// {
	// 			// 	user,
	// 			// 	date,
	// 			// 	excitedAbout,
	// 			// 	gratefulForMorning,
	// 			// 	mainThreeTodo,
	// 			// 	dailyToDo,
	// 			// 	meals,
	// 			// 	water,
	// 			// 	exercise,
	// 			// 	meditation,
	// 			// 	relaxation,
	// 			// 	happyScale,
	// 			// 	happyMoment,
	// 			// 	gratefulForTonight,
	// 			// 	dailyQuestion,
	// 			// },
	// 	// 		{ new: true }
	// 	//   )
	// 	: await new Plan(req.body).save();

// 	res.status(200).json(newPlan);
// });

// @desc Delete all plans belonging to specific user
// @route DELETE /api/v1/plans/:id
// @access Private
const deleteUserPlans = asyncHandler(async (req, res) => {
	const plan = await Plan.deleteMany({ user: req.params.id });

	res.status(200).json({ message: `Delete plans for ${req.params.id}` });
});

module.exports = {
	getAllPlans,
	getUserPlans,
	getUserPlansOnDate,
	//createPlanOnDate,
	editPlanOnDate,
	deleteUserPlans,
};
