"use client";
import "./globals.css";
import { useEffect, useRef, useState } from "react";

const LINES = [
  "i miss you. don't send.",
  "jag skulle ha sagt det.",
  "det här stannar här."
];

function draw(canvas, text, clean) {
  const c = canvas;
  const w = 1080, h = 1920;
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#f4efe6";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#c4493a";
  g.fillRect(0, 0, w, 28);
  g.font = "700 42px sans-serif";
  g.fillText("UNSENT", 90, 220);
  g.fillStyle = "#1c1712";
  g.font = "64px Georgia, serif";
  const words = (text || "the text you did not send").split(" ");
  let line = "", y = 420;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (g.measureText(test).width > 900) { g.fillText(line, 90, y); line = word; y += 84; }
    else line = test;
  }
  g.fillText(line, 90, y);
  g.fillStyle = "#6f6256";
  g.font = "32px sans-serif";
  g.fillText(new Date().toLocaleString("sv-SE"), 90, 1680);
  if (!clean) {
    g.fillStyle = "#c4493a";
    g.fillText("@NyttoLabs", 90, 1760);
  }
}

export default function Home() {
  const ref = useRef(null);
  const [text, setText] = useState(LINES[0]);
  const [clean, setClean] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (ref.current) draw(ref.current, text, clean); }, [text, clean]);
  function save() {
    const a = document.createElement("a");
    a.href = ref.current.toDataURL("image/png");
    a.download = "unsent.png";
    a.click();
  }
  async function pay() {
    setErr("");
    setBusy(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setBusy(false);
      return setErr(data.error || "Kortbetalning är inte kopplad än. Kortet ovan går att spara.");
    }
    sessionStorage.setItem("unsent", text);
    window.location = data.url;
  }
  return (
    <main>
      <div className="k">UNSENT</div>
      <h1>Texten du inte skickade.</h1>
      <p>Skriv den. Kortet är redan klart. Spara och posta. @NyttoLabs sitter kvar tills du betalar €1.</p>
      <div className="chips">
        {LINES.map((item) => <button type="button" className="chip" key={item} onClick={() => setText(item)}>{item}</button>)}
      </div>
      <textarea maxLength={140} value={text} onChange={(e) => setText(e.target.value)} placeholder="i miss you. don't send." />
      <canvas ref={ref} />
      <div className="row">
        <button className="ghost" onClick={save}>Spara kort</button>
        <button className="solid" onClick={pay} disabled={busy}>{busy ? "Öppnar" : "Ta bort @NyttoLabs · €1"}</button>
      </div>
      {err ? <p className="meta">{err}</p> : null}
    </main>
  );
}
