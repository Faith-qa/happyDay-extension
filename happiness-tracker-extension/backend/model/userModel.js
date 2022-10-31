const mongoose = require('mongoose');

/**
 * Defining how user data will be structured in the db
 */
const userSchema = mongoose.Schema(
	{
		name: String,
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'User must have a password'],
		},
		stripeCustomerId: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('users', userSchema);
