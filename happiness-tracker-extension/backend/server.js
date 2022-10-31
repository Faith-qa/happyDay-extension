const path = require('path');
const csv = require('@fast-csv/parse')
const express = require('express');
const app = express();
const cors = require('cors');
const colors = require('colors');
const nodeMailer = require('nodemailer');
//const upload = require('./utils/upload')
const uuid = require('uuid');
const { errorHandler } = require('./middleware/errorMiddleware');
const { connectDB } = require('./config/db');
const User = require('./model/userModel');
const Quote = require('./model/quoteModel');
const Bible = require('./model/bibleModel')
const Question = require('./model/questionModel')
const bcrypt = require('bcryptjs/dist/bcrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
   cors: {
       origin: '*',
   },
});
const bodyParser = require('body-parser');
 
const dotenv = require('dotenv').config()
//console.log(process.env)
console.log("HELLO" , process.env.MONGO_URI)
 
connectDB();
 
const port = process.env.PORT || 5000;
 
const endpointSecret = 'whsec_1Y1ClU94oe4BXoE6Mk2kIyiYktLWzxX4';
 
//const {S3Client} = require('@aws-sdk/client-s3');
const multer = require('multer');
const multers3 = require('multer-s3-v2');
const aws = require('aws-sdk');
const quoteModel = require('./model/quoteModel');
 
const s3 = new aws.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   region: process.env.S3_BUCKET_REGION
});
 
const upload = multer({
   storage: multers3({
       s3:s3,
       bucket: process.env.S3_BUCKET_NAME,
       metadata: function(req, file, cb) {
           cb(null, {fieldName: 'Meta_Data'});
       },
       key: function(req, file, cb) {
           cb(null, file.originalname)
       }
 
   })
}).single('file')
 
 
 


//const endpointSecret = 'whsec_1Y1ClU94oe4BXoE6Mk2kIyiYktLWzxX4';
//const endpointSecret = 'whsec_fLBsGkZqZTCcFIWSugyDLnkL14e7Gr0w';

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.use((req, res, next) => {
	if (req.originalUrl === '/webhook') {
		next();
	} else {
		express.json()(req, res, next);
	}
});

app.use(cors());
// app.use('/payment-made', express.raw({ type: '*/*' }));

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/plans', require('./routes/planRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/quotes', require('./routes/quoteRoutes'));
app.use('/api/v1/bible', require('./routes/bibleRoutes'));
app.use('/api/v1/questions', require('./routes/questionRoutes'));
app.use('/api/v1/images', require('./routes/imageRoutes'));

io.on('connection', (socket) => {
	console.log(socket.id);
});

//uploading quotes csv
app.post('/api/v1/quotes/csv', cors(), async(req, res) => {
	console.log(req)
	try {
		await upload(req, res, async(err)=> {
			if (err){
				console.log(err);
				return
			}
  
			console.log(req.file);
			params = {
				Bucket: req.file.bucket,
				Key: req.file.key,
			}
			const csvFile = s3.getObject(params).createReadStream()
			const parserFcn = new Promise((resolve, reject)=> {
				const parser = csv
					.parseStream(csvFile, {headers: true})
					.on("data", async function(data){
						console.log(" data parsed:", data);
						var obj = {date: new Date(data.date), text: data.text, author: req.query.author}
						const quoteObj = await Quote.findOneAndUpdate({date: obj.date}, obj, {upsert: true, new: true})
						console.log(quoteObj)
					})
					.on("end", function(){
						resolve("csv parse process finished")
					})
					.on("error", function(){
						reject("csv parse process failed")
					})
  
			})
			try{
				await parserFcn;
				res.status(200).send()
  
			}catch(error){console.log("get Error: ", error)}
  
			})
		   
	}catch(err){
		res.status(400).json({
			status: 'fail',
			message: err.message
		})
  
	}
 })
  
 //bible csv
 app.post('/api/v1/bible/csv', cors(), async(req, res) => {
	console.log(req)
	try {
		await upload(req, res, async(err)=> {
			if (err){
				console.log(err);
				return
			}
  
			console.log(req.file);
			params = {
				Bucket: req.file.bucket,
				Key: req.file.key,
			}
			const csvFile = s3.getObject(params).createReadStream()
			const parserFcn = new Promise((resolve, reject)=> {
				const parser = csv
					.parseStream(csvFile, {headers: true})
					.on("data", async function(data){
						console.log(" data parsed:", data);
						var obj = {date: new Date(data.date), text: data.text, bibleBook: data.bibleBook, chapter: data.chapter, verse: data.verse}
						const bibleObj = await Bible.findOneAndUpdate({date: obj.date}, obj, {upsert: true, new: true})
						console.log(bibleObj)
					})
					.on("end", function(){
						resolve("csv parse process finished")
					})
					.on("error", function(){
						reject("csv parse process failed")
					})
  
			})
			try{
				await parserFcn;
				res.status(200).send()
  
			}catch(error){console.log("get Error: ", error)}
  
			})
		   
	}catch(err){
		res.status(400).json({
			status: 'fail',
			message: err.message
		})
  
	}
 })
 
// checking if email already used
app.post('/check-account', cors(), async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		res.set('Access-Control-Allow-Origin', '*');
		res.status(200).json({ message: 'exists' });
	} else {
		res.set('Access-Control-Allow-Origin', '*');
		res.status(200).json({ message: 'does not exist' });
	}
});
//total number oF users 
app.post('/countusers', cors(), async (req, res) => {
	const { year} = req.body;
	var tUsers = []
	const total = await User.find().count();
	console.log(total);

	for(let i = 1; i < 13; i++) {
		const numusers = await User.find({$expr: {$and: [{$eq: [{$year: "$createdAt"}, year]}, {$eq: [{$month: "$createdAt"}, i]}]}}).count();
		console.log(numusers);
		console.log("i'm here");
		tUsers.push(numusers);
		
	};
	//console.log(tUsers);
	//const numUsers = await User.find({$expr: {$eq: [{$year: "$createdAt"}, year]}}).count();
	return res.status(200).json(tUsers)
});

// sending "Recover Password" email
app.post('/reset-password/:email', cors(), async (req, res) => {
	const transporter = nodeMailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS,
		},
	});

	const user = await User.findOne({ email: req.params.email });

	if (!user) {
		res.json({
			message:
				'Please create an account. Your email is not registered with us.',
		});
	}

	const token = uuid.v4();

	const updatedUser = await User.findByIdAndUpdate(user._id, {
		token: token,
	});

	const info = transporter.sendMail({
		from: 'dremukare@gmail.com',
		to: req.params.email,
		subject: 'Reset your password 🔒',
		html: `<div><h2>Hi ${req.params.email}</h2><p>Click on the link below to create a new password:</p><a href='http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com//reset.html?email=${req.params.email}&token=${token}'>Create a new password</a></div>`,
	});

	console.log('Sent successfully: ' + info.messageId);
	res.json({ message: 'Check your email to reset your password' });
});

// reset password
app.post('/change-password', cors(), async (req, res) => {
	const { email, password, token } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		res.status(400).json({ message: 'User does not exist' });
	} else {
		if (user.token === token) {
			res.status(400).json({ message: 'Invalid!' });
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const changed = await User.findByIdAndUpdate(
				user._id,
				{
					password: password,
				},
				{ new: true }
			);

			res.status(201).json({
				message: 'Successfully changed password',
			});
		}
	}
});

app.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	
	async (req, res) => {
		let event = req.body;
		console.log('Event: ' + req);

		// Only verify the event if you have an endpoint secret defined.
		// Otherwise use the basic event deserialized with JSON.parse
		if (endpointSecret) {
			console.log("I made it here");
			// Get the signature sent by Stripe
			const signature = req.headers['stripe-signature'];
			console.log("signature: "+ event);
			try {
				event = stripe.webhooks.constructEvent(
					req.body,
					signature,
					endpointSecret
				);
			} catch (err) {
				console.log(`⚠️  Webhook signature verification failed.`, err.message);
				return res.sendStatus(400);
			}
		}

		switch (event.type) {
			case 'invoice.paid':
				console.log('++++++++++++++++++++++++++++++++++');
				const subscription = await stripe.subscriptions.retrieve(
					event.data.object.subscription
				);
				console.log(`Sub status: ${subscription.status}`);
				if (
					event.data.object.status === 'paid' &&
					subscription.status === 'active'
				) {
					const email = event.data.object.customer_email;

					const user = await User.findOne({ email });
					const addedCustomerId = await User.findByIdAndUpdate(user.id, {
						stripeCustomerId: event.data.object.customer,
					});
					io.emit('transaction-end', 'success');
				} else {
					console.log('something went wrong');
				}
				console.log('=============================');
				break;
			case 'invoice.payment_succeeded':
				console.log('invoice payment succeeded!');
				break;
			case 'payment_intent.succeeded':
				console.log('Payment intent succeeded!');
				break;
			default:
				console.log(`Unhandled event type: ${event.type}`);
				console.log('=============================');
		}

		res.send();
	}
);

// handling card payments
app.post('/stripe/create-sub', cors(), async (req, res) => {
	const plans = {
		'$0.99': 'price_1Kp6pnDk6SusXP09CW5NOP2R',
		'$3.99': 'price_1Kp6qVDk6SusXP09GqZcspOI',
		'$9.99': 'price_1Kp6rNDk6SusXP09BbnihPkS',
		'$11.88': 'price_1Kp6rxDk6SusXP09JZrrb23U',
		'$47.88': 'price_1Kp6sSDk6SusXP092ZWlA9xq',
		'$119.88': 'price_1Kp6t0Dk6SusXP09tKi6XB7b',
	};

	const { name, email, subscriptionAmount } = req.body;

	const session = await stripe.checkout.sessions.create({
		line_items: [{ price: plans[subscriptionAmount], quantity: 1 }],
		mode: 'subscription',
		customer_email: email,
		success_url:
			'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/success.html',
		cancel_url:
			'cancelled.html',
		payment_method_types: ['card'],
	});

	res.status(200).json({ url: session.url, sesh: session });
});

// create stripe customer
app.post('/stripe/create-customer', cors(), async (req, res) => {
	const { email, name } = req.body;

	const customer = await stripe.customers.create({
		email,
		name,
	});

	// const user = await User.findOne({ email });
	// const addedCustomerId = await User.findByIdAndUpdate(user.id, {
	// 	stripeCustomerId: customer.id.toString(),
	// });

	res.status(200).json({ customer });
});

// creating stripe subscription html implementation

app.post('/stripe/create-sub-html', cors(), async (req, res) => {
	const { customerId, price } = req.body;
	const plans = {
		'$0.99': 'price_1Kp6pnDk6SusXP09CW5NOP2R',
		'$3.99': 'price_1Kp6qVDk6SusXP09GqZcspOI',
		'$9.99': 'price_1Kp6rNDk6SusXP09BbnihPkS',
		'$11.88': 'price_1Kp6rxDk6SusXP09JZrrb23U',
		'$47.88': 'price_1Kp6sSDk6SusXP092ZWlA9xq',
		'$119.88': 'price_1Kp6t0Dk6SusXP09tKi6XB7b',
	};
	try {
		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: plans[price] }],
			payment_behavior: 'default_incomplete',
			payment_settings: { save_default_payment_method: 'on_subscription' },
			expand: ['latest_invoice.payment_intent'],
		});

		res.status(200).json({ subscription });
	} catch (err) {
		console.log(err);
		res.status(400).json({ err });
	}
});

// end of html stuff

// creating subscription
app.post('/sub', cors(), async (req, res) => {
	const { email, payment_method, amount } = req.body;

	const user = await User.findOne({ email });

	console.log(user);

	// creating a new customer
	const customer = await stripe.customers.create({
		payment_method: payment_method,
		email: email,
		invoice_settings: {
			default_payment_method: payment_method,
		},
	});

	const addedCustomerId = await User.findByIdAndUpdate(user.id, {
		stripeCustomerId: customer.id.toString(),
	});

	console.log(addedCustomerId);

	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ plan: plans[amount] }],
		expand: ['latest_invoice.payment_intent'],
	});

	const status = subscription['latest_invoice']['payment_intent']['status'];
	const client_secret =
		subscription['latest_invoice']['payment_intent']['client_secret'];

	res.json({ client_secret: client_secret, status: status });
});

// get user subscriptions from stripe based on month
app.get('/subscribed/:email/:month', cors(), async (req, res) => {
	const user = await User.findOne({ email: req.params.email });
	// const currentUserMonth = req.params.month;
	console.log(req.body);

	console.log(user);

	let stripeCustomerId;

	if (!user) {
		res.status(400).json({ message: 'Something went wrong' });
	} else {
		stripeCustomerId = user.stripeCustomerId;
	}

	if (!stripeCustomerId) {
		res.status(200).json({ message: 'Making a subscription for you' });
	} else {
		const customer = await stripe.customers.retrieve(stripeCustomerId, {
			expand: ['subscriptions'],
		});
		if (customer.subscriptions.total_count < 1) {
			res.status(200).json({ message: 'false' });
		} else {
			res.status(200).json({ message: 'true' });
		}
	}
});

app.get('/numberofsubs', cors(), async (req, res) => {
	
	const subsc = await stripe.subscriptions.list({status: "canceled"});
	console.log(subsc)
	const subs = subsc.data;
	console.log(subs.length);
	const createdAtArray = subs.map(sub => (new Date(sub.created * 1000).getMonth() + 1));

	console.log(createdAtArray);



	
	//console.log(li)
	//console.log(subs[0])
	res.status(200).json(createdAtArray)
	
});

// find all subscriptions belonging to specific user
app.get('/subscriptions/:email', cors(), async (req, res) => {
	const user = await User.findOne({ email: req.params.email });

	const subscriptions = await stripe.subscriptions.list({
		customer: user?.stripeCustomerId,
		status: 'all',
	});

	res.status(200).json(subscriptions);
});

// change user card
app.post('/changecard/:email', cors(), async (req, res) => {
	const user = await User.findOne({ email: req.params.email });
	console.log(req.body);

	// await stripe.customers.update(user.stripeCustomerId, { source });
	const paymentMethod = await stripe.paymentMethods.attach(
		req.body.paymentMethod.id,
		{ customer: user?.stripeCustomerId }
	);

	const customer = await stripe.customers.update(user.stripeCustomerId, {
		invoice_settings: { default_payment_method: req.body.paymentMethod.id },
	});

	res.status(200).json({ paymentMethod, customer });
});

// Serving the frontend
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/build')));

	app.get('*', (req, res) => {
		res.sendFile(
			path.resolve(__dirname, '../', 'frontend', 'build', 'index.html ')
		);
	});
} else {
	app.get('/', (req, res) => {
		res.send('Please set to production mode');
	});
}

app.use(errorHandler);

server.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});