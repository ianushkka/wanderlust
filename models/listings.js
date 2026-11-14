const mongoose = require("mongoose"); 
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title : {
        type:String,
        required:true
    },
    description : {
        type:String
    },
    image : {
        filename:String,
        url : {
            type:String,
            default : "https://plus.unsplash.com/premium_photo-1673002094195-f18084be89ce?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
            set: (v) =>
            v==="" ? "https://plus.unsplash.com/premium_photo-1676320526001-07b75bd19ae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D":v
        }
       
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
   
})
    
const Listing = mongoose.model("Listing",listingSchema); 

module.exports = Listing;