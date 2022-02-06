var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var blogSchema = new mongoose.Schema({
	title:String,
    author:String,
	content:String,
	date: Date
});


module.exports = mongoose.model("Blog",blogSchema);