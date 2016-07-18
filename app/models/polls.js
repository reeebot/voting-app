'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	name: String,
	by: String,
	options: Array
});

module.exports = mongoose.model('Poll', Poll);
