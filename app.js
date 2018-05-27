var express   	= require("express"),
		mongoose		= require("mongoose"),
		bodyParser  = require("body-parser"),
		cloudinary	= require("cloudinary"),
		seedDB			= require("./seeds.js"),
		
		passport							= require("passport"),
		LocalStrategy 				= require("passport-local"),
		passportLocalMongoose = require("passport-local-mongoose");

seedDB();

var	// MODELS VARIABLE
Admin			= require("./models/admin/admin.js"),
Authority = require("./models/admin/authority.js"),
Product		= require("./models/product/product.js"),
Category	= require("./models/product/category.js"),
Feedback	= require("./models/product/feedback.js"),
User			= require("./models/user/user.js");

/*
AUTHORITY LIST
1. MASTER ADMIN
2. ADMIN
3. EDITOR
*/
// var authority_arr = [
// 	{type	: "MASTER"},
// 	{type	: "ADMIN"},
// 	{type	: "EDITOR"},
// ];

// authority_arr.forEach(function(seed){
// 	Authority.create(seed, function(err, createdAuthority){
// 		if(err){
// 			console.log(err);
// 		}	else {
// 			console.log(createdAuthority);
// 		}
// 	});
// });
// var MASTER_ID;
// Admin.create({
// 	username	: "IAMADMIN",
// 	email			: "someone@example.com",
// 	password	: "password",
// 	phone			: "",
// 	authority	: "MASTER"
// }, function(err, createdItem){
// 	if(err){
// 		console.log(err);
// 	}	else {
// 		console.log(createdItem);
// 	}
// });

// var category_arr = [
// 	{name	: "clothings"},
// 	{name	: "accessories"},
// 	{name	: "shoes"},
// 	{name	: "bags"},
// 	{name	: "sports"},
// 	{name	: "watches"},
// 	{name	: "groomings"},
// 	{name	: "electronics"},
// ];

// category_arr.forEach(function(seed){
// 	Category.create(seed, function(err, createdObj){
// 		if(err){
// 			console.log(err);
// 		}	else {
// 			console.log(createdObj);
// 		}
// 	});
// });


// var // ROUTES
// dashboard	= require("./routes/dashboard.js");

/////////
// API //
/////////

// CLOUDINARY

cloudinary.config({ 
  cloud_name: 'nicerazer', 
  api_key: '952887559615254', 
  api_secret: 'khNzikmGFNT3-yGWaS77Xhu1Ow4' 
});

mongoose.connect(process.env.DATABASEURL);
// mongodb://<dbuser>:<dbpassword>@ds237610.mlab.com:37610/jombeli-beta

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

app.get("/explore/:category/:product", function(req, res){
	var
		category	= req.params.category,
		found			= false;

	Category.find({}, function(err, categories){
		if (err){
			console.log(err);
		} else {
			for(var i=0; i < category.length; i++){
				if(category == categories[i])
					found = true;
			}
		}
	});
	
	if (found){
		Product.find({category: category}, function(err, products){
			if(err){
				console.log(err);
			} else {
				console.log(products);
				// Render Show Template and pass categorized products
				res.render("webpage/description", {products:products, category:category});
				// res.render("description");
			}
		});
	} else {
		Product.find({}, function(err, products){
			if(err){
				console.log(err);
			} else {
				console.log(products);
				res.render("webpage/description", {products:products, category:category});
			}
		});
	}
});

////////////////////////////////
//                            //
//   ADMIN DASHBOARD ROUTES   //
//                            //
////////////////////////////////

/////////////////////// AUTHENTICATIONS STARTS /////////////////////////

// REGISTER ROUTE

app.get("/dashboard/register", function(req, res){
	res.render("cms/register");
});

app.post("/dashboard/register", function(req, res){
	req.body.username;
	req.body.password;
	
	Admin.register(new Admin({username:req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('cms/register');
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/dashboard");
			});
		}
	});
});

// LOGIN ROUTE
app.get("/dashboard/login", function(req, res){
	res.render("cms/login");
});

app.post("/dashboard/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/dashboard/login"
}), function(req, res){
});

// LOGOUT ROUTE
app.get("/dashboard/logout", function(req, res){
	req.logout();
	res.redirect("/dashboard");
});

/////////////////////// AUTHENTICATIONS ENDS /////////////////////////

app.get("/dashboard", isLoggedIn, function(req, res){
	res.render("cms/index");
});


// PRODUCTS ROUTE

app.get("/dashboard/products", isLoggedIn, function(req, res){
  Product.find({}, function(err, products){
  	if(err){
  		console.log(err);
  	} else {
			res.render("cms/products", {products: products});
  	}
  });
});

app.get("/dashboard/products/new", isLoggedIn, function(req, res){
	res.render("cms/products-new");
});

app.post("/dashboard/products", isLoggedIn, function(req, res){
  Product.create(req.body.product, function(err, newProduct){
  	if(err){
  		res.render("cms/products-new");
  	} else {
			res.redirect("/dashboard/products");
  	}
  });
});

app.get("/dashboard/products/:id", isLoggedIn, function(req, res){
	Product.findById(req.params.id, function(err, foundProduct){
  	if(err){
  		console.log(err);
			res.redirect("/dashboard");
  	} else {
			res.render("cms/products-show", {product:foundProduct});
  	}
	});
});

app.get("/dashboard/products/:id/edit", isLoggedIn, function(req, res){
  Product.findById(req.params.id, function(err, foundProduct){
  	if(err){
  		console.log(err);
  		res.redirect("dashboard/products");
  	} else {
			res.render("cms/products-edit", {product:foundProduct});
  	}
  });
});

// ADDON ROUTES
app.get("/cloudinary_cors", function(req, res){
	res.render("../public/addons/cloudinary_js/html/cloudinary_cors.html");
});

app.get("*", function(req, res){
	// RENDER NOT FOUND PAGE
	res.redirect("/home");
});

// MIDDLEWARES
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/dashboard/login");
	}
}

app.listen(process.env.PORT, process.env.IP, function(req, res){
	console.log("Serving...");
});