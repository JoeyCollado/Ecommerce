//api to add product data in cart

import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try{
      //get user id
      const {userId} = getAuth(request)
      //get cart data
      const {cartData} = await request.json()
      //save data in db
      await connectDB()
      //fetch user
      const user = await User.findById(userId)
      //update the user cart item with the cart data
      user.cartItems = cartData
      //save the user
      user.save()
      //send response
      NextResponse.json({success: true})
    }catch(error){
      NextResponse.json({success: false, message: error.message})
    }
}