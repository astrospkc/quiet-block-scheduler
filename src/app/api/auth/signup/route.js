import { NextResponse } from "next/server";
import supabase from "../../../../lib/supabaseClient";
import prisma from "../../../../lib/prisma_client";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

export async function POST(req) {
  try {
    // Check if request has a body
    const body = await req.text();
    console.log(body);

    if (!body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    // Parse the JSON
    const { email, name, password } = JSON.parse(body);

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, password" },
        { status: 400 }
      );
    }

    const resdata = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
    console.log("resdata: ", resdata);
    return NextResponse.json({
      message: "Sign up is working!",
      data: resdata,
    });
  } catch (error) {
    console.error("JSON parsing error:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
