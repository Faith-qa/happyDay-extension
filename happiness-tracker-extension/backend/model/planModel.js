const mongoose = require('mongoose');

// set user required back to true
const planSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: 'users',
		},
		date: { type: Date, unique: true, sparse: true },
		excitedAbout: String,
		gratefulForMorning: String,
		mainThreeTodo: [{ text: String, checked: Boolean }],
		dailyToDo: [{ text: String, checked: Boolean }],
		meals: {
			breakfast: [{ meal: String, calories: String }],
			lunch: [{ meal: String, calories: String }],
			dinner: [{ meal: String, calories: String }],
		},
		water: Number,
		exercise: Boolean,
		meditation: Boolean,
		relaxation: Boolean,
		happyScale: Number,
		happyMoment: String,
		gratefulForTonight: String,
		dailyQuestion: {
			question: String,
			answer: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('plans', planSchema);
