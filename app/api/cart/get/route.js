//api to fetch cart data

import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){

    try{
        //get user id
        const {userId} = getAuth(request)
        
        await connectDB()
        //create variable to store user data
        const user = await User.findById(userId)
        //send cart items to this user data
        const {cartItems} = user

        return NextResponse.json({success: true, cartItems})
    }catch(error){
        return NextResponse.json({success: false, message: error.message})
    }
}