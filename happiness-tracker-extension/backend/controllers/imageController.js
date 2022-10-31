const asyncHandler = require('express-async-handler');
const Image = require('../model/imageModel');
 const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require("multer-s3-v2");
const { magenta } = require('colors');
const { RolesAnywhere, Imagebuilder } = require('aws-sdk');
const {filterImageUrl, deleteLocalFiles} = require('../utils/utils');
const { findOneAndUpdate } = require('../model/imageModel');

// @desc Get image link for the day
// @route GET /api/v1/image/:date
// @access Private

const s3 = new aws.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.S3_BUCKET_REGION,
});

const imageUpload = async(base64) => {
	const s3_buc = s3;
	const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
	const type = base64.split(';')[0].split('/')[1];
	const userId = new Date()
	const params = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `image-${userId}.${type}`,
			Body: base64Data,
			ACL: 'public-read',
			contentEncoding: 'base64',
			contentType: `image/${type}`
	}

	try {
		const upload = await s3_buc.upload(params).promise();
		console.log(upload)
		const location = upload.Location
		console.log(location)
		return location
	} catch(err){console.log(err)}

}
const getImage = asyncHandler(async (req, res) => {
	const image = await Image.findOne({ date: req.params.date });
	console.log(image);

	if (!image) {
		res.status(404).json({
			success: false,
			message: 'Image not found',
		});
	}

	res.status(200).json(image);
});


// @desc Set image link for the day
// @route POST /api/v1/image
// @access Private
const setImage = asyncHandler(async (req, res) => {
	console.log(req.body)
	const Imageurl = imageUpload(req.body.imageUpload)
	
	const updates = {
		date: req.body.date,
		image: Imageurl
	};

	const newImage = await Image.findOneAndUpdate({date: req.body.date}, updates, {upsert: true, new: true})

	return res.status(200).json(newImage)
	
	
 
});
		//await Image.create({photoUrl: req.file.location})
		//res.status(200).json(imageurl);

	

	// const exists = await Image.findOne({ date: req.body.date });

	// const image = exists
	// 	? await Image.findByIdAndUpdate(exists._id, req.body, { new: true })
	// 	: await new Image(req.body).save();

	// res.status(200).json(image);


// @desc Delete image link for the day
// @route DELETE /api/v1/image/:id
// @access Private
const deleteImage = asyncHandler(async (req, res) => {
	const image = await Image.findOne({ date: req.body.id });

	if (!image) {
		res.status(404).json({
			success: false,
			message: 'Image not found',
		});
	}

	await Image.findByIdAndDelete(req.body.id);

	res.status(200).json({
		success: true,
		message: 'Image deleted',
	});
});

module.exports = {
	getImage,
	setImage,
	deleteImage,
};
