var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username	: String,
	email			: String,
	password	: String,
	user_fName: String,
	user_lName: String,
	gender		: String,
	phone			: Number,
	birthday	:	{type: Date},
	shipping_addresses	:	[
		{
			name	: String,
			isMain: Boolean,
			line1	: String,
			line2	: String,
			line3	: String,
			postcode	: Number,
			state			: String
		}
	],
	reviews		: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}]
});

module.exports = mongoose.model("User", userSchema);