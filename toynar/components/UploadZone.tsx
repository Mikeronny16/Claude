"use client";

import { useRef, useState, DragEvent } from "react";

interface Props {
  onImage: (file: File, preview: string) => void;
}

export default function UploadZone({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImage(file, e.target?.result as string);
    reader.readAsDataURL(file);
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
