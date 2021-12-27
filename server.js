require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const connectDB = require("./db/connectDB");
const UserModel = require("./models/User");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// ===================================//
// ________ SESSIONS ___________//

// Session collection data storing
const store = new MongoDBSession({
	uri: process.env.MONGO_URI,
	collection: "session",
});

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

// ===================================//
// ________ ROUTES : PAGES ___________//
const isAuth = require("./middlewares/isAuth");

// MAIN Landing page
app.get("/", (req, res) => {
	// req.session.isAuth = true;
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
	const error = req.session.error;
	delete req.session.error;
	res.render("users/new.ejs", {
		title: "Kingsman: The Secret Service",
		headerh1: "MANNERS. MAKETH. MAN.",
		error: error,
	});
});

// USERS : NEW USER >> POST
app.post("/users/new", async (req, res) => {
	const error = req.session.error;
	delete req.session.error;

	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 12);
		let user = await UserModel.findOne({ username });
		if (user) {
			req.session.error = "username exist please login";
			res.redirect("/users/new");
		} else {
			user = new UserModel({ username, password: hashedPassword });
			await user.save();
			console.log(`OK! User created: ${username}`);
			res.redirect("/");
		}
	} catch (error) {
		console.log(error);
	}
});

// LOGOUT
app.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) throw err;
		res.redirect("/");
	});
});

// SEED : NEW USER >> POST
const seed = require("./models/seed.js");

app.get("/seedAgents", async (req, res) => {
	const error = req.session.error;
	delete req.session.error;

	// encrypts the given seed passwords
	seed.forEach(async (user) => {
		user.password = await bcrypt.hash(user.password, 10);
		// seed data
		await User.findOneAndUpdate({ name: user.name }, user, { upsert: true });
	});
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
