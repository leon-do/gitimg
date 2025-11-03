"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [imgUrl, setImgUrl] = React.useState("");

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // remove "data:*/*;base64," prefix
        const result = (reader.result as string).split(",")[1];
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const file = acceptedFiles[0]; // ✅ take the first file
    if (!file) return;
    const base64Content = await fileToBase64(file);
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        base64Content,
      }),
    });
    const { imgUrl } = await response.json();
    setImgUrl(imgUrl);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <main className="flex items-center justify-center flex-col min-h-screen bg-[#386641] text-[#a7c957] font-mono">
      <div className="my-12 text-4xl">GitImg</div>
      <div
        className="border-8 border-dashed rounded-2xl h-[300px] w-[300px] flex items-center justify-center text-9xl cursor-pointer hover:bg-[#386635]"
        {...getRootProps()}
      >
        <input {...getInputProps()} />⬆
      </div>
      <div className="my-12 mx-6 text-xl break-all text-center">{imgUrl}</div>
    </main>
  );
}
