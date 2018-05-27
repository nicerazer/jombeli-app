/* -----------------
CRUD!!!

1. VIEW PRODUCTS (SMALL LISTS)

2. CREATE PRODUCTS

3. UPDATE PRODUCTS

4. REMOVE PRODUCTS

----------------- */

var express = require("express"),
    io      = require("socket.io"),
    router  = express.Router();
    
router.get("dashboard/index", function(req, res){
    // Find statistics, then render the index page
    // ALOT of stuff could happen once, data migrating back and forth... Like realtime stuff!!! WOWW
    // io.on("connection", function(){
        
    // });
    
    res.render("cms/index");
});

router.get("dashboard/login", function(req, res){
    res.render("cms/login");
});

module.exports = router();