import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      fileName,
      base64Content,
    }: { fileName: string; base64Content: string } = await request.json();

    if (!fileName || !base64Content) {
      return NextResponse.json(
        { message: "Missing file or content" },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GitHub token");

    const owner = "0x130N";
    const repo = "gitimg";
    const path = ""; // root folder

    const apiPath = path ? `${path}/${fileName}` : fileName;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add ${fileName}`,
          content: base64Content,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return NextResponse.json(
        { message: "Upload failed", error },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ imgUrl: data.content?.download_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Upload failed", error: err },
      { status: 500 }
    );
  }
}
