"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";


export async function createOnRampTransaction(amount:number,provider:string){
  const session = await getServerSession(authOptions);
  if(!session || !session?.user){
    return NextResponse.json({
      message:"Unauthorized User!"
    })
  }
   const token = (Math.random() *1000).toString();
   await prisma.onRampTransaction.create({
    data:{
      userId:Number(session.user.id),
      amount:amount,
      provider:provider,
      status:"Processing",
      token:token,
      startTime:new Date()
    }
   })
   return NextResponse.json({
    messgae:"User created Successfully"
   })
}  