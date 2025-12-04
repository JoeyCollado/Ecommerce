import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
//api endpoint for adding product

//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//asynchronous arrow function
export async function POST(request){
    try{
      const {userId} = getAuth(request)

      //check if user is seller or not
      const isSeller = await authSeller(userId)

      if(!isSeller){ //if not seller
        return NextResponse.json({success: false, message: 'Not Authorized'})
      }
      const formData = await request.formData()

      //extract details
      const name = formData.get('name')
      const description = formData.get('description');
      const category = formData.get('category');
      const price = formData.get('price');
      const offerPrice = formData.get('offerPrice');
      //image files
      const files = formData.getAll('images');

      if(!files || files.length === 0){ //if no files
        return NextResponse.json({success: false, message: 'Not Authorized'})
      }

      const result = await Promise.all(
        files.map(async(file) =>{
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            return new Promise((resolve, reject)=> {
                const stream = cloudinary.uploader.upload_stream(
                    {resource_type: 'auto'},
                    (error, result) => {
                        if(error){
                            reject(error)
                        }else{
                            resolve(result)
                        }
                    }
                )
                stream.end(buffer)
            })
        })

        //extract image url
      )
      const image = result.map(result => result.secure_url)

      //save product data to db

    }catch(error){

    }
}