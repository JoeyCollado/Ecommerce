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
     // Check if MONGODB_URI is set
     if(!process.env.MONGODB_URI){
       throw new Error('MONGODB_URI environment variable is not set. Please configure it in your .env.local file or deployment environment variables.')
     }
     
     const options = {
        bufferCommands:false
     }
     cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/markcart`, options).then(mongoose => {
        return mongoose // once connection established return mongoose
     }).catch(error => {
       // Clear the promise on error so we can retry
       cached.promise = null
       throw new Error(`MongoDB connection failed: ${error.message}. Please check your MONGODB_URI connection string and credentials.`)
     })
   }

   cached.connection = await cached.promise
   return cached.connection
}

export default connectDB