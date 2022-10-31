const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
	{
		text: String,
		author: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'users',
		},
		date: { type: Date, unique: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('questions', questionSchema);
