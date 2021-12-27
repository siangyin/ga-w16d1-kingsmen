const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		type: String,
		required: true,
	},
	messages: {
		type: [String],
	},
});

module.exports = mongoose.model("User", UserSchema);
