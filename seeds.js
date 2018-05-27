var mongoose = require("mongoose"),
    Products = require("./models/product/product.js");

var data = [
    {
    	title		: "Product 1",
    	category	: "accessories",
    	price		: 50,
    	description	: "Lorem ipsum dolor sit amet, nec ex solum scriptorem omittantur. Usu te fuisset atomorum suavitate. Te esse mnesarchum adversarium duo, ex ius facer nusquam, at usu dolorum invenire. Est ei debet quando voluptua, an eleifend definitionem nec, duo ex homero maiestatis democritum. His homero inermis ut, te per paulo mnesarchum. Urbanitas scriptorem sea no. Scriptorem vituperatoribus eum cu. Te tollit semper epicurei vim. Cu ipsum tempor animal pri, ei aeterno euismod signiferumque sea. Justo veritus disputando ius in, iudico pericula cum at. Sea et legere fuisset gloriatur.",
    	isActive	: true,
    	discounts	: 50,
    	
    	brand	: "XYZ",
    	model	: "ABC-123",
    	manufacturer : "MANU-FACT",
    	madein	: "CHINA",
    
    	specs		:
    		{
    			size		: 50,
    			material	: "Fabric",
    			weight		: 2,
    		},
    	details : {
    		SKU : "BSND-123123-123ASDKJ",
    		VID : "192038ABC4343434ALK123CN",
         }
    },
    {
    	title		: "Product 1",
    	category	: "accessories",
    	price		: 50,
    	description	: "Lorem ipsum dolor sit amet, nec ex solum scriptorem omittantur. Usu te fuisset atomorum suavitate. Te esse mnesarchum adversarium duo, ex ius facer nusquam, at usu dolorum invenire. Est ei debet quando voluptua, an eleifend definitionem nec, duo ex homero maiestatis democritum. His homero inermis ut, te per paulo mnesarchum. Urbanitas scriptorem sea no. Scriptorem vituperatoribus eum cu. Te tollit semper epicurei vim. Cu ipsum tempor animal pri, ei aeterno euismod signiferumque sea. Justo veritus disputando ius in, iudico pericula cum at. Sea et legere fuisset gloriatur.",
    	isActive	: true,
    	discounts	: 50,
    	
    	brand	: "XYZ",
    	model	: "ABC-123",
    	manufacturer : "MANU-FACT",
    	madein	: "CHINA",
    
    	specs		:
    		{
    			size		: 50,
    			material	: "Fabric",
    			weight		: 2,
    		},
    	details : {
    		SKU : "BSND-123123-123ASDKJ",
    		VID : "192038ABC4343434ALK123CN",
         }
    },
    {
    	title		: "Product 1",
    	category	: "accessories",
    	price		: 50,
    	description	: "Lorem ipsum dolor sit amet, nec ex solum scriptorem omittantur. Usu te fuisset atomorum suavitate. Te esse mnesarchum adversarium duo, ex ius facer nusquam, at usu dolorum invenire. Est ei debet quando voluptua, an eleifend definitionem nec, duo ex homero maiestatis democritum. His homero inermis ut, te per paulo mnesarchum. Urbanitas scriptorem sea no. Scriptorem vituperatoribus eum cu. Te tollit semper epicurei vim. Cu ipsum tempor animal pri, ei aeterno euismod signiferumque sea. Justo veritus disputando ius in, iudico pericula cum at. Sea et legere fuisset gloriatur.",
    	isActive	: true,
    	discounts	: 50,
    	
    	brand	: "XYZ",
    	model	: "ABC-123",
    	manufacturer : "MANU-FACT",
    	madein	: "CHINA",
    
    	specs		:
    		{
    			size		: 50,
    			material	: "Fabric",
    			weight		: 2,
    		},
    	details : {
    		SKU : "BSND-123123-123ASDKJ",
    		VID : "192038ABC4343434ALK123CN",
         }
    },
    ];

function seedDB(){
    Products.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed Products");
            data.forEach(function(seed){
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
}

module.exports = seedDB;