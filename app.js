const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/todo",{useNewUrlParser:true},()=>{
    console.log("connected");
})
var todolistSchema = new mongoose.Schema({
    item : String
})
var items = mongoose.model("todoItem",todolistSchema);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.resolve(__dirname,"assets")));
app.set("view engine","ejs");
app.listen(8080);

const date = new Date();

app.get("/",(req,res)=>{
    items.find(function(err,item){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{
                value:item,
                Today: date.toUTCString()
            });
        }
    })
    
   
})

app.post("/",(req,res)=>{
    if(req.body.input !=""){
        new items({
            item:req.body.input
            }).save();
    }
    res.redirect("/");
})

app.post("/delete",(req,res)=>{
    const checkedItem = req.body.checked;
    console.log(checkedItem);
    items.findByIdAndRemove(checkedItem,(err)=>{ //this method requires callback to executes otherwise it will simply return the find value
        if(err){console.log(err);}
        else{
            console.log("successfully deleted");
        }
    })
    res.redirect("/");
})