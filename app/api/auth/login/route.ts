import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest)
{
    const url = process.env.REDIRECT_URL || "";

    return NextResponse.redirect(url);
}