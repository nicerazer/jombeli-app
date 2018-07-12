var mongoose = require("mongoose"),
    Products = require("./models/product/product.js"),
    Category = require("./models/product/category.js"),
    Authority= require("./models/admin/authority.js");

var product = [
    {
    	title		   : "Product 1",
    	category	   : "accessories",
    	price		   : 50,
    	description	: "Lorem ipsum dolor sit amet, nec ex solum scriptorem omittantur. Usu te fuisset atomorum suavitate. Te esse mnesarchum adversarium duo, ex ius facer nusquam, at usu dolorum invenire. Est ei debet quando voluptua, an eleifend definitionem nec, duo ex homero maiestatis democritum. His homero inermis ut, te per paulo mnesarchum. Urbanitas scriptorem sea no. Scriptorem vituperatoribus eum cu. Te tollit semper epicurei vim. Cu ipsum tempor animal pri, ei aeterno euismod signiferumque sea. Justo veritus disputando ius in, iudico pericula cum at. Sea et legere fuisset gloriatur.",
    	isActive	   : true,
    	discounts   : 50,
    	imgUrl      : [{url : "https://res.cloudinary.com/nicerazer/image/upload/v1527577780/jombeli_router/products/img-product-1529076355953.jpg"}],
    	
    	brand	: "XYZ",
    	model	: "ABC-123",
    	manufacturer : "MANU-FACT",
    	madein	: "CHINA",
    
    	specs		:
    		{
    			size		: 50,
    			material	: "Fabric",
    			weight	: 2,
    		},
    	details : {
    		SKU : "BSND-123123-123ASDKJ",
    		VID : "192038ABC4343434ALK123CN",
         }
    },
    {
    	title		   : "Product 1",
    	category	   : "accessories",
    	price		   : 50,
    	description	: "Lorem ipsum dolor sit amet, nec ex solum scriptorem omittantur. Usu te fuisset atomorum suavitate. Te esse mnesarchum adversarium duo, ex ius facer nusquam, at usu dolorum invenire. Est ei debet quando voluptua, an eleifend definitionem nec, duo ex homero maiestatis democritum. His homero inermis ut, te per paulo mnesarchum. Urbanitas scriptorem sea no. Scriptorem vituperatoribus eum cu. Te tollit semper epicurei vim. Cu ipsum tempor animal pri, ei aeterno euismod signiferumque sea. Justo veritus disputando ius in, iudico pericula cum at. Sea et legere fuisset gloriatur.",
    	isActive	   : true,
    	discounts   : 50,
    	imgUrl      : [{url : "https://res.cloudinary.com/nicerazer/image/upload/v1527577780/jombeli_router/products/img-product-1529076303356.jpg"}],
    	
    	brand	: "XYZ",
    	model	: "ABC-123",
    	manufacturer : "MANU-FACT",
    	madein	: "CHINA",
    
    	specs		:
    		{
    			size		: 50,
    			material	: "Fabric",
    			weight	: 2,
    		},
    	details : {
    		SKU : "BSND-123123-123ASDKJ",
    		VID : "192038ABC4343434ALK123CN",
         }
    }
    ];
    
    /*
AUTHORITY LIST
1. MASTER ADMIN
2. ADMIN
3. EDITOR
*/
var authority_arr = [
	{type	: "MASTER"},
	{type	: "ADMIN"},
	{type	: "EDITOR"},
];

var category_arr = [
	{
	   name	: "clothings",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "accessories",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "shoes",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "bags",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "sports",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "watches",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "groomings",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
	{
	   name	: "electronics",
	   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nisi, mollitia quisquam aut iusto officiis numquam voluptate reprehenderit aliquam magni sit, consectetur delectus maiores quo magnam sunt, sint eligendi hic?"
	},
];

function seedDB(){
 Products.remove({}, function(err){
  if(err){
      console.log(err);
  } else {
      console.log("Removed Products");
      product.forEach(function(seed){
       Products.create(seed, function(err, created){
          if(err){
              console.log(err);
          } else {
              console.log("Added a product!");
          }
       });
    });
  }
 });
 Category.remove({}, function(err){
   if (err){
    console.log(err);
   } else {
    category_arr.forEach(function(seed){
       Category.create(seed, function(err, createdObj){
     		if(err){
     			console.log(err);
     		}	else {
     			console.log("Added a category!");
     		}
      });
   });
 }
 });
 Authority.remove({}, function(err){
   if (err){
      console.log(err);
   } else {
      authority_arr.forEach(function(seed){
      	Authority.create(seed, function(err, createdAuthority){
      		if(err){
      			console.log(err);
      		}	else {
      			console.log("Created an authority!");
      		}
      	});
      });
   }
 });
}

module.exports = seedDB;