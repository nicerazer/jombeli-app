var 
express   	= require("express"),
mongoose		= require("mongoose"),
bodyParser  = require("body-parser"),
// multer			= require("multer"),
cloudinary	= require("cloudinary"),
seedDB			= require("./seeds.js"),
methodOverride = require("method-override"),

passport							= require("passport"),
LocalStrategy 				= require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose");


var	// MODELS VARIABLE
Admin			= require("./models/admin/admin.js"),
Authority = require("./models/admin/authority.js"),
Product		= require("./models/product/product.js"),
Category	= require("./models/product/category.js"),
Feedback	= require("./models/product/feedback.js"),
User			= require("./models/user/user.js");

var dashboardRoutes = require("./routes/superuser/dashboard.js");

var url = process.env.DATABASEURL || "mongodb://localhost/jombeli";

mongoose.connect(url);

seedDB();


/////////
// API //
/////////

// CLOUDINARY CONFIG

cloudinary.config({ 
  cloud_name: 'nicerazer', 
  api_key: '952887559615254', 
  api_secret: 'khNzikmGFNT3-yGWaS77Xhu1Ow4' 
});



var	app = express();

app.use(require("express-session")({
	secret: "awesome app this is WOWH",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(bodyParser.urlencoded({extended:"true"}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.redirect("/home");
});

app.get("/home", function(req, res){
	res.render("webpage/index");
});

app.get("/category", function(req, res){
	res.render("webpage/categories");
});

app.get("/explore/:category/:id/more", function(req, res){
	Product.findById(req.params.id, function(err, foundProduct){
		if (err){
			console.log(err);
		} else {
			res.render("webpage/show", {product:foundProduct, category:req.params.category});
		}
	});
});

// Search products...
app.get("/explore/:category/:product", function(req, res){
	var
		category	= req.params.category,
		product		= req.params.product,
		found			= false,
		foundIND;

	Category.find({}, function(err, categories){
		if (err){
			console.log(err);
		} else {
			categories.forEach(function(element, ind){
				if(element.name.toUpperCase() == category.toUpperCase()){
					foundIND = ind;
					found = true;
					console.log("Found match category");
				}
			});
			if (found){
				Product.find({category: category}, function(err, products){
					if(err){
						console.log(err);
					} else {
						// console.log(products);
						console.log("Searched through category");
						// Render Show Template and pass categorized products
						res.render("webpage/description", {products:products, category:categories[foundIND]});
						// res.render("description");
					}
				});
			} else {
				Product.find({}, function(err, products){
					if(err){
						console.log(err);
					} else {
						console.log("Not searched through category");
						res.render("webpage/description", {products:products, category:category});
					}
				});
			}
		}
	});			
});

app.use(dashboardRoutes);

app.get("*", function(req, res){
	// RENDER NOT FOUND PAGE
	res.redirect("/home");
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
	console.log("Serving...");
});