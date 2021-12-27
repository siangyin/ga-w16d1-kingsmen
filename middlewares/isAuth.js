const isAuth = (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		req.session.error = "Access/ Request denied. Please login";
		res.redirect("/sessions/login");
	}
};

module.exports = isAuth;
