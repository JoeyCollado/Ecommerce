import mongoose, { mongo } from "mongoose";
//mongodb configuration

//npm i mongoose

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {connection: null, promise: null}
}

async function connectDB(){ //async function to establish connection to mongodb
   if(cached.connection){ //if connection is true
     return cached.connection
   }
   if(!cached.promise){ //if not establish the connection
     const options = {
        bufferCommands:false
     }
     cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/markcart`, options).then(mongoose => {
        return mongoose // once connection established return mongoose
     })
   }

   cached.connection = await cached.promise
   return cached.connection
}

export default connectDB