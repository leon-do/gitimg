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

    const owner = process.env.GITHUB_OWNER || "0x130N";
    const repo = process.env.GITHUB_REPO || "gitimg";

    // Create a unique file name to avoid collisions
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Upload new file
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${uniqueFileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add ${uniqueFileName}`,
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
