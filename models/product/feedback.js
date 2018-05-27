var mongoose = require("mongoose");
var reviewSchema = new mongoose.Schema({
	title	: String,
	review	: String,
	rating	: String,
	posted	: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Review", reviewSchema);