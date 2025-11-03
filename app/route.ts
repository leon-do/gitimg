import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    curl: `curl -X POST http://localhost:3000/gitimg -H "Content-Type: application/json" -d "{\"fileName\":\"test.png\",\"base64Content\":\"$(base64 -i test.png | tr -d '\n')\"}"`,
    respons: {
      imgUrl: "https://raw.githubusercontent.com/0x130N/gitimg/main/test.png",
    },
  });
}
