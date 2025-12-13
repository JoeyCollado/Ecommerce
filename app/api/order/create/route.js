// api to create new order

import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request){

    try{
      const {userId} = getAuth(request);
      const {address, items} = await request.json();

      if(!address || items.length === 0){
        return NextResponse.json({success: false, message: 'Invalid Data'});
      }

      //connect to database
      await connectDB();

      //calculate price amount
      let amount = 0;
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return NextResponse.json({success: false, message: `Product ${item.product} not found`});
        }
        amount += product.offerPrice * item.quantity;
      }
      
      const finalAmount = amount + Math.floor(amount * 0.02);
      const orderDate = Date.now();

      //create order directly in database (primary method)
      const order = await Order.create({
        userId,
        items,
        amount: finalAmount,
        address,
        date: orderDate
      });

      //also send event to inngest for async processing (if configured)
      try {
        await inngest.send({
          name: 'order/created',
          data: {
              userId,
              address,
              items,
              amount: finalAmount,
              date: orderDate
          }
        });
      } catch (inngestError) {
        // Log but don't fail if Inngest is not configured
        console.warn('Inngest event send failed (order already saved):', inngestError.message);
      }

      //clear users Cart
      const user = await User.findById(userId)
      if (user) {
        user.cartItems = {}
        await user.save()
      }
      
      //send response
      return NextResponse.json({success: true, message: 'Order Placed', orderId: order._id})

    }catch(error){
        console.log(error)
        return NextResponse.json({success: false, message: error.message})

    }
}