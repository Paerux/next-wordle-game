import axios from "axios";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest)
{
    console.log("sa");
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code)
    {
        return new NextResponse("No code provided", { status: 400 });
    }
    const params = new URLSearchParams();
    params.append("client_id", process.env.ClientID || "");
    params.append("client_secret", process.env.ClientSecret || "");
    params.append("grant_type", "authorization_code");
    params.append("code", code.toString());
    params.append("redirect_uri", process.env.BASE_URL || "");

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/x-www-form-urlencoded'
    }
    const response = await axios.post("https://discord.com/api/oauth2/token", params, {
        headers: headers
    });

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
        headers: {
            'Authorization': `Bearer ${response.data.access_token}`,
            ...headers
        }
    });

    const { id } = userResponse.data;
    const secret = process.env.JWT_SECRET || "";

    const token = sign({ id }, secret, { expiresIn: "1h" });
    const serializedToken = serialize("paeruxToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/"
    });

    return NextResponse.redirect(process.env.ROOT_URL || "", {
        headers: {
            'Set-Cookie': serializedToken
        }
    });

}