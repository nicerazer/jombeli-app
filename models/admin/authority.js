var mongoose = require("mongoose");
// DATABASE SETUP

/*
AUTHORITY LIST
1. MASTER ADMIN
2. ADMIN
3. EDITOR
*/
var authoritySchema = new mongoose.Schema({
	type	: String
});

module.exports = mongoose.model("Authority", authoritySchema);
