import { NextResponse } from "next/server";
import { Client } from "@upstash/qstash";
import prisma from "../../../../lib/prisma_client";
const qstash = new Client({ token: process.env.QSTASH_TOKEN });
//YYYY-MM-DDThh:mm:ss.sssZ - 1997-07-16T19:20:30.451Z -2025-09-13T12:50:30.451Z  2025-09-13T13:50:30.451Z
export const POST = async function (req) {
  try {
    const userId = req.headers.get("x-user-id");
    // console.log("userid: ", userId);
    const { title, startTime, endTime } = await req.json();
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields: title, startTime, endTime" },
        { status: 400 }
      );
    }

    const createBlock = await prisma.quietBlock.create({
      data: {
        userId: userId,
        title: title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    console.log("created block: ", createBlock);

    //calculate delay
    const delayMs = new Date(startTime).getTime() - 10 * 60 * 1000 - Date.now();
    let result;
    if (delayMs > 0) {
      //   //schedule qstash job
      result = await qstash.publishJSON({
        url: `http://localhost:3000/api/reminders/email`,
        // headers: { "Content-Type": "application/json" },
        // method: "POST",
        data: { userId, blockId: createBlock.id },
        delay: delayMs,
      });
    }
    return NextResponse.json({
      data: createBlock,
      qstashMessageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
