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
	webRef		 : [{url:String, price:Number}],
	imgUrl		 : [{url:String}],
	// imgUrl		 : [String],
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
	// Write in words to represent the capabilty of the product; reason to make it special and over the other products
	advantage : String,
	approved : Boolean,
	reviews	 :[{type : mongoose.Schema.Types.ObjectId, ref : "Review"}]
});

module.exports = mongoose.model("Product", productSchema);