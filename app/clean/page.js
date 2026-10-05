"use client";
import "../globals.css";
import { useEffect, useRef, useState } from "react";
export default function Clean() {
  const ref = useRef(null);
  const [text, setText] = useState("");
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("session_id");
    fetch("/api/clean", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ session_id: id }) })
      .then((r) => r.json()).then((d) => setText(d.text || ""));
  }, []);
  useEffect(() => {
    if (!ref.current || !text) return;
    const c = ref.current, w = 1080, h = 1920;
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    g.fillStyle = "#0e0e0e"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#ff4d4d"; g.font = "700 42px sans-serif"; g.fillText("UNSENT", 90, 220);
    g.fillStyle = "#f4f4f4"; g.font = "64px Georgia, serif";
    let line = "", y = 420;
    for (const word of text.split(" ")) {
      const test = line ? line + " " + word : word;
      if (g.measureText(test).width > 900) { g.fillText(line, 90, y); line = word; y += 84; } else line = test;
    }
    g.fillText(line, 90, y);
  }, [text]);
  return <main><div className="k">CLEAN</div><h1>No name on it.</h1><canvas ref={ref} /><button className="solid" onClick={() => { const a = document.createElement("a"); a.href = ref.current.toDataURL("image/png"); a.download = "unsent-clean.png"; a.click(); }}>Save clean card</button></main>;
}
