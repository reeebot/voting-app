'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	//app.route('/poll/:id')
	//	.get(function (req, res) {
	//		res.sendFile(path + '/public/poll.html');
	//	});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/user')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/api/polls')
		.get(isLoggedIn, clickHandler.getAllPolls)		//get all polls
		.post(isLoggedIn, clickHandler.newPoll);		//create new poll

	app.route('/api/userpolls')
		.get(isLoggedIn, clickHandler.getUserPolls)		//get current user's polls

	app.route('/api/polls/:id')
		.get(isLoggedIn, clickHandler.getPoll) 			//get single poll
		.post(isLoggedIn, clickHandler.editPoll)		//update poll
		.delete(isLoggedIn, clickHandler.deletePoll);	//delete poll

	app.route('/api/polls/vote/:id/:option')
		.post(isLoggedIn, clickHandler.addVote)			//upvote poll

	app.route('/*')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	/* app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		}); */


};
