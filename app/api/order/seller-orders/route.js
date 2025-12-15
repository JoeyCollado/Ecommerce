import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/Address";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";
import { useId } from "react";


export async function GET(request){
    try{
       const {userId} = getAuth(request)

       const isSeller = await authSeller(useId); //check if user is seller

       if(!isSeller){ //if not
        return NextResponse.json({success: false, message: 'Not Authorized'})
       }
       //if seller
       await connectDB() //establish db connection
       //initialize model
       Address.length
       //get all orders available in db
       const orders = Order.find({}).populate('address items.product')
       //get all orders in the orders array then generate response
       return NextResponse.json({success: true, orders})
    }catch(error){
        return NextResponse.json({success: false, message: error.message})
    }
}