/* -----------------
CRUD!!!

1. VIEW PRODUCTS (SMALL LISTS)

2. CREATE PRODUCTS

3. UPDATE PRODUCTS

4. REMOVE PRODUCTS

----------------- */

var express = require("express"),
    multer  = require("multer"),
    passport= require("passport"),
	del		= require("del"),
    cloudinary = require("cloudinary"),
    router  = express.Router();

// Dependencies
var
Admin	= require("../../models/admin/admin.js"),
Product	= require("../../models/product/product.js");

// CLOUDINARY CONFIG
cloudinary.config({ 
  cloud_name: 'nicerazer', 
  api_key: '952887559615254', 
  api_secret: 'khNzikmGFNT3-yGWaS77Xhu1Ow4' 
});

// Multer setup
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
    
////////////////////////////////
//                            //
//   ADMIN DASHBOARD ROUTES   //
//                            //
////////////////////////////////

/////////////////////// AUTHENTICATIONS STARTS /////////////////////////

// REGISTER ROUTE

router.get("/dashboard/register", function(req, res){
	res.render("cms/register");
});

router.post("/dashboard/register", function(req, res){
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
router.get("/dashboard/login", function(req, res){
	res.render("cms/login");
});

router.post("/dashboard/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/dashboard/login"
}), function(req, res){
});

// LOGOUT ROUTE
router.get("/dashboard/logout", function(req, res){
	req.logout();
	res.redirect("/dashboard");
});

/////////////////////// AUTHENTICATIONS ENDS /////////////////////////

router.get("/dashboard", isLoggedIn, function(req, res){
	res.render("cms/index");
});


// PRODUCTS ROUTE
router.get("/dashboard/products", isLoggedIn, function(req, res){
  Product.find({}, function(err, products){
  	if(err){
  		console.log(err);
  	} else {
			res.render("cms/products", {products: products});
  	}
  });
});

// NEW SHOW
router.get("/dashboard/products/new", isLoggedIn, function(req, res){
	res.render("cms/products-new");
});


// SHOW
router.get("/dashboard/products/:id", isLoggedIn, function(req, res){
  Product.findById(req.params.id, function(err, foundProduct){
  	if(err){
  		console.log(err);
  		res.redirect("dashboard/products");
  	} else {
		res.render("cms/products-show", {product:foundProduct});
  	}
  });
});

// NEW POST
router.post("/dashboard/products", isLoggedIn, multer(multerConfig).single('img-product'), function(req, res){
  var url;
  Product.create(req.body.product, function(err, newProduct){
  	if(err){
  		res.render("cms/products-new");
  	} else {
  		console.log("Uploaded the image into server");
  		cloudinary.v2.uploader.upload('./public/temp-photo-storage/'+req.file.filename, {public_id: "jombeli_router/products/" + req.file.filename}, function(err, result){
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
router.get("/dashboard/products/:id/edit", isLoggedIn, function(req, res){
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
router.put("/dashboard/products/:id", isLoggedIn, function(req, res){
  Product.findByIdAndUpdate(req.params.id, req.body.product,function(err, updatedProduct){
  	if(err){
  		console.log(err);
  		res.redirect("/dashboard/products/");
  	} else {
  		console.log(updatedProduct);
  		res.redirect("/dashboard/products/");
  	}
  });
});

// MIDDLEWARES
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/dashboard/login");
	}
}

module.exports = router;