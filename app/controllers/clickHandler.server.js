'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function ClickHandler () {

	this.getPoll = function (req, res) {
		Polls
			.findOne({ '_id': ObjectId(req.params.id)})
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.getAllPolls = function (req, res) {
		Polls
			.find()
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.getUserPolls = function (req, res) {
		Polls
			.find({ 'by': req.user.github.username })
			.exec(function (err, result) {
					if (err) { throw err; }
					res.json(result);
				}
			);
	};

	this.newPoll = function (req, res) {
		var form = req.body
		var newPoll = new Polls();

		newPoll.name = form.question.pollq;
		newPoll.by = req.user.github.username;
		newPoll.options = form.options;

		newPoll.save(function (err) {
			if (err) {
				throw err;
			}
		});
	};

	this.editPoll = function (req, res) {
		var form = req.body
		Polls
			.findOneAndUpdate({
				'_id': ObjectId(req.params.id)},
				{
					'name': form.question,
					'by': req.user.github.username,
					'options': form.options
				})
			.exec(function (err, result) {
					if (err) { throw err; }
					res.json(result);
				}
			);


	};

	this.deletePoll = function (req, res) {
		Polls
			.findOneAndRemove({ '_id': ObjectId(req.params.id), 'by': req.user.github.username })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};	

	this.addVote = function (req, res) {
		Polls
			.findOneAndUpdate({ '_id': ObjectId(req.params.id),'options.id':parseInt(req.params.option)}, { $inc: { 'options.$.votes': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }
					res.json(result);
				}
			);
	};
};

module.exports = ClickHandler;
