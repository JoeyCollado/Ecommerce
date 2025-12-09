import mongoose from "mongoose";

//create variable to store address schema
const addressSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    fullName: {type: String, required: true},
    PhoneNumber: {type: String, required: true},
    pincode: {type: String, required: true},
    area: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
})

//create model
const Address = mongoose.models.address || mongoose.model('address', addressSchema)

export default Address;