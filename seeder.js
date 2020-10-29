const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const bootcamp = require('./models/Bootcamp');
const course = require('./models/Course');
const user = require('./models/User');
const review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// Read json files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);

const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`)
);

// Import all data into DB
const importData = async () => {
	try {
		await bootcamp.create(bootcamps);
		await course.create(courses);
		await user.create(users);
		await review.create(reviews);
		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

// Delete all data from DB
const deleteData = async () => {
	try {
		await bootcamp.deleteMany();
		await course.deleteMany();
		await user.deleteMany();
		await review.deleteMany();
		console.log('Data Deleted...'.red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] == '-d') {
	deleteData();
}
