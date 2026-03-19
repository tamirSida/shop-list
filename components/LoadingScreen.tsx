"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    // Try common image extensions for public/load.*
    const extensions = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
    let found = false;

    for (const ext of extensions) {
      if (found) break;
      const img = new window.Image();
      img.onload = () => {
        if (!found) {
          found = true;
          setSrc(`/load.${ext}`);
        }
      };
      img.src = `/load.${ext}`;
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 gap-6">
      {src && (
        <Image
          src={src}
          alt="Loading"
          width={200}
          height={200}
          className="rounded-3xl object-contain max-w-[60vw] max-h-[40vh]"
          priority
        />
      )}
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
