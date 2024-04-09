import wordList from "../../../data/wordList.json";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";


export async function GET(req: NextRequest)
{
    const token = cookies().get("paeruxToken")?.value;
    if (!token)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const word = req.nextUrl.searchParams.get("word");
    if (!word)
    {
        return NextResponse.json({ error: "Invalid length" }, { status: 400 });
    }
    try
    {
        const id = await verify(token, process.env.JWT_SECRET || "");
        const wordExists = wordList.includes(word);
        return NextResponse.json({ wordExists: wordExists });
    }
    catch (error)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
