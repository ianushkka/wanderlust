require("dotenv").config();
const express = require("express"); 
const mongoose = require("mongoose"); 
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const {listingSchema} = require("./schema.js");

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

const validateListing = (req,res,next) =>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(", "); 
        throw new ExpressError(400,msg);
    }
    next();
}

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
     if(!currentListing){
        throw new ExpressError(404,"Listing not found");
    } 
    res.render("listings/show.ejs",{currentListing});

})

// edit route (get req for edit form)
app.get("/listings/:id/edit",async(req,res)=>{
    const id = req.params.id;  
    const currentListing = await Listing.findById(id);
    if(!currentListing){
        throw new ExpressError(404,"Listing not found");
    } 
    res.render("listings/edit.ejs",{currentListing});
})

// edit form patch req 
app.patch("/listings/:id",validateListing,async(req,res)=>{
    const id = req.params.id;
    const { image, ...rest } = req.body.listing;
    const update = await Listing.findByIdAndUpdate(
        id,
        { ...rest, "image.url": image.url },
        {runValidators:true}
    );
    if(!update){
        throw new ExpressError(404,"Listing not found");
    }
    
    res.redirect("/listings");

})

// post for new listing
app.post("/listings",validateListing,async(req,res)=>{
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

// 404 for any URL that matched no route
app.use((req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})

// error handler
app.use((err,req,res,next)=>{
    if(err.name ==="CastError"){    // malformed listing ID like /listings/abc
        err.statusCode = 404;
        err.message = "Listing not found";
    }
    const statusCode = err.statusCode || 500;
    if (statusCode === 500) console.error(err);
    const message = statusCode === 500 ? "Something went wrong" : err.message;
    res.status(statusCode).render("error.ejs", { statusCode, message });
})


app.listen(8080,()=>{
    console.log("app listening to port 8080."); 
})
