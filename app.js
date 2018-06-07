var express   	= require("express"),
		mongoose		= require("mongoose"),
		bodyParser  = require("body-parser"),
		multer			= require("multer"),
		cloudinary	= require("cloudinary"),
		del					= require("del"),
		methodOverride = require("method-override"),
		seedDB			= require("./seeds.js"),
		
		
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

// MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

storage: multer.diskStorage({
//Setup where the user's file will go
destination: function(req, file, next){
 next(null, './public/temp-photo-storage');
 },
  
  //Then give the file a unique name
  filename: function(req, file, next){
      console.log(file);
      const ext = file.mimetype.split('/')[1];
      // next(null, file.fieldname + '-' + Date.now() + '.'+ext);
      next(null, file.fieldname + '-' + Date.now());
    }
  }),
  
  //A means of ensuring only images are uploaded. 
  fileFilter: function(req, file, next){
      if(!file){
        next();
      }
    const image = file.mimetype.startsWith('image/');
    if(image){
      console.log('Photo uploaded');
      next(null, true);
    } else {
      console.log("File not supported");
      
      //TODO:  A better message response to user on failure.
      return next();
    }
  }
};

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

// NEW SHOW
app.get("/dashboard/products/new", isLoggedIn, function(req, res){
	res.render("cms/products-new");
});

// NEW POST
app.post("/dashboard/products", isLoggedIn, multer(multerConfig).single('img-product'), function(req, res){
	var url;
  Product.create(req.body.product, function(err, newProduct){
  	if(err){
  		res.render("cms/products-new");
  	} else {
  		console.log("Uploaded the image into server");
  		cloudinary.v2.uploader.upload('./public/temp-photo-storage/'+req.file.filename, {public_id: "jombeli_app/products/" + req.file.filename}, function(err, result){
	    	if(err){
	    		console.log(err);
	    	} else {
		    	console.log("Uploaded image file into cloudinary");
	    		url = "https://res.cloudinary.com/nicerazer/image/upload/v1527577780/" + result.public_id + ".jpg";
					Product.findByIdAndUpdate(newProduct._id, {$push:{imgUrl: {url:url}}},function(err, updatedProduct){
						if (err){
							console.log(err);
						} else {
							console.log(updatedProduct);
							res.redirect("/dashboard/products");
						}
					});
					del(['./public/temp-photo-storage/*']).then(paths => {
			    	console.log('Deleted files and folders:\n', paths.join('\n'));
					});
				}
	    });
  	}
  });
});

//EDIT SHOW
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

// EDIT UPDATE
app.put("/dashboard/products", isLoggedIn, multer(multerConfig).single('img-product'), function(req, res){
	var url;
  Product.findByIdAndUpdate(req.body.product._id, req.body.product,function(err, updatedProduct){
  	if(err){
  		res.redirect("/dashboard/products" + req.body.product + "edit");
  	} else {
  		console.log("Uploaded the image into server");
  		cloudinary.v2.uploader.upload('./public/temp-photo-storage/'+req.file.filename, {public_id: "jombeli_app/products/" + req.file.filename}, function(err, result){
	    	if(err){
	    		console.log(err);
	    	} else {
		    	console.log("Uploaded image file into cloudinary");
	    		url = "https://res.cloudinary.com/nicerazer/image/upload/v1527577780/" + result.public_id + ".jpg";
					Product.findByIdAndUpdate(updatedProduct._id, {$push:{imgUrl: {url:url}}},function(err, updatedProductInner){
						if (err){
							console.log(err);
						} else {
							console.log(updatedProductInner);
							res.redirect("/dashboard/products");
						}
					});
					del(['./public/temp-photo-storage/*']).then(paths => {
			    	console.log('Deleted files and folders:\n', paths.join('\n'));
					});
				}
	    });
  	}
  });
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