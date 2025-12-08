//api to add product data in cart

import { getAuth } from "@clerk/nextjs/server";

export async function POST(request){
    try{
      const {userId} = getAuth(request)
    }catch(error){

    }
}