const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectBD = require('./config/db');
//const logger = require('./middleware/logger');
const error = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env variables
dotenv.config({ path: './config/config.env' });
connectBD();

// Route files
const bootcamps = require('./router/bootcamps');
const courses = require('./router/courses');
const auth = require('./router/auth');
const users = require('./router/users');
const reviews = require('./router/reviews');

const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');

const app = express();
//app.use(logger);

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File Uploader
app.use(fileUpload());

// Sanitize data - Security Module -
app.use(mongoSanitize());

// Set security headers - Security Module -
app.use(helmet());

// Prevent XSS(cross side scripting) attacks - Security Module -
app.use(xss());

// Rate limiting - Number of allowed requests -, Security Module
const limiter = rateLimit({
	windowMs: 1000 * 60 * 10, // 10 mins
	max: 100, // 100 request allowed in 10 mins
});
app.use(limiter);

// Prevent http param pollution HPP - Security Module -
app.use(hpp());

// Enable CORS - to make the api responsing reqs form other domains/servers -
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);

// Handle unhandled promise rejection of the db
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.bold);

	//Close server & exit process
	server.close(() => process.exit(1));
});
