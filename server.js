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
	const currSessionUser = req.session.username;
	res.render("index.ejs", {
		title: "Kingsman",
		headerh1: "KINGSMAN TAILOR",
		currUser: currSessionUser,
	});
});

// SESSIONS - LOGIN page
app.get("/sessions/login", (req, res) => {
	const error = req.session.error;
	delete req.session.error;
	const currSessionUser = req.session.username;
	res.render("sessions/login.ejs", {
		title: "Kingsman",
		headerh1: "KINGSMAN TAILOR",
		error: error,
		currUser: currSessionUser,
	});
});

// SESSIONS - LOGIN page
app.post("/sessions/login", async (req, res) => {
	const currSessionUser = req.session.username;
	try {
		const error = req.session.error;
		delete req.session.error;
		const { username, password } = req.body;
		let user = await UserModel.findOne({ username });
		if (!user) {
			req.session.error = "Invalid Credentials";
			return res.redirect("/sessions/login");
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			req.session.error = "Invalid Credentials";
			return res.redirect("sessions/login.ejs", {
				title: "Kingsman",
				headerh1: "KINGSMAN TAILOR",
				error: error,
				currUser: currSessionUser,
			});
		}

		req.session.isAuth = true;
		req.session.username = user.username;
		res.redirect("/room");
	} catch (error) {
		console.log(error);
	}
});

// ROOM page
app.get("/room", isAuth, async (req, res) => {
	const currSessionUser = req.session.username;
	const allDB = await UserModel.find({});
	res.render("room/index.ejs", {
		title: "Kingsman: The Secret Service",
		headerh1: "MANNERS. MAKETH. MAN.",
		currUser: currSessionUser,
		users: allDB,
	});
});

app.post("/room", async (req, res) => {
	const newMsg = req.body.messages;
	const username = req.session.username;

	await UserModel.findOneAndUpdate(
		{ username },
		{
			$push: {
				messages: newMsg,
			},
		}
	);
	res.redirect("/room");
});

// USERS : NEW USER page
app.get("/users/new", (req, res) => {
	const error = req.session.error;
	delete req.session.error;
	const currSessionUser = req.session.username;
	res.render("users/new.ejs", {
		title: "Kingsman: The Secret Service",
		headerh1: "MANNERS. MAKETH. MAN.",
		error: error,
		currUser: currSessionUser,
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

// SEED ROUTE
// NOTE: Do NOT run this route until AFTER you have a create user route up and running, as well as encryption working!
const seed = require("./models/seed.js");

app.get("/seedAgents", async (req, res) => {
	try {
		const newData = seed.forEach(async (user) => {
			const { username, password, messages } = user;
			const hashPW = await bcrypt.hash(password, 12);
			const newUser = await UserModel.create({
				username,
				password: hashPW,
				messages,
			});
		});
		res.redirect("/");
	} catch (error) {
		console.log(error);
	}
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
