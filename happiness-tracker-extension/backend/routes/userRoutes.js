const express = require('express');
const router = express.Router();
const {
	getAllUsers,
	getSpecificUser,
	createUser,
	changeUserNameOrPassword,
	editUser,
	deleteUser,
	loginUser,
	getUserById,
	deleteUserById,
	countusers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.get('/countusers', countusers);

// get all user data and create new user

router
	.route('/')
	.get(protect, getAllUsers)
	.post(createUser)
	.put(protect, changeUserNameOrPassword);

// login user
router.post('/login', loginUser);

// routes specifically for admin
router.route('/:id').get(protect, getUserById).delete(protect, deleteUserById);
router.post('/countusers', countusers);
// get data for specific user, edit user data and delete user
router
	.route('/me')
	.get(protect, getSpecificUser)
	.put(protect, editUser)
	.delete(protect, deleteUser);
//count users

module.exports = router;
