"use client";

interface Props {
  original: string;
  result: string;
}

export default function ResultCard({ original, result }: Props) {
  function download() {
    const a = document.createElement("a");
    a.href = result;
    a.download = "toynar-result.png";
    a.click();
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: "I turned myself into a toy! 🧸", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-400 text-center uppercase tracking-wider">Before</p>
          <img src={original} alt="Original" className="w-full rounded-xl border border-[#1E1E35]" />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-purple text-center uppercase tracking-wider font-semibold">After ✨</p>
          <img src={result} alt="Toyified" className="w-full rounded-xl glow-purple border border-purple/30" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={download}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple to-pink-500 font-semibold glow-btn"
        >
          ⬇ Download
        </button>
        <button
          onClick={share}
          className="flex-1 py-3 rounded-xl border border-purple/50 font-semibold hover:bg-purple/10 transition-colors"
        >
          🔗 Share
        </button>
      </div>
    </div>
  );
}
