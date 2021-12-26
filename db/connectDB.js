const mongoose = require("mongoose");

const connectDB = (url) => {
	// console.log(`connected DB`);
	return mongoose.connect(url, {});
};

module.exports = connectDB;

// NOT SUPPORTED
// useNewUrlParser: true,
// useCreateIndex: true,
// useFindAndModify: false,
// useUnifiedTopology: true,
