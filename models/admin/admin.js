var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = new mongoose.Schema({
	username	: String,
	email		: String,
	password	: String,
	phone		: [Number],
	// authority	: {type: mongoose.Schema.Types.ObjectId, ref: "Authority"}
	authority	: String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);