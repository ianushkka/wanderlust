require("dotenv").config();
const express = require("express"); 
const mongoose = require("mongoose"); 
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const listingSchema = require("./schema.js");

const app = express(); 

const MONGO_URL = process.env.MONGO_URL;  

main()
    .then(()=>{
        console.log("mongoose connected successfully");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// ROOT Route
app.get("/",(req,res)=>{
    res.send("Hi, i am root .");
})  

// Listings
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs",{allListings});
})

// get for new listing form
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");

})

// show route
app.get("/listings/:id",async(req,res)=>{
    const id = req.params.id;  
    const currentListing = await(Listing.findById(id)); 
    res.render("listings/show.ejs",{currentListing});

})

// edit route (get req for edit form)
app.get("/listings/:id/edit",async(req,res)=>{
    const id = req.params.id;  
    const currentListing = await(Listing.findById(id)); 
    res.render("listings/edit.ejs",{currentListing});
})

// edit form patch req 
app.patch("/listings/:id",async(req,res)=>{
    const id = req.params.id; 
    const { image, ...rest } = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...rest, "image.url": image.url });
    
    res.redirect("/listings");
})

// post for new listing
app.post("/listings",async(req,res)=>{
    const newListing = req.body.listing; 
    await Listing.insertOne(newListing); 
    res.redirect("/listings");
    
})

// delete req
app.delete("/listings/:id",async(req,res)=>{
    const id = req.params.id;  
    await Listing.deleteOne({_id:id});
    res.redirect("/listings");

})


app.listen(8080,()=>{
    console.log("app listening to port 8080."); 
})
