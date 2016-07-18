'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function ClickHandler () {

	this.getAllPolls = function (req, res) {
		Polls
			.find()
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.newPoll = function (req, res) {
		var form = req.body

		var newPoll = new Polls();

		newPoll.name = form.pollq;
		newPoll.by = req.user.github.username;
		newPoll.options = [{'_id': new ObjectId(), 'option' : form.option1, 'votes' : 0},{'_id': new ObjectId(), 'option' : form.option2, 'votes' : 0}]

		newPoll.save(function (err) {
			if (err) {
				throw err;
			}
		});

		/*Polls
			.save(
				{
		      name: form.pollq,
		      by: req.user.github.username,
		      options: [
		        {
		          optionid : form.option1,
		          votes : 0
		        },
		        {
		          optionid : form.option2,
		          votes : 0
		        }
		      ]
		    }
		  )
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});*/
	};

	this.addVote = function (req, res) {
		Polls
			.findOneAndUpdate({ '_id': req.params.id, 'options._id': ObjectId(req.params.option) }, { $inc: { 'options.$.votes': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }
					res.json(result);
				}
			);
	};

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'github.nbrClicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.getPolls = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'github.nbrClicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.getAll = function (req, res) {
		Users
			.find()
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

}

module.exports = ClickHandler;



/*
{ $push: { 'github.polls' :
					{
			      name: 'pollname',
			      options: [
			        {
			          optionid : 'option1',
			          votes : 2
			        },
			        {
			          optionid : 'option2',
			          votes : 1
			        }
			      ]
			    }
				}})
*/