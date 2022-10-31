const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const Plan = require('../model/planModel');
const asyncHandler = require('express-async-handler');

// @desc Get all users
// @route GET /api/v1/users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select('_id name email dailyToDo');

	res.status(200).json(users);
});

// @desc Get specific user
// @route GET /api/v1/users/me
// @access Private
const getSpecificUser = asyncHandler(async (req, res) => {
	const { _id, name, email, dailyToDo } = await User.findById(req.user.id);

	res.status(200).json({
		id: _id,
		name,
		email,
		dailyToDo,
	});
});

// @desc Get specific user
// @route GET /api/v1/users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
	const { _id, name, email, dailyToDo } = await User.findById(req.params.id);

	res.status(200).json({
		id: _id,
		name,
		email,
		dailyToDo,
	});
});

// @desc Register a user
// @route POST /api/v1/users
// @access Public
const createUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(404);

		throw new Error('Please fill in all fields');
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(201).json({
			_id: userExists.id,
			name: userExists.name,
			email: userExists.email,
			token: generateToken(userExists._id),
		});
	}

	// Hashing password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create User
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc Login a user
// @route POST /api/v1/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Checking for user in database
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
	}
});

// @desc Change user name or password
// route PUT /api/v1/users
// @access Private
const changeUserNameOrPassword = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	// check for user in db
	const user = await User.findOne({ email });

	if (user) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const changed = await User.findByIdAndUpdate(user._id, {
			name: name === '' ? user.name : name,
			password: password === '' ? user.password : hashedPassword,
		});

		res.status(201).json({
			_id: user.id,
			name,
			email,
		});
	} else {
		res.status(400);
		throw new Error('User does not exist');
	}
});

// @desc Edit user
// @route PUT /api/v1/users/me
// @access Private
const editUser = asyncHandler(async (req, res) => {
	const { email, name, password, newPassword } = req.body;
	console.log(req.body);

	// find user in database
	const user = await User.findOne({ email });

	const passwordValid = await bcrypt.compare(password, user.password);

	// check if current password is valid
	if (user && passwordValid) {
		// hash new password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(newPassword, salt);
		console.log(hashed);

		// const hashedPassword = need to ask moose for help with this
		// 	newPassword !== '' ? await bcrypt.hash(newPassword, salt) : password;
		console.log(name === '' ? user.name : name);
		const payload = {
			name: name === '' ? user.name : name,
			password:
				newPassword === ''
					? user.password
					: await bcrypt.hash(newPassword, salt),
		};

		const changedName = await User.findByIdAndUpdate(req.user.id, payload, {
			new: true,
		});
		return res.status(200).json(changedName);
	} else {
		res.status(401);
		throw new Error('Please enter the correct password');
	}
});

// @desc Delete
// @route DELETE /api/v1/users/me
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	// delete all plans belonging to user before deleting user
	const plan = await Plan.deleteMany({ user: req.user.id });
	const user = await User.findByIdAndDelete(req.user.id);

	res.status(200).json({ id: req.params.id });
});

const countusers = asyncHandler(async (req, res) => {
	console.log("I MADE")
	//const {year} = req.body
	
	try{
		const number_users = await User.find({$expr: {$eq: [{$year: "$createdAt"}, 2022]}}).count()
									// .aggregate([{$project:{year: {$year:"$createdAt"}}}, {$match:{year:{$eq:req.params.year}}}])
									// .count()
		return res.status(200).json(number_users)
	}catch(err){console.log(err)}
	//const number_users = await User.aggregate([{$project:{year: {$year:"$date"}, month: {$month: "$date"}}}, {$match:{year:{$eq:year}, month:{$eq:month}}}]).count();
	
})

// @desc Delete
// @route DELETE /api/v1/users/:id
// @access Private
const deleteUserById = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);

	res.status(200).json({ id: req.params.id });
});

// Generate token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
	getAllUsers,
	getSpecificUser,
	getUserById,
	createUser,
	changeUserNameOrPassword,
	loginUser,
	editUser,
	deleteUser,
	deleteUserById,
	countusers
};

