"use client";

import { useRef, useState, DragEvent } from "react";

interface Props {
  onImage: (blob: Blob, preview: string) => void;
}

function resizeImage(file: File, maxPx = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = (height * maxPx) / width; width = maxPx; }
        else { width = (width * maxPx) / height; height = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Resize failed")), "image/jpeg", 0.85);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function UploadZone({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    try {
      const resized = await resizeImage(file);
      const preview = URL.createObjectURL(resized);
      onImage(resized, preview);
    } catch {
      alert("Could not process image. Please try another photo.");
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-12
        flex flex-col items-center gap-4 transition-all duration-300
        ${dragging ? "glow-border bg-purple/10 scale-[1.02]" : "border-[#1E1E35] hover:border-purple/50 hover:bg-purple/5"}
      `}
    >
      <div className="float text-6xl">🧸</div>
      <div className="text-center">
        <p className="text-lg font-semibold text-white">Drop your photo here</p>
        <p className="text-sm text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
      />
    </div>
  );
}
