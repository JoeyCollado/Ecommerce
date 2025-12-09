//api to add address

import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){

    try{

        //get user id
        const {userId} = getAuth(request)
        //get address from request
        const  {address} = await request.json()
        //save to db
        await connectDB()
        const newAddress = await Address.create({...address, userId})

        return NextResponse.json({success: true, message: 'Address added successfully', newAddress})

    }catch(error){
      return NextResponse.json({success: false, message: error.message});
    }
}