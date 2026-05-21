"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  style?: Record<string, string>;
}

export default function LiveCounter({ target, duration = 1800, suffix = "", prefix = "", className = "", style }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startAt = Math.floor(target * 0.7);
        const steps = 50;
        const increment = (target - startAt) / steps;
        let current = startAt;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          current += increment;
          setCount(Math.floor(current));
          if (step >= steps) {
            setCount(target);
            clearInterval(timer);
          }
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
