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
	res.render("index.ejs", {
		title: "Kingsman",
		headerh1: "KINGSMAN TAILOR",
	});
});

// SESSIONS - LOGIN page
app.get("/sessions/login", (req, res) => {
	res.render("sessions/login.ejs", {
		title: "Kingsman",
		headerh1: "KINGSMAN TAILOR",
	});
});

// ROOM page
app.get("/room", (req, res) => {
	res.render("room/index.ejs", {
		title: "Kingsman: The Secret Service",
		headerh1: "MANNERS. MAKETH. MAN.",
	});
});

// USERS : NEW USER page
app.get("/users/new", (req, res) => {
	res.render("users/new.ejs", {
		title: "Kingsman: The Secret Service",
		headerh1: "MANNERS. MAKETH. MAN.",
	});
});

// USERS : NEW USER >> POST
app.post("/users/new", async (req, res) => {
	const { username, password } = req.body;

	// let user = await UserModel.findOne({  });

	// if (user) {
	// 	return res.redirect("/register");
	// }

	const hashedPassword = await bcrypt.hash(password, 12);
	// user = new UserModel({ username, password: hashedPassword });
	// await user.save();
	let user = { username, password: hashedPassword };
	console.log(`User created: ${username} and ${hashedPassword}`);
	res.redirect("/");
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
