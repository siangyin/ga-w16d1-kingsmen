require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const connectDB = require("./db/connectDB");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// ===================================//
// ________ ROUTES : PAGES ___________//

// MAIN Landing page
app.get("/", (req, res) => {
	res.render("index.ejs", { title: "KINGSMAN TAILOR" });
});

// ROOM page
app.get("/room", (req, res) => {
	res.render("room/index.ejs", { title: "MANNERS. MAKETH. MAN." });
});

// ===========================//

const start = async () => {
	try {
		await connectDB(MONGO_URI);
		app.listen(PORT, () =>
			console.log(`DB connected & Server on: http://localhost:${PORT}`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
