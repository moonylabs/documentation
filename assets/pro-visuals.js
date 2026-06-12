/* ============================================================
   Moony — Pro page generated visuals.
   Real pricing curve (live onchain constants) + network render,
   drawn as inline SVG. Colors via style attrs so var() resolves.
   ============================================================ */
(function () {
  "use strict";
  const A = 11400.230149967394933471;
  const B = 0.000000877175273521;
  const C = 0.000000877175273521;
  const MAX = 21000000;
  const spot = (S) => A * B * Math.exp(C * S);

  const Y_MIN = -2, Y_MAX = 6;
  const PAD = { l: 8, r: 8, t: 16, b: 10 };
  const SVGNS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, style) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (style) e.setAttribute("style", style);
    return e;
  }
  const xOf = (S, w) => PAD.l + (S / MAX) * (w - PAD.l - PAD.r);
  var P_MAX = spot(MAX), P_EXP = 0.5;
  function yOf(P, h) {
    var f = Math.pow(Math.max(P, 0) / P_MAX, P_EXP);
    return h - PAD.b - Math.min(1, f) * (h - PAD.t - PAD.b);
  }
  function curvePath(w, h, upto) {
    const N = 180, end = upto == null ? MAX : upto;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const S = (end * i) / N, x = xOf(S, w), y = yOf(spot(S), h);
      d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d;
  }
  const fmtCompact = (x) => x >= 1e6 ? (x / 1e6) + "M" : x >= 1e3 ? (x / 1e3) + "K" : "" + x;

  /* ---------- pricing curve render ---------- */
  function renderCurve(host, opts) {
    opts = opts || {};
    const w = opts.w || 560, h = opts.h || 360;
    const svg = el("svg", { viewBox: "0 0 " + w + " " + h, preserveAspectRatio: "none",
      width: "100%", height: "100%" });
    svg.setAttribute("aria-hidden", "true");

    const defs = el("defs", {});
    defs.innerHTML =
      '<linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" style="stop-color:#D8C5FD;stop-opacity:0.28"/>' +
      '<stop offset="100%" style="stop-color:#D8C5FD;stop-opacity:0"/></linearGradient>' +
      '<linearGradient id="pvLine" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0%" style="stop-color:#D8C5FD"/>' +
      '<stop offset="100%" style="stop-color:#FFF2D9"/></linearGradient>';
    svg.appendChild(defs);

    // horizontal gridlines (even spacing)
    for (let i = 0; i <= 4; i++) {
      const y = PAD.t + (i / 4) * (h - PAD.t - PAD.b);
      svg.appendChild(el("line", { x1: 0, y1: y, x2: w, y2: y, "vector-effect": "non-scaling-stroke" },
        "stroke:rgba(231,217,253,0.07);stroke-width:1"));
    }
    // price context labels (top / bottom)
    [["$1M", PAD.t + 11], ["$0", h - PAD.b - 4]].forEach(function (L) {
      const t = el("text", { x: 6, y: L[1] }, "fill:rgba(231,217,253,0.4);font:10px/1 'JetBrains Mono',monospace");
      t.textContent = L[0]; svg.appendChild(t);
    });
    // supply x labels
    [0, 7e6, 14e6, 21e6].forEach((S) => {
      const x = xOf(S, w);
      const t = el("text", { x: Math.min(x, w - 20), y: h - 2 },
        "fill:rgba(231,217,253,0.4);font:10px/1 'JetBrains Mono',monospace");
      t.textContent = S === 0 ? "0" : fmtCompact(S);
      svg.appendChild(t);
    });

    // area + line
    svg.appendChild(el("path", { d: curvePath(w, h) + `L${xOf(MAX, w)} ${h} L${xOf(0, w)} ${h} Z` }, "fill:url(#pvFill)"));
    svg.appendChild(el("path", { d: curvePath(w, h), "vector-effect": "non-scaling-stroke",
      "stroke-linecap": "round" }, "fill:none;stroke:url(#pvLine);stroke-width:2.4"));
    // milestone dots
    [3e6, 9e6, 15e6, 21e6].forEach((S) => {
      svg.appendChild(el("circle", { cx: xOf(S, w), cy: yOf(spot(S), h), r: 3,
        "vector-effect": "non-scaling-stroke" }, "fill:#FFF2D9"));
    });
    host.appendChild(svg);
  }

  /* ---------- curve hero: large annotated curve (overlays in HTML) ---------- */
  function renderCurveHero(host, opts) {
    opts = opts || {};
    const w = opts.w || 1000, h = opts.h || 440;
    const svg = el("svg", { viewBox: "0 0 " + w + " " + h, preserveAspectRatio: "none", width: "100%", height: "100%" });
    svg.setAttribute("aria-hidden", "true");
    const defs = el("defs", {});
    defs.innerHTML =
      '<linearGradient id="chFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" style="stop-color:#D8C5FD;stop-opacity:0.30"/>' +
      '<stop offset="100%" style="stop-color:#D8C5FD;stop-opacity:0"/></linearGradient>' +
      '<linearGradient id="chLine" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0%" style="stop-color:#D8C5FD"/>' +
      '<stop offset="100%" style="stop-color:#FFF2D9"/></linearGradient>';
    svg.appendChild(defs);
    for (let i = 0; i <= 4; i++) {
      const y = PAD.t + (i / 4) * (h - PAD.t - PAD.b);
      svg.appendChild(el("line", { x1: 0, y1: y, x2: w, y2: y, "vector-effect": "non-scaling-stroke" }, "stroke:rgba(231,217,253,0.06);stroke-width:1"));
    }
    svg.appendChild(el("path", { d: curvePath(w, h) + `L${xOf(MAX, w)} ${h} L${xOf(0, w)} ${h} Z` }, "fill:url(#chFill)"));
    svg.appendChild(el("path", { d: curvePath(w, h), "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" }, "fill:none;stroke:#a78bfa;stroke-width:8;opacity:0.30;filter:blur(6px)"));
    svg.appendChild(el("path", { d: curvePath(w, h), "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" }, "fill:none;stroke:url(#chLine);stroke-width:2.6"));
    [0, 5e6, 10e6, 15e6, 21e6].forEach((S) => {
      svg.appendChild(el("circle", { cx: xOf(S, w), cy: yOf(spot(S), h), r: 3.4, "vector-effect": "non-scaling-stroke" }, "fill:#FFF2D9"));
    });
    host.appendChild(svg);
  }

  function renderNetwork(host, opts) {
    opts = opts || {};
    const w = opts.w || 420, h = opts.h || 420;
    const svg = el("svg", { viewBox: "0 0 " + w + " " + h, width: "100%", height: "100%" });
    svg.setAttribute("aria-hidden", "true");
    // deterministic pseudo-random
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const nodes = [];
    const cols = 5, rows = 5, mx = 60, my = 60;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      nodes.push({
        x: mx + c * ((w - 2 * mx) / (cols - 1)) + (rnd() - 0.5) * 34,
        y: my + r * ((h - 2 * my) / (rows - 1)) + (rnd() - 0.5) * 34,
        hot: rnd() > 0.72
      });
    }
    // edges to nearest neighbours
    for (let i = 0; i < nodes.length; i++) {
      const d = nodes.map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      d.forEach((o) => {
        if (o.j > i) svg.appendChild(el("line",
          { x1: nodes[i].x, y1: nodes[i].y, x2: nodes[o.j].x, y2: nodes[o.j].y, "vector-effect": "non-scaling-stroke" },
          "stroke:rgba(231,217,253,0.14);stroke-width:1"));
      });
    }
    const defs = el("defs", {});
    defs.innerHTML = '<radialGradient id="pvNode"><stop offset="0%" style="stop-color:#FFF2D9"/>' +
      '<stop offset="100%" style="stop-color:#a78bfa"/></radialGradient>';
    svg.appendChild(defs);
    nodes.forEach((n) => {
      if (n.hot) svg.appendChild(el("circle", { cx: n.x, cy: n.y, r: 16, "vector-effect": "non-scaling-stroke" },
        "fill:rgba(167,139,250,0.10)"));
      svg.appendChild(el("circle", { cx: n.x, cy: n.y, r: n.hot ? 5 : 3, "vector-effect": "non-scaling-stroke" },
        n.hot ? "fill:url(#pvNode)" : "fill:rgba(231,217,253,0.45)"));
    });
    host.appendChild(svg);
  }

  /* ---------- hero: pricing curve rising through a binary field ---------- */
  function renderHero(host) {
    const w = 960, h = 540;
    // binary backdrop
    const bin = document.createElement("div");
    bin.className = "ap-hero-bin";
    let s = "";
    for (let r = 0; r < 16; r++) {
      let line = "";
      for (let c = 0; c < 66; c++) {
        const roll = Math.random();
        const ch = roll < 0.05 ? "⍜" : (Math.random() < 0.5 ? "0" : "1");
        line += Math.random() < 0.06 ? '<span class="hi">' + ch + "</span>" : ch;
      }
      s += line + "\n";
    }
    bin.innerHTML = s;
    host.appendChild(bin);

    // curve overlay (no axes) with glow
    const svg = el("svg", { viewBox: "0 0 " + w + " " + h, preserveAspectRatio: "none",
      width: "100%", height: "100%" });
    svg.setAttribute("class", "ap-hero-curve");
    svg.setAttribute("aria-hidden", "true");
    const defs = el("defs", {});
    defs.innerHTML =
      '<linearGradient id="hvFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" style="stop-color:#D8C5FD;stop-opacity:0.22"/>' +
      '<stop offset="100%" style="stop-color:#D8C5FD;stop-opacity:0"/></linearGradient>' +
      '<linearGradient id="hvLine" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0%" style="stop-color:#D8C5FD"/>' +
      '<stop offset="55%" style="stop-color:#c4b3f5"/>' +
      '<stop offset="100%" style="stop-color:#FFF2D9"/></linearGradient>';
    svg.appendChild(defs);
    svg.appendChild(el("path", { d: curvePath(w, h) + `L${xOf(MAX, w)} ${h} L${xOf(0, w)} ${h} Z` }, "fill:url(#hvFill)"));
    // soft glow underlay
    svg.appendChild(el("path", { d: curvePath(w, h), "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" },
      "fill:none;stroke:#a78bfa;stroke-width:9;opacity:0.35;filter:blur(7px)"));
    svg.appendChild(el("path", { d: curvePath(w, h), "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" },
      "fill:none;stroke:url(#hvLine);stroke-width:3"));
    [3e6, 9e6, 15e6, 21e6].forEach((S) => {
      svg.appendChild(el("circle", { cx: xOf(S, w), cy: yOf(spot(S), h), r: 3.4, "vector-effect": "non-scaling-stroke" },
        "fill:#FFF2D9"));
    });
    host.appendChild(svg);
  }

  function init() {
    document.querySelectorAll("[data-viz]").forEach((host) => {
      const t = host.getAttribute("data-viz");
      const w = +host.getAttribute("data-w") || undefined;
      const h = +host.getAttribute("data-h") || undefined;
      if (t === "curve") renderCurve(host, { w, h });
      else if (t === "curve-hero") renderCurveHero(host, { w, h });
      else if (t === "network") renderNetwork(host, { w, h });
      else if (t === "hero") renderHero(host);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
