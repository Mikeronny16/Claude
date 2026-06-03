"use client"

interface Props {
  lang: "en" | "mm"
}

export default function ShareButton({ lang }: Props) {
  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: "Klaro — Document Explained",
        text: lang === "mm" ? "ဒီစာရွက်ကို klaro မှာ ကြည့်ပါ" : "Check out this document explanation",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(lang === "mm" ? "Link မိတ္တူကူးပြီးပါပြီ" : "Link copied!")
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
      style={{ background: "var(--teal-light)", color: "var(--teal)" }}
    >
      <span>↗</span>
      {lang === "mm" ? <span className="font-myanmar">မျှဝေမည်</span> : "Share"}
    </button>
  )
}
