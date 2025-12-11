// api to create new order

import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){

    try{
      const {userId} = getAuth(request);
      const {address, items} = await request.json();

      if(!address || items.length === 0){
        return NextResponse.json({success: false, message: 'Invalid Data'});
      }

      //calculate price amount
      const amount = await items.reduce(async(arc, item) => {
        const product = await Product.findById(item.product);
        return acc + product.offerPrice * item.quantity
      }, 0) //initial value
      //create order
      
    }catch(error){

    }
}