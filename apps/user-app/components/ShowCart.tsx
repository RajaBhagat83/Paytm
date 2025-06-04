"use client";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";

export function ShowCart({sendMoney}:{sendMoney:{
  amount:number,
  time:Date,
  fromUserid:number,
  toUser:string
}[]}) {
  return (
    <Card title="Recent Transactions">
        <div className="pt-2">
            {sendMoney.map(t => <div className="flex justify-between">
                <div className="pt-3" > 
                    <div className="text-sm">
                        Send INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                    <div className="pt-3">
                       { t.toUser}
                    </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
  );
}
