import mongoose from "mongoose";
//define structure of database

const userSchema = new mongoose.Schema({
    _id:{type: String, required: true}, //if no id prop don't store
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true}, //force no email duplication
    imageUrl : {type: String, required: true},
    cartItems : {type: Object, default: {}}
}, {minimize: false})

//create user model
//           validator               creation
const User = mongoose.models.user || mongoose.model('user', userSchema) // here is what we use to create multiple users and store them in database

export default User