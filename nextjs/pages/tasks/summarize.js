// pages/summary.js  (or app/summary/page.js)
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function DocumentSummaryPage() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [tool, setTool] = useState("pen"); // 'pen' | 'highlighter' | 'eraser'
  const [color, setColor] = useState("#9b59b6"); // default purple
  const isDrawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // Resize canvas to container pixels (keeps crisp drawing)
  useEffect(() => {
    function fit() {
      const c = canvasRef.current;
      const w = wrapRef.current.clientWidth - 2;  // minus borders
      const h = wrapRef.current.clientHeight - 2;
      const ratio = window.devicePixelRatio || 1;
      c.width = w * ratio;
      c.height = h * ratio;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      const ctx = c.getContext("2d");
      ctx.scale(ratio, ratio);
      // light background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const getCtx = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "pen") {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
    } else if (tool === "highlighter") {
      ctx.globalAlpha = 0.35;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 12;
      ctx.strokeStyle = color;
    } else if (tool === "eraser") {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 18;
      ctx.strokeStyle = "rgba(0,0,0,1)";
    }
    return ctx;
  };

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }

  function handleDown(e) {
    e.preventDefault();
    isDrawing.current = true;
    last.current = pos(e);
  }
  function handleMove(e) {
    if (!isDrawing.current) return;
    const { x, y } = pos(e);
    const ctx = getCtx();
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
  }
  function handleUp() {
    isDrawing.current = false;
  }

  function exportPDF() {
    // Simple export: open the drawing in a new tab for printing / Save as PDF
    const data = canvasRef.current.toDataURL("image/png");
    const w = window.open("");
    if (!w) return;
    w.document.write(`
      <html><head><title>Document Summary</title>
      <style>html,body{margin:0;padding:0}</style>
      </head><body><img src="${data}" style="width:100%"/></body></html>`);
    w.document.close();
    w.focus();
    // The user can "Save as PDF" from the browser print dialog
    w.print();
  }

  function downloadPNG() {
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "document-summary.png";
    a.click();
  }

  return (
    <main className="page">
      <div className="container">
        {/* tiny brand text */}
        <div className="brand">Study Partner!</div>

        <h2 className="title">Document Summary</h2>

        {/* toolbar */}
        <div className="toolbar">
          <button
            className={`tool ${tool === "pen" ? "active" : ""}`}
            title="Pen"
            onClick={() => setTool("pen")}
          >
            {/* pencil icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.0 1.0 0 0 0 0-1.41l-2.34-2.34a1.0 1.0 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            className={`tool ${tool === "highlighter" ? "active" : ""}`}
            title="Highlighter"
            onClick={() => setTool("highlighter")}
          >
            {/* marker icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M3 16l6-6 5 5-6 6H3v-5zM15.5 3.5l5 5-3 3-5-5 3-3z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* colors */}
          <div className="colors">
            {[
              "#e84393", // pink
              "#9b59b6", // purple
              "#e74c3c", // red
              "#e67e22", // orange
              "#f1c40f", // yellow
              "#2ecc71", // green
              "#3498db", // blue
              "#000000", // black
            ].map((c) => (
              <button
                key={c}
                className={`swatch ${color === c && tool !== "eraser" ? "sel" : ""}`}
                style={{ background: c }}
                onClick={() => {
                  setColor(c);
                  if (tool === "eraser") setTool("pen");
                }}
                aria-label={`color ${c}`}
              />
            ))}
          </div>

          <button
            className={`tool er ${tool === "eraser" ? "active" : ""}`}
            title="Eraser"
            onClick={() => setTool("eraser")}
          >
            {/* eraser icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M16.24 3.56L21 8.32a2 2 0 0 1 0 2.83l-7.9 7.9a2 2 0 0 1-1.41.58H6.41a2 2 0 0 1-1.41-.59L3 19.06l8.66-8.66-3.54-3.54 1.41-1.41a2 2 0 0 1 2.83 0z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* drawing area */}
        <div
          className="canvasWrap"
          ref={wrapRef}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
        >
          <canvas ref={canvasRef} className="canvas" />
        </div>

        <div className="actions">
          <button className="btn" onClick={exportPDF}>Export PDF</button>
          <button className="btn ghost" onClick={downloadPNG}>Download PNG</button>
        </div>

        {/* Return button */}
        <div className="return">
          <Link href="/">
            <button className="btn">Return</button>
          </Link>
        </div>
      </div>

      {/* Floating chat widget (UI only) */}
      <div className="chat">
        <div className="chatHead">
          <div className="bubbleAvatar">👤</div>
          <div className="spacer" />
          <button className="headBtn">⤢</button>
          <button className="headBtn">✱</button>
          <button className="headBtn">✖</button>
        </div>
        <div className="chatBody">
          <input className="chatInput" placeholder="Type here!" />
          <button className="sendBtn">✈</button>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #fff;
          display: flex;
          justify-content: center;
          padding-bottom: 140px;
        }
        .container {
          width: 860px;
          padding: 16px 0 0;
          position: relative;
        }
        .brand {
          font-size: 12px;
          color: #666;
          margin-left: 10px;
        }
        .title {
          margin: 16px 10px 12px;
          font-size: 18px;
          font-weight: 700;
        }

        /* Toolbar */
        .toolbar {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f5f5f5;
          border-radius: 24px;
          padding: 6px 10px;
          margin: 0 10px 10px;
        }
        .tool {
          width: 32px;
          height: 28px;
          border: none;
          border-radius: 20px;
          background: #fff;
          color: #333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 1px #ddd;
          cursor: pointer;
        }
        .tool.active {
          box-shadow: inset 0 0 0 2px #111;
        }
        .tool.er {
          margin-left: 8px;
        }
        .colors {
          display: inline-flex;
          gap: 8px;
          margin: 0 6px;
        }
        .swatch {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #ccc;
          cursor: pointer;
        }
        .swatch.sel {
          box-shadow: 0 0 0 2px #111;
        }

        /* Canvas area */
        .canvasWrap {
          margin: 8px 10px 0;
          height: 520px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: auto; /* native scroll bar if drawing big */
          position: relative;
          background: #fff;
        }
        .canvas {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          cursor: crosshair;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin: 14px 10px 0;
        }
        .btn {
          background: #0a0a0a;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12.5px;
          cursor: pointer;
        }
        .btn.ghost {
          background: #fff;
          color: #111;
          border: 1px solid #ddd;
        }
        .return {
          position: fixed;
          left: 16px;
          bottom: 20px;
        }

        /* Chat widget */
        .chat {
          position: fixed;
          right: 22px;
          bottom: 22px;
          width: 340px;
          background: #fff;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          border-radius: 10px;
          overflow: hidden;
        }
        .chatHead {
          height: 36px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          gap: 6px;
          border-bottom: 1px solid #f0f0f0;
          background: #faf7ff;
        }
        .bubbleAvatar {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #e9d5ff;
          color: #6d28d9;
          font-size: 12px;
        }
        .spacer { flex: 1; }
        .headBtn {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 6px;
          width: 24px;
          height: 24px;
          font-size: 12px;
          cursor: pointer;
        }
        .chatBody {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
        }
        .chatInput {
          flex: 1;
          height: 34px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0 10px;
          font-size: 13px;
          outline: none;
        }
        .sendBtn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: none;
          background: #111;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
