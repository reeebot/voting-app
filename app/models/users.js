'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		username: String,
		userpic: String,
		email: String
	}
});

module.exports = mongoose.model('User', User);
