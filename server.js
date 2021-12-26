const express = require("express");
const app = express();

const connectDB = require("./db/connectDB");

const PORT = process.env.PORT || 3000;
const COLLECTION = process.env.COLLECTION;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_URL = `${MONGO_URI}/${COLLECTION}?retryWrites=true&w=majority`;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () =>
			console.log(`DB connected & Server on: http://localhost:${PORT}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
