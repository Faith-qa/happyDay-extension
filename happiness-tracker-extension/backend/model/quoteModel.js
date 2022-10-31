const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema(
	{
		date: { type: Date, unique: true },
		text: String,
		author: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('quotes', quoteSchema);
