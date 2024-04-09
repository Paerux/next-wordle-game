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
    const length = req.nextUrl.searchParams.get("length");
    if (!length || isNaN(parseInt(length)))
    {
        return NextResponse.json({ error: "Invalid length" }, { status: 400 });
    }
    try
    {
        const id = await verify(token, process.env.JWT_SECRET || "");
        console.log("id", id);
        const wordsWithLength = wordList.filter((word: string) => word.length === parseInt(length));
        const randomIndex = Math.floor(Math.random() * wordsWithLength.length);
        const randomWord = wordsWithLength[randomIndex];

        return NextResponse.json({ word: randomWord });
    }
    catch (error)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
