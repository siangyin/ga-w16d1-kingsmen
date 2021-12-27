const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, "Please provide name between 3 - 50 characters"],
		maxlength: 50,
		minlength: 3,
	},
	password: {
		type: String,
		required: [true, "Please provide password min 6 characters"],
		minlength: 6,
	},
	message: {
		type: [String],
	},
});

module.exports = mongoose.model("User", UserSchema);
