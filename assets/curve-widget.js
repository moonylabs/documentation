/* Interactive Moony pricing-curve widget — uses the live onchain constants. */
(function () {
  "use strict";
  var el = document.getElementById("curveWidget");
  if (!el) return;

  // Onchain constants (api/src/consts.rs)
  var A = 11400.230149967394933471;
  var B = 0.000000877175273521;
  var C = B;                      // b == c by design
  var MAXS = 21000000;

  function spot(s) { return A * B * Math.exp(C * s); }            // P(S) = a·b·e^(cS)
  function cost(s0, n) { return A * (Math.exp(C * (s0 + n)) - Math.exp(C * s0)); } // (a·b/c)=a

  // geometry
  var W = 760, H = 360, padL = 70, padR = 22, padT = 22, padB = 40;
  var plotW = W - padL - padR, plotH = H - padT - padB;
  var yMinLog = -2, yMaxLog = 6; // $0.01 .. $1,000,000

  function px(s) { return padL + (s / MAXS) * plotW; }
  function py(p) { var l = Math.log10(Math.max(p, 0.01)); return padT + (1 - (l - yMinLog) / (yMaxLog - yMinLog)) * plotH; }

  function fmtUsd(v) {
    if (v >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
    if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
    if (v >= 1000) return "$" + Math.round(v).toLocaleString();
    if (v >= 1) return "$" + v.toFixed(2);
    return "$" + v.toFixed(4);
  }
  function fmtSupply(s) {
    if (s >= 1e6) return (s / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
    if (s >= 1000) return Math.round(s).toLocaleString();
    return Math.round(s).toString();
  }

  // curve path
  var d = "";
  for (var i = 0; i <= 240; i++) {
    var s = MAXS * i / 240;
    d += (i === 0 ? "M" : "L") + px(s).toFixed(1) + " " + py(spot(s)).toFixed(1);
  }
  var area = d + "L" + px(MAXS).toFixed(1) + " " + (padT + plotH) + "L" + padL + " " + (padT + plotH) + "Z";

  // horizontal gridlines at each decade
  var hg = "", yLabels = "";
  var decades = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  var decadeLabel = { "-2": "$0.01", "-1": "$0.10", "0": "$1", "1": "$10", "2": "$100", "3": "$1K", "4": "$10K", "5": "$100K", "6": "$1M" };
  decades.forEach(function (lg) {
    var yy = (padT + (1 - (lg - yMinLog) / (yMaxLog - yMinLog)) * plotH).toFixed(1);
    hg += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy + '" class="cw-grid"/>';
    yLabels += '<text x="' + (padL - 10) + '" y="' + (parseFloat(yy) + 3.5) + '" class="cw-ylab">' + decadeLabel[lg] + '</text>';
  });
  // vertical ticks
  var vg = "", xLabels = "";
  [0, 7, 14, 21].forEach(function (m) {
    var s = m * 1e6, xx = px(s).toFixed(1);
    vg += '<line x1="' + xx + '" y1="' + padT + '" x2="' + xx + '" y2="' + (padT + plotH) + '" class="cw-grid"/>';
    xLabels += '<text x="' + xx + '" y="' + (padT + plotH + 22) + '" class="cw-xlab">' + (m === 0 ? "0" : m + "M") + '</text>';
  });

  el.innerHTML =
    '<svg class="cw-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' +
        '<linearGradient id="cwStroke" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#FFF2D9"/></linearGradient>' +
        '<linearGradient id="cwFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(139,92,246,0.28)"/><stop offset="1" stop-color="rgba(139,92,246,0)"/></linearGradient>' +
      '</defs>' +
      hg + vg + yLabels + xLabels +
      '<path d="' + area + '" fill="url(#cwFill)"/>' +
      '<path d="' + d + '" fill="none" stroke="url(#cwStroke)" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<line id="cwGuide" x1="0" y1="' + padT + '" x2="0" y2="' + (padT + plotH) + '" class="cw-guide"/>' +
      '<circle id="cwDot" r="6" class="cw-dot"/>' +
    '</svg>' +
    '<div class="cw-readouts">' +
      '<div class="cw-ro"><div class="cw-ro-k">Circulating supply</div><div class="cw-ro-v" id="cwSupply">5,000,000 MNY</div></div>' +
      '<div class="cw-ro"><div class="cw-ro-k">Spot price</div><div class="cw-ro-v cw-grad" id="cwPrice">$0.80</div></div>' +
      '<div class="cw-ro"><div class="cw-ro-k">Cost to buy 1,000 MNY</div><div class="cw-ro-v" id="cwCost">$804</div></div>' +
    '</div>' +
    '<input type="range" class="cw-slider" id="cwSlider" min="0" max="' + MAXS + '" step="1000" value="5000000" aria-label="Circulating supply" />';

  var dot = el.querySelector("#cwDot"),
      guide = el.querySelector("#cwGuide"),
      slider = el.querySelector("#cwSlider"),
      oSup = el.querySelector("#cwSupply"),
      oPri = el.querySelector("#cwPrice"),
      oCost = el.querySelector("#cwCost");

  function update(s) {
    var p = spot(s), gx = px(s), gy = py(p);
    dot.setAttribute("cx", gx.toFixed(1));
    dot.setAttribute("cy", gy.toFixed(1));
    guide.setAttribute("x1", gx.toFixed(1));
    guide.setAttribute("x2", gx.toFixed(1));
    oSup.textContent = fmtSupply(s) + " MNY";
    oPri.textContent = fmtUsd(p);
    oCost.textContent = fmtUsd(cost(s, 1000));
  }
  slider.addEventListener("input", function () { update(parseFloat(slider.value)); });

  // make the chart itself draggable (the dot looks interactive — wire it)
  var svgEl = el.querySelector(".cw-svg");
  var dragging = false;
  function supplyFromEvent(e) {
    var r = svgEl.getBoundingClientRect();
    var cx = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
    var vbX = ((cx - r.left) / r.width) * W;          // back to viewBox space
    var s = ((vbX - padL) / plotW) * MAXS;
    s = Math.max(0, Math.min(MAXS, s));
    s = Math.round(s / 1000) * 1000;
    slider.value = s;
    update(s);
  }
  svgEl.style.cursor = "ew-resize";
  svgEl.addEventListener("mousedown", function (e) { dragging = true; supplyFromEvent(e); e.preventDefault(); });
  window.addEventListener("mousemove", function (e) { if (dragging) supplyFromEvent(e); });
  window.addEventListener("mouseup", function () { dragging = false; });
  svgEl.addEventListener("touchstart", function (e) { supplyFromEvent(e); }, { passive: true });
  svgEl.addEventListener("touchmove", function (e) { supplyFromEvent(e); }, { passive: true });

  update(parseFloat(slider.value));
})();
