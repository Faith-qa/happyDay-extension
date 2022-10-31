const asyncHandler = require('express-async-handler');
const Question = require('../model/questionModel');
const multer = require("multer");
const csv = require('csvtojson');
const fs = require('fs');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, './public/uploads')
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	},
  })
  

const uploadCsv = async(base64) => {
	const base64Data = new Buffer.from(base64, 'base64').toString('utf-8');

	// const type = base64.split(';')[0].split('/')[1]
	// console.log(type)
	const content = await fs.writeFileSync(`file-${new Date()}.csv`, base64Data)
	return (content)

}

// @desc Get todays question
// @route GET /api/v1/questions/:date
// @access Private
const getQuestion = asyncHandler(async (req, res) => {
	const question = await Question.findOne({ date: req.query.date });

	res.status(200).json(question);
});

// @desc Set todays questions
// @route POST /api/v1/questions
// @access Private
const setQuestion = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Add question');
	}
	console.log(req.body);

	const exists = await Question.findOne({ date: req.body.date });

	let update = req.body

	const question = await Question.findOneAndUpdate({date: req.body.date}, update, {upsert: true, new: true});
	console.log(question)

	res.status(200).json(question);
});

// @desc Edit todays questions
// @route PUT /api/v1/questions
// @access Private
const putQuestion = asyncHandler(async (req, res) => {
	if (!req.body) {
		res.status(400);

		throw new Error('Add question');
	}

	const exists = await Question.findOne({ date: req.body.date });

	const question = exists
		? await Question.findByIdAndUpdate(exists._id, req.body, { new: true })
		: await new Question(req.body).save();

	res.status(200).json(question);
});

// @desc Delete a question
// @route DELETE /api/v1/questions
// @access Private
const deleteQuestion = asyncHandler(async (req, res) => {
	const question = await Question.findByIdAndDelete(req.body.id);

	res.status(200).json({ message: `Deleted question ${req.body.id}` });
});

const massUpload = asyncHandler(async (req, res) => {
	console.log(req.body)

	const csvfile = uploadCsv(req.body.file);


	console.log(csvfile)
// 	upload(req, res, (err) => {
// 		if(err) {
// 		  res.status(400).send("Something went wrong!");
// 		}
// 		res.send(req.file);
// });

// 	csv()
// 	.fromFile(req.file)
// 	.then((jsonOb) => {
// 		var questions = [];
// 		for (var i = 0; i < jsonOb.length; i++){
// 			var obj = {};
// 			obj.date = jsonOb[i][new Date('date')];
// 			obj.text = jsonOb[i]['text'];
// 			questions.push(obj);
// 		}
// 		Question.insertMany(questions).then(function(){
// 			res.status(200).send({message: "upload successful"});

// 		}).catch(function(error){
// 			res.status(500).send({message: "failed", error});

// 		})
// 	}).catch((error)=> {console.log(error)});
		
})

module.exports = {
	massUpload,
	//getAllQuestions,
	getQuestion,
	putQuestion,
	setQuestion,
	deleteQuestion,
}
