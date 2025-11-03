import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    curl: `curl -X POST http://localhost:3000/gitimg -H "Content-Type: application/json" -d "{\"fileName\":\"test.png\",\"base64Content\":\"$(base64 -i test.png | tr -d '\n')\"}"`,
    respons: {
      imgUrl: "https://raw.githubusercontent.com/0x130N/gitimg/main/test.png",
    },
  });
}

export async function POST(request: Request) {
  try {
    const { fileName, base64Content }: { fileName: string; base64Content: string } =
      await request.json();

    if (!fileName || !base64Content) {
      return NextResponse.json({ message: "Missing file or content" }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GitHub token");

    const owner = process.env.GITHUB_OWNER || "0x130N";
    const repo = process.env.GITHUB_REPO || "gitimg";
    const path = ""; // root folder
    const apiPath = path ? `${path}/${fileName}` : fileName;

    // Step 1: Check if file already exists to get SHA
    let sha: string | undefined;
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`, {
      headers: { Authorization: `token ${token}` },
    });

    if (getRes.ok) {
      const existingFile = await getRes.json();
      sha = existingFile.sha;
    }

    // Step 2: Upload or update file
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sha ? `Update ${fileName}` : `Add ${fileName}`,
        content: base64Content,
        ...(sha && { sha }), // include sha if file exists
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return NextResponse.json({ message: "Upload failed", error }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({ imgUrl: data.content?.download_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Upload failed", error: err }, { status: 500 });
  }
}