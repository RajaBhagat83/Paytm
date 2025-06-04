import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { ShowCart } from "../../../components/ShowCart";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function OnSend() {
  const session = await getServerSession(authOptions);
  const trsx = await prisma.p2pTransfer.findMany({
    where: {
      fromUserid: Number(session?.user?.id),
    },
  });
  return trsx.map((t) => ({
    amount: t.amount,
    time: t.timestamp,
    from: t.fromUserid,
    toUser: t.toUserId,
  }));
}

export default async function () {
  const sendMoney = await OnSend();
  return (
    <div className="w-full flex pl-96">
      <SendCard />
      <div className="p-52 w-full h-fit ">
        <ShowCart sendMoney={sendMoney} />
      </div>
    </div>
  );
}
