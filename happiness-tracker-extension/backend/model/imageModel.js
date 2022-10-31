const mongoose = require('mongoose');

/**
 * Defining model for images
 */
const imageSchema = mongoose.Schema(
	{
		image: {
			type: String,
			required: true,
			unique: true,
		},
		date: { type: Date, unique: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('images', imageSchema);
