import mongoose from "mongoose";
//define structure of database

const userSchema = new mongoose.Schema({
    _id:{type: String, required:true}, //if no id prop don't store
    _name:{type: String, required:true},
    _email:{type: String, required:true, unique:true}, //force no email duplication
    imageUrl : {type: String, required:true},
    cartItems : {type: Object, default: {}}
}, {minimize: false})