"use client";
import "./globals.css";
import { useEffect, useRef, useState } from "react";

function draw(canvas, text, clean) {
  const c = canvas;
  const w = 1080, h = 1920;
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#0e0e0e";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#ff4d4d";
  g.font = "700 42px sans-serif";
  g.fillText("UNSENT", 90, 220);
  g.fillStyle = "#f4f4f4";
  g.font = "64px Georgia, serif";
  const words = (text || "the text you did not send").split(" ");
  let line = "", y = 420;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (g.measureText(test).width > 900) { g.fillText(line, 90, y); line = word; y += 84; }
    else line = test;
  }
  g.fillText(line, 90, y);
  g.fillStyle = "#8d8d8d";
  g.font = "32px sans-serif";
  g.fillText(new Date().toLocaleString(), 90, 1680);
  if (!clean) {
    g.fillStyle = "#ff4d4d";
    g.fillText("@NyttoLabs", 90, 1760);
  }
}

export default function Home() {
  const ref = useRef(null);
  const [text, setText] = useState("");
  const [clean, setClean] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { if (ref.current) draw(ref.current, text, clean); }, [text, clean]);
  function save() {
    const a = document.createElement("a");
    a.href = ref.current.toDataURL("image/png");
    a.download = "unsent.png";
    a.click();
  }
  async function pay() {
    setErr("");
    const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Checkout is not connected yet.");
    sessionStorage.setItem("unsent", text);
    window.location = data.url;
  }
  return (
    <main>
      <div className="k">UNSENT</div>
      <h1>The text you did not send.</h1>
      <p>Type it. The card is already done. Post the screenshot. @NyttoLabs stays on it until you pay €1.</p>
      <textarea maxLength={140} value={text} onChange={(e) => setText(e.target.value)} placeholder="i miss you. don't send." />
      <canvas ref={ref} />
      <div className="row">
        <button className="ghost" onClick={save}>Save card</button>
        <button className="solid" onClick={pay}>Remove @NyttoLabs · €1</button>
      </div>
      {err ? <p className="meta">{err}</p> : null}
    </main>
  );
}
