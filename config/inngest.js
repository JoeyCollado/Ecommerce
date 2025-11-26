import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "markcart-next" }); // we can use this to create functions

//functions to manage clerk webhooks

//inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async ({event}) => {
       const {id, first_name, last_name, email_addresses, image_url} = event.data //destructure from the event data
       //create object where we will define user data then store it to db
       const userData = {
        _id:id,
        email: email_addresses[0].email_addresses,
        name: first_name + ' ' + last_name,
        image_url: image_url
       }
       //save data
       await connectDB()
       await User.create(userData)
    }
)

// Inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {event: 'clerk/user.updated'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data //destructure from the event data
        //create object where we will define user data then store it to db
        const userData = {
         _id:id,
         email: email_addresses[0].email_addresses,
         name: first_name + ' ' + last_name,
         image_url: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData )
    }
)

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user/deleted'},
    async ({event}) => {
       const {id} = event.data

       await connectDB()
       await User.findByIdAndDelete(id)
    }
)