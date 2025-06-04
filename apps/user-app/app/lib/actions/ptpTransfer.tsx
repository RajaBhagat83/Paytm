"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { timeStamp } from "console";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;//This line lock the row of the transaction so that two concurrent send request doesnot got parallely

        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });

          console.log("before sleep");
          await new Promise((resolve) => setTimeout(resolve,3000));
          console.log("after sleep"); 

          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
          }

          await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });

          await tx.p2pTransfer.create({
            data:{
              fromUserid:Number(from),
              toUserId:toUser.id,
              amount,
              timestamp:new Date()
            }
          })
    });
}