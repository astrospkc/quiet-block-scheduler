import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma_client";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { blockId, userId } = await req.json();
    // const userId = req.headers.get("x-user-id");
    console.log("block id , userid ; ", blockId, userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const block = await prisma.quietBlock.findUnique({
      where: { id: blockId },
    });
    if (!user || !block) {
      return NextResponse.json(
        { error: "User or block not found" },
        { status: 404 }
      );
    }
    await resend.emails.send({
      from: "Quiet Block <123punampandit@gmail.com>",
      to: user.email,
      subject: "Reminder: Quiet Block",
      text: `Hi ${user.name},\n\nYou have a quiet block scheduled for ${block.title} from ${block.startTime} to ${block.endTime}.\n\nBest,\nQuiet Block`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
