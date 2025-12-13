import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "markcart-next" });

// inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
        _id: id,
        _email: email_addresses[0].email_address,
        _name: first_name + ' ' + last_name,
        imageUrl: image_url
      };
    await connectDB();
    await User.create(userData);
  }
);

// Inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      _email: email_addresses[0].email_address,
      _name: first_name + ' ' + last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// inggest function to create user order in database
// Note: Orders are now saved directly in the API route, but this function
// can still be used for batching or if direct save fails
export const createUserOrder = inngest.createFunction(
  {
    id: 'create-user-order',
    batchEvents: { //batching process
      maxSize: 5,
      timeout: '5s'
    }
  },
  {event: 'order/created'},
  async ({events}) => {
    try {
      console.log('Inngest: Processing orders', events.length);
      
      //connect to database
      await connectDB()
      console.log('Inngest: Connected to database');
      
      const ordersToInsert = [];
      
      for (const event of events) {
        // Check if order already exists (to prevent duplicates)
        const existingOrder = await Order.findOne({
          userId: event.data.userId,
          date: event.data.date,
          amount: event.data.amount
        });
        
        if (!existingOrder) {
          ordersToInsert.push({
            userId: event.data.userId, 
            items: event.data.items,
            amount: event.data.amount,
            address: event.data.address,
            date: event.data.date
          });
        } else {
          console.log('Inngest: Order already exists, skipping', existingOrder._id);
        }
      }
      
      if (ordersToInsert.length > 0) {
        // Insert only new orders
        const result = await Order.insertMany(ordersToInsert)
        console.log('Inngest: Orders inserted', result.length);
      } else {
        console.log('Inngest: All orders already exist, nothing to insert');
      }

      return {success: true, processed: ordersToInsert.length, skipped: events.length - ordersToInsert.length};
    } catch (error) {
      console.error('Inngest: Error creating orders', error);
      throw error;
    }
  }
)