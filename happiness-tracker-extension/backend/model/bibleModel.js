const mongoose = require('mongoose');

const bibleSchema = mongoose.Schema(
	{
		date: { type: Date, unique: true },
		text: String,
		bibleBook: String,
		verse: Number,
		chapter: Number,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('bible', bibleSchema);
