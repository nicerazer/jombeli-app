var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	title		 : String,
	category	 : String,
	price		 : Number,
	description	 : String,
	rating		 : Number,
	isActive	 : Boolean,
	discounts	 : Number,
	
	brand		 : String,
	model		 : String,
	manufacturer : String,
	madein		 : String,
	webRef		 : [{url:String}],
	imgUrl		 : [{url:String}],
	created		 : {type:Date, default: Date.now},
	updated		 : {type:Date, default: Date.now},
	specs		 :
		{
			size		: Number,
			material	: String,
			weight		: Number,
		},
	details : {
		SKU : String,
		VID : String,
	},
	approved : Boolean,
	reviews	 :[{type : mongoose.Schema.Types.ObjectId, ref : "Review"}]
});

module.exports = mongoose.model("Product", productSchema);
