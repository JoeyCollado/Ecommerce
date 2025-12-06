import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){

    try{
      const {userId} = getAuth(request)

      const isSeller = authSeller(userId) //check if user is seller or not

      //return result and validate
      if(!isSeller){
        return NextResponse.json({succes: false, message: 'Not Authorized'})
      }

      await connectDB()

      const products = await Product.find({})

      return NextResponse.json({success: true, products})

    }catch(error){
        return NextResponse.json({success: false, message: error.message})
    }
}