import { useEffect, useState } from "react"

function secondsToMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Flash sale timer — counts down to tonight's midnight, then restarts. */
export function useMidnightCountdown() {
  const [secs, setSecs] = useState(secondsToMidnight)

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 1 ? secondsToMidnight() : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    h: pad(Math.floor(secs / 3600)),
    m: pad(Math.floor((secs % 3600) / 60)),
    s: pad(secs % 60),
  }
}
