const isAuth = (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		req.session.error = "Access/ Request denied";
		res.redirect("/sessions/login");
	}
};

module.exports = isAuth;
