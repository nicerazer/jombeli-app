var mongoose = require("mongoose");
var categorySchema = new mongoose.Schema({
	name	    : String,
	description : String,
	imgUrl		: String,
	isTrend		: Boolean,
	isActive	: Boolean
});

module.exports = mongoose.model("Category", categorySchema);
