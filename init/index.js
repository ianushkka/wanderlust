require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose"); 
// const Schema = mongoose.Schema;  
const Listing = require("../models/listings.js"); //schema require  
const initData = require("./data.js");

const MONGO_URL = process.env.MONGO_URL;  

main() 
    .then(()=>{
        console.log("mongoose connected successfully"); 
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){ 
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async()=>{
    await Listing.deleteMany({}); 
    await Listing.insertMany(initData.data); 
    console.log("data was inserted");
} 

initDB();