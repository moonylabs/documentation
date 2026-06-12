/* ============================================================
   Moony Docs, shared nav system.
   Injects topbar + left sidebar tree + right "on this page" rail.
   A page declares which doc it is via <body data-doc-page="id">.
   Add a page = add one entry to NAV + a content file.
   ============================================================ */
(function () {
  "use strict";

  var NAV = [
    { group: "Get started", items: [
      { id: "introduction", title: "Welcome", href: "/docs" }
    ]}, { group: "Moony Protocol", items: [
      { id: "protocol-overview", title: "Overview", href: "/docs/protocol/overview" }, { id: "mny", title: "Moony (MNY)", href: "/docs/protocol/mny" }, { id: "reserve", title: "The Reserve", href: "/docs/protocol/reserve" }, { id: "curve", title: "Pricing curve", href: "/docs/protocol/pricing-curve" }
    ]}, { group: "Moony Economy", items: [
      { id: "economy-overview", title: "Overview", href: "/docs/economy/overview" }, { id: "p2p", title: "P2P payments", href: "/docs/economy/p2p" }, { id: "micro", title: "Micropayments", href: "/docs/economy/micropayments" }, { id: "capital", title: "Capital markets", href: "/docs/economy/capital" }
    ]}, { group: "Moony Network", items: [
      { id: "network-overview", title: "Overview", href: "/docs/network/overview" }, { id: "stakeholders", title: "Stakeholders", href: "/docs/network/stakeholders" }, { id: "incentives", title: "Incentives", href: "/docs/network/incentives" }
    ]}, { group: "Developers", items: [
      { id: "architecture", title: "Architecture", href: "/docs/developers/architecture" }, { id: "cli", title: "CLI reference", href: "/docs/developers/cli" }, { id: "sdk", title: "SDK", soon: true }
    ]}, { group: "Resources", items: [
      { id: "branding", title: "Branding", href: "/docs/resources/branding" }
    ]}
  ];

  var GLYPH = '<svg class="dx-glyph" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="dxg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#D8C5FD"/><stop offset="1" stop-color="#FFF2D9"/></linearGradient></defs>' +
    '<rect width="32" height="32" rx="7" fill="#15111f"/>' +
    '<circle cx="16" cy="14" r="5.6" fill="none" stroke="url(#dxg)" stroke-width="2.6"/>' +
    '<rect x="9.2" y="22.4" width="13.6" height="2.6" rx="1.3" fill="url(#dxg)"/></svg>';

  var current = document.body.getAttribute("data-doc-page") || "";

  // per-page metadata chips (Apple availability-badge pattern)
  var META = {
    "protocol-overview": ["Solana", "Immutable program"],
    "branding": ["Logo", "Color", "Usage"],
    "architecture": ["Accounts", "PDAs", "Instructions"], "mny": ["SPL · Solana", "21M fixed", "10 decimals"], "reserve": ["100% backed", "0% / 1% fees", "Immutable"], "curve": ["Deterministic", "Onchain", "No order books"], "economy-overview": ["Permissionless", "Composable"], "p2p": ["Instant", "Zero-fee P2P", "Final settlement"], "micro": ["Sub-cent", "10 decimals", "Solana fees"], "capital": ["Onchain settlement", "Capital-backed"], "network-overview": ["Decentralized", "Permissionless"], "stakeholders": ["Open participation", "No gatekeepers"], "incentives": ["Network effects", "Organic growth"]
  };

  // ---------- topbar ----------
  function topbar() {
    var el = document.createElement("header");
    el.className = "dx-topbar";
    el.innerHTML =
      '<div class="dx-topbar-in">' +
        '<button class="dx-burger" aria-label="Open navigation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
        '<a class="dx-brand" href="/">' +
          '<img class="dx-wm" src="/assets/moony-wordmark.svg" alt="moony" />' +
          '<span class="dx-doctag">Docs</span>' +
        '</a>' +
        '<label class="dx-search">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="text" id="dxSearch" placeholder="Search the docs" autocomplete="off" />' +
          '<span class="kbd">/</span>' +
        '</label>' +
        '<nav class="dx-top-links">' +
          '<div class="dx-copygrp">' +
            '<button class="dx-copypage" type="button" aria-label="Copy page as Markdown" title="Copy this page as Markdown for LLMs">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>' +
              '<span class="dx-cp-label">Copy page</span></button>' +
            '<button class="dx-copycaret" type="button" aria-label="More copy options" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>' +
            '<div class="dx-copymenu" hidden>' +
              '<button class="dx-cmi" type="button" data-act="copy"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></span><span class="tx"><b>Copy page</b><i>Copy page as Markdown for LLMs</i></span></button>' +
              '<a class="dx-cmi" data-act="viewmd" target="_blank" rel="noopener"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15V9l2.5 3L12 9v6M16 9v4M14.5 13.5 16 15l1.5-1.5"/></svg></span><span class="tx"><b>View as Markdown<svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></b><i>View this page as plain text</i></span></a>' +
              '<a class="dx-cmi" data-act="chatgpt" target="_blank" rel="noopener"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 1 3.7 2.5A4 4 0 0 1 19 9a4 4 0 0 1-1 5 4 4 0 0 1-3.7 4.5A4 4 0 0 1 12 21a4 4 0 0 1-3.3-1.5A4 4 0 0 1 5 14a4 4 0 0 1 1-5 4 4 0 0 1 3.7-4.5A4 4 0 0 1 12 3Z"/><path d="m9 12 2 1.2L15 11"/></svg></span><span class="tx"><b>Open in ChatGPT<svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></b><i>Ask questions about this page</i></span></a>' +
              '<a class="dx-cmi" data-act="claude" target="_blank" rel="noopener"><span class="ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.4l1.7 4.6 4.6-1.7-1.7 4.7 4.6 1.7-4.6 1.7 1.7 4.7-4.6-1.7L12 21.6l-1.7-4.6-4.6 1.7 1.7-4.7L2.8 12.3l4.6-1.7L5.7 5.9l4.6 1.7L12 2.4z"/></svg></span><span class="tx"><b>Open in Claude<svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></b><i>Ask questions about this page</i></span></a>' +
              '<a class="dx-cmi" data-act="perplexity" target="_blank" rel="noopener"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3.5 8.5 12 13l8.5-4.5M3.5 15.5 12 11l8.5 4.5"/></svg></span><span class="tx"><b>Open in Perplexity<svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></b><i>Ask questions about this page</i></span></a>' +
            '</div>' +
          '</div>' +
          '<a href="https://x.com/moonylabs" target="_blank" rel="noopener" aria-label="X (Twitter)">' +
            '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.6 0h2.45l-5.35 6.12L16 16h-4.93l-3.86-5.05L2.7 16H.25l5.72-6.54L0 0h5.05l3.49 4.61L12.6 0Zm-.86 14.55h1.36L4.32 1.37H2.86l8.88 13.18Z"/></svg>' +
            '</a>' +
          '<a href="https://github.com/moonylabs" target="_blank" rel="noopener" aria-label="GitHub">' +
            '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>' +
            '</a>' +
        '</nav>' +
      '</div>';
    return el;
  }

  // ---------- sidebar icons (small monochrome line glyphs per page) ----------
  var NAV_ICONS = {
    "introduction": '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    "protocol-overview": '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    "mny": '<circle cx="12" cy="10" r="5.5"/><path d="M5.5 19h13"/>',
    "reserve": '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.2"/><path d="M12 8.8v-1M12 16.2v-1"/>',
    "curve": '<path d="M3 3v18h18M7 15c3-9 7-10 13-11"/>',
    "economy-overview": '<path d="M3 9 4 4h16l1 5M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16"/>',
    "p2p": '<path d="M4 9h13l-3-3M20 15H7l3 3"/>',
    "micro": '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3M3 12v5c0 1.7 2.7 3 6 3"/><circle cx="16" cy="15" r="5"/>',
    "capital": '<path d="M3 17 9 11l4 4 8-8M16 7h5v5"/>',
    "network-overview": '<circle cx="12" cy="5" r="2.3"/><circle cx="5" cy="19" r="2.3"/><circle cx="19" cy="19" r="2.3"/><path d="M12 7.3v3.4M10.2 13l-3.4 4M13.8 13l3.4 4"/>',
    "stakeholders": '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5.8M18 20a5.5 5.5 0 0 0-3-4.9"/>',
    "incentives": '<path d="M12 21v-7M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5ZM12 12c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z"/>',
    "architecture": '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a2 2 0 0 1 2 2v5.5"/>',
    "cli": '<path d="m7 8-4 4 4 4M13 8l4 4-4 4"/>',
    "sdk": '<path d="M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8"/>',
    "branding": '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20 2.5 2.5 0 0 0 2-4 2.5 2.5 0 0 1 2-4h2a4 4 0 0 0 4-4 10 10 0 0 0-10-8Z"/>'
  };
  function navIcon(id) {
    var p = NAV_ICONS[id]; if (!p) return "";
    return '<span class="dx-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg></span>";
  }

  // ---------- sidebar tree ----------
  function sidebarHTML() {
    var html = "";
    NAV.forEach(function (g) {
      html += '<div class="dx-group"><div class="dx-group-t">' + g.group + '</div><ul>';
      g.items.forEach(function (it) {
        if (it.soon) {
          html += '<li><a class="soon">' + navIcon(it.id) + it.title + '</a></li>';
        } else {
          var active = it.id === current ? " active" : "";
          html += '<li><a class="' + active.trim() + '" href="' + it.href + '">' + navIcon(it.id) + it.title + '</a></li>';
        }
      });
      html += '</ul></div>';
    });
    return html;
  }

  // ---------- right rail: build from h2[id] / h3[id] ----------
  function labelFor(el) {
    if (el.getAttribute("data-otp")) return el.getAttribute("data-otp");
    var src = el;
    if (el.classList.contains("doc-section")) src = el.querySelector("h2") || el;
    var clone = src.cloneNode(true);
    clone.querySelectorAll(".sn").forEach(function (n) { n.remove(); });
    return clone.textContent.replace(/\s*·.*$/, "").trim();
  }
  function buildOnThisPage(otp) {
    var main = document.querySelector(".dx-main");
    if (!main || !otp) return [];
    var raw = main.querySelectorAll("h2[id], h3[id], .doc-section[id]");
    var heads = [].slice.call(raw).filter(function (el) {
      // skip a section that has no heading of its own (the intro section)
      if (el.classList.contains("doc-section")) return !!el.querySelector("h2");
      return true;
    });
    if (!heads.length) { otp.style.display = "none"; return []; }
    var html = '<div class="dx-otp-t">On this page</div><ul class="dx-otp">';
    heads.forEach(function (h) {
      var sub = h.tagName === "H3" ? " sub" : "";
      html += '<li><a class="' + sub.trim() + '" href="#' + h.id + '">' + labelFor(h) + '</a></li>';
    });
    html += "</ul>";
    otp.innerHTML = html;
    return [].slice.call(heads);
  }

  // ---------- mount ----------
  var layout = document.querySelector(".dx-layout");
  document.body.insertBefore(topbar(), document.body.firstChild);

  var scrim = document.createElement("div");
  scrim.className = "dx-scrim";
  (document.querySelector(".dx-layout") || document.body).appendChild(scrim);

  // ---------- site footer (injected on every docs page) ----------
  (function () {
    var f = document.createElement("footer");
    f.className = "dx-sitefoot";
    f.innerHTML =
      '<div class="dx-sitefoot-in">' +
        '<div class="dx-foot-top">' +
          '<div class="dx-foot-brandcol">' +
            '<a class="dx-foot-brand" href="/"><img src="/assets/moony-wordmark.svg" alt="moony" /></a>' +
            '<span class="dx-foot-tag">Open money, governed by code</span>' +
            '<span class="dx-foot-social">' +
              '<a href="https://github.com/moonylabs" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg></a>' +
              '<a href="https://x.com/moonylabs" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.6 0h2.45l-5.36 6.12L16 16h-4.94l-3.87-5.06L2.76 16H.31l5.73-6.55L0 0h5.06l3.5 4.63L12.6 0Zm-.86 14.55h1.36L4.32 1.38H2.86l8.88 13.17Z"/></svg></a>' +
            '</span>' +
          '</div>' +
          '<nav class="dx-foot-col"><h4>Protocol</h4>' +
            '<a href="/docs/protocol/overview">Overview</a>' +
            '<a href="/docs/protocol/reserve">The Reserve</a>' +
            '<a href="/docs/protocol/pricing-curve">Pricing curve</a>' +
          '</nav>' +
          '<nav class="dx-foot-col"><h4>Build</h4>' +
            '<a href="/docs/developers/cli">CLI reference</a>' +
            '<a href="/docs/developers/architecture">Architecture</a>' +
            '<a href="https://explorer.solana.com/address/5Ztd1ECKq4cXYt7BiRXK999hK2eQqtjJF9J3F1zw2jYC" target="_blank" rel="noopener">Verify onchain</a>' +
          '</nav>' +
          '<nav class="dx-foot-col"><h4>Resources</h4>' +
            '<a href="/docs">Docs</a>' +
            '<a href="/docs/resources/branding">Branding</a>' +
            '<a href="/docs/resources/disclaimer">Disclaimer</a>' +
          '</nav>' +
        '</div>' +
        '<p>Moony was created by Moony Labs, LLC as a digital public good. Once deployed, the protocol runs independently and evolves through open participation; Moony Labs neither operates nor controls it. This site is informational only and is not financial advice or an offer to sell any asset. See the <a href="/docs/resources/disclaimer">Disclaimer</a>. © 2026 Moony Labs, LLC.</p>' +
      '</div>';
    document.body.appendChild(f);
    // de-dupe: drop the per-page copyright span, keep the GitHub edit link
    document.querySelectorAll(".dx-foot > span").forEach(function (s) { s.remove(); });
  })();

  var sidebar = document.querySelector(".dx-sidebar");
  if (sidebar) sidebar.innerHTML = sidebarHTML();
  var otp = document.querySelector(".dx-onthispage");
  var heads = buildOnThisPage(otp);

  // ---------- lockups: pair each squircle beside its heading ----------
  (function () {
    var main = document.querySelector(".dx-main");
    if (!main) return;

    // hero: first squircle pairs with the page title (h1 + eyebrow)
    var sym = main.querySelector(".doc-section .dx-feature-panel");
    var h1 = main.querySelector(":scope > h1");
    var eyebrow = main.querySelector(":scope > .dx-eyebrow");
    if (sym && h1 && !main.querySelector(".dx-appicon")) {
      var lock = document.createElement("div");
      lock.className = "dx-herolock";
      var txt = document.createElement("div");
      txt.className = "dx-herotext";
      if (eyebrow) txt.appendChild(eyebrow);
      txt.appendChild(h1);
      lock.appendChild(sym);
      lock.appendChild(txt);
      var crumb = main.querySelector(":scope > .crumb");
      if (crumb) crumb.parentNode.insertBefore(lock, crumb.nextSibling);
      else main.insertBefore(lock, main.firstChild);
    }

    // section squircles: pair beside their own h2
    main.querySelectorAll(".doc-section").forEach(function (sec) {
      var panel = sec.querySelector(":scope > .dx-feature-panel");
      var h2 = sec.querySelector(":scope > h2");
      if (!panel || !h2) return;
      var slock = document.createElement("div");
      slock.className = "dx-seclock";
      slock.appendChild(panel);   // icon first
      h2.parentNode.insertBefore(slock, h2);
      slock.appendChild(h2);      // then heading
    });
  })();

  // ---------- heading anchor links (hover-reveal #, click copies deep link) ----------
  (function () {
    var hs = document.querySelectorAll(".dx-main .doc-section[id], .dx-main h2[id], .dx-main h3[id]");
    hs.forEach(function (el) {
      var id = el.id, target = el;
      if (el.classList.contains("doc-section")) { target = el.querySelector("h2"); if (!target) return; }
      if (target.querySelector(".dx-anchor")) return;
      var a = document.createElement("a");
      a.className = "dx-anchor"; a.href = "#" + id; a.setAttribute("aria-label", "Link to this section");
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15 15 9M11 6l1-1a4 4 0 0 1 6 6l-1 1M13 18l-1 1a4 4 0 0 1-6-6l1-1"/></svg>';
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var url = location.href.split("#")[0] + "#" + id;
        history.replaceState(null, "", "#" + id);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
          a.classList.add("ok"); setTimeout(function () { a.classList.remove("ok"); }, 1400);
        });
      });
      target.appendChild(a);
    });
  })();

  // inject metadata chips under the H1
  (function () {
    var chips = META[current];
    var main = document.querySelector(".dx-main");
    if (!chips || !main) return;
    var lead = main.querySelector(":scope > .dx-lead");
    var ref = lead || main.querySelector(".dx-herolock") || main.querySelector(":scope > h1");
    if (!ref) return;
    var row = document.createElement("div");
    row.className = "dx-meta";
    row.innerHTML = chips.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("");
    ref.parentNode.insertBefore(row, ref.nextSibling);
  })();

  // ---------- copy page as Markdown (for LLMs) ----------
  (function () {
    var btn = document.querySelector(".dx-copypage");
    var main = document.querySelector(".dx-main");
    if (!btn || !main) return;

    function txt(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
    function inlineMd(el) {
      // convert a copy, turning <a> into [text](href) and <code> into `code`
      var clone = el.cloneNode(true);
      clone.querySelectorAll(".dx-anchor").forEach(function (a) { a.remove(); });
      clone.querySelectorAll("a").forEach(function (a) {
        var href = a.getAttribute("href") || "";
        a.replaceWith(document.createTextNode("[" + (a.textContent || "").trim() + "](" + href + ")"));
      });
      clone.querySelectorAll("code").forEach(function (c) {
        c.replaceWith(document.createTextNode("`" + (c.textContent || "").trim() + "`"));
      });
      return (clone.textContent || "").replace(/\s+/g, " ").trim();
    }

    function buildMarkdown() {
      var lines = [];
      var h1 = main.querySelector("h1");
      if (h1) lines.push("# " + txt(h1), "");
      var lead = main.querySelector(".dx-lead");
      if (lead) lines.push(inlineMd(lead), "");

      main.querySelectorAll(".doc-section").forEach(function (sec) {
        // walk direct-ish children in order
        sec.querySelectorAll(":scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > .callout, :scope > .term, :scope > .principles, :scope > .doc-table, :scope > .dx-flow, :scope > .dx-stats, :scope > .formula").forEach(function (el) {
          if (el.matches("h2")) lines.push("", "## " + txt(el).replace(/^#\s*/, ""), "");
          else if (el.matches("h3")) lines.push("", "### " + txt(el), "");
          else if (el.matches("p")) lines.push(inlineMd(el), "");
          else if (el.matches("ul")) { el.querySelectorAll(":scope > li").forEach(function (li) { lines.push("- " + inlineMd(li)); }); lines.push(""); }
          else if (el.matches(".callout")) { var b = el.querySelector(".cbody") || el; lines.push("> " + inlineMd(b), ""); }
          else if (el.matches(".term")) {
            var title = txt(el.querySelector(".ttitle")), body = el.querySelector(".term-body");
            lines.push("```" + (title ? " " + title : ""), body ? body.textContent.replace(/\u00a0/g, " ").replace(/[ \t]+$/gm, "") : "", "```", "");
          }
          else if (el.matches(".principles")) {
            el.querySelectorAll(".principle").forEach(function (pr) {
              var h = pr.querySelector("h3"), p = pr.querySelector("p");
              if (h) lines.push("**" + txt(h) + "** — " + (p ? inlineMd(p) : ""));
            });
            lines.push("");
          }
          else if (el.matches(".dx-stats")) {
            el.querySelectorAll(".dx-stat").forEach(function (st) { lines.push("- **" + txt(st.querySelector(".v")) + "** " + txt(st.querySelector(".k"))); });
            lines.push("");
          }
          else if (el.matches(".doc-table")) {
            el.querySelectorAll(".dt-row").forEach(function (r) { var cells = [].slice.call(r.children).map(function (c) { return txt(c); }); lines.push("| " + cells.join(" | ") + " |"); });
            lines.push("");
          }
          else if (el.matches(".dx-flow, .formula")) { lines.push(inlineMd(el), ""); }
        });
      });
      var url = location.href.split("#")[0];
      return "# " === lines[0] ? lines.join("\n") : (lines.join("\n") + "\n\n---\nSource: " + url + "\n").replace(/\n{3,}/g, "\n\n");
    }

    function flash(label) { var l = btn.querySelector(".dx-cp-label"); var old = l ? l.textContent : ""; btn.classList.add("ok"); if (l) l.textContent = label || "Copied"; setTimeout(function () { btn.classList.remove("ok"); if (l) l.textContent = old; }, 1500); }
    function copyMd() {
      var md = buildMarkdown();
      function done() { flash("Copied"); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(md).then(done, done);
      else { var ta = document.createElement("textarea"); ta.value = md; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); done(); }
    }
    btn.addEventListener("click", copyMd);

    // ----- dropdown menu -----
    var caret = document.querySelector(".dx-copycaret");
    var menu = document.querySelector(".dx-copymenu");
    var pageUrl = location.href.split("#")[0];
    var aiPrompt = "Read this documentation page and help me with questions about it: " + pageUrl;
    function setLinks() {
      var copyItem = menu.querySelector('[data-act="copy"]');
      var viewmd = menu.querySelector('[data-act="viewmd"]');
      var cg = menu.querySelector('[data-act="chatgpt"]');
      var cl = menu.querySelector('[data-act="claude"]');
      var px = menu.querySelector('[data-act="perplexity"]');
      // View as Markdown: blob of the generated markdown
      try {
        var blob = new Blob([buildMarkdown()], { type: "text/markdown" });
        viewmd.setAttribute("href", URL.createObjectURL(blob));
      } catch (e) { viewmd.removeAttribute("href"); }
      cg.setAttribute("href", "https://chatgpt.com/?q=" + encodeURIComponent(aiPrompt));
      cl.setAttribute("href", "https://claude.ai/new?q=" + encodeURIComponent(aiPrompt));
      px.setAttribute("href", "https://www.perplexity.ai/search?q=" + encodeURIComponent(aiPrompt));
    }
    function openMenu() { setLinks(); menu.hidden = false; caret.setAttribute("aria-expanded", "true"); document.body.classList.add("dx-copy-open"); }
    function closeMenu() { menu.hidden = true; caret.setAttribute("aria-expanded", "false"); document.body.classList.remove("dx-copy-open"); }
    if (caret && menu) {
      caret.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden ? openMenu() : closeMenu(); });
      menu.querySelector('[data-act="copy"]').addEventListener("click", function () { copyMd(); closeMenu(); });
      menu.querySelectorAll("a.dx-cmi").forEach(function (a) { a.addEventListener("click", function () { closeMenu(); }); });
      document.addEventListener("click", function (e) { if (!e.target.closest(".dx-copygrp")) closeMenu(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    }
  })();

  // ---------- mobile nav toggle ----------
  var burger = document.querySelector(".dx-burger");
  function closeNav() { document.body.classList.remove("dx-nav-open"); }
  if (burger) burger.addEventListener("click", function () { document.body.classList.toggle("dx-nav-open"); });
  scrim.addEventListener("click", closeNav);
  if (sidebar) sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });

  // ---------- scrollspy for right rail ----------
  if (heads.length && "IntersectionObserver" in window) {
    var links = {};
    otp.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var cur = null;
    function setActive(id) {
      if (id === cur) return; cur = id;
      otp.querySelectorAll("a").forEach(function (a) { a.classList.remove("active"); });
      if (links[id]) links[id].classList.add("active");
    }
    var io = new IntersectionObserver(function (ents) {
      var vis = ents.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (vis.length) setActive(vis[0].target.id);
    }, { rootMargin: "-66px 0px -70% 0px", threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
  }

  // ---------- search: full-content search across pages ----------
  // ---------- search: full-text search over the generated index ----------
  var IDX = window.DX_SEARCH_INDEX || [];
  var search = document.getElementById("dxSearch");
  var results = null;
  if (search) {
    results = document.createElement("div");
    results.className = "dx-results"; results.hidden = true;
    search.parentNode.appendChild(results);
    var sel = -1, current = [];

    function esc(t) { return t.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
    function hlTerms(text, terms) {
      var out = esc(text), low = text.toLowerCase();
      // build a single regex of terms, escape regex chars
      var safe = terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).filter(Boolean);
      if (!safe.length) return out;
      try {
        var re = new RegExp("(" + safe.join("|") + ")", "ig");
        return esc(text).replace(re, "<mark>$1</mark>");
      } catch (e) { return out; }
    }
    function snippet(text, terms) {
      var low = text.toLowerCase(), pos = -1;
      for (var i = 0; i < terms.length; i++) { var p = low.indexOf(terms[i]); if (p > -1 && (pos < 0 || p < pos)) pos = p; }
      if (pos < 0) return text.slice(0, 150) + (text.length > 150 ? "…" : "");
      var start = Math.max(0, pos - 60), end = Math.min(text.length, pos + 110);
      return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    }

    function run() {
      var q = search.value.trim().toLowerCase();
      if (q.length < 2) { results.hidden = true; current = []; return; }
      var terms = q.split(/\s+/).filter(function (t) { return t.length > 1; });
      if (!terms.length) terms = [q];
      var hits = [];
      IDX.forEach(function (e) {
        var title = (e.s || e.p).toLowerCase(), page = e.p.toLowerCase(), body = (e.t || "").toLowerCase();
        var score = 0, matched = 0;
        terms.forEach(function (t) {
          var m = false;
          if (title.indexOf(t) > -1) { score += 8; m = true; }
          if (page.indexOf(t) > -1) { score += 3; m = true; }
          if (body.indexOf(t) > -1) { score += 2; m = true; }
          if (m) matched++;
        });
        if (title.indexOf(q) > -1) score += 6;
        if (body.indexOf(q) > -1) score += 3;
        if (matched < terms.length && terms.length > 1) score -= 3; // prefer full matches
        if (score > 0 && matched > 0) hits.push({ e: e, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      // cap to 2 per page, 8 total
      var perPage = {}, capped = [];
      for (var i = 0; i < hits.length && capped.length < 8; i++) {
        var f = hits[i].e.f; perPage[f] = (perPage[f] || 0) + 1;
        if (perPage[f] <= 2) capped.push(hits[i]);
      }
      current = capped; sel = capped.length ? 0 : -1;
      if (!capped.length) { results.innerHTML = '<div class="dx-nores">No results for &ldquo;' + esc(search.value) + '&rdquo;</div>'; results.hidden = false; return; }
      results.innerHTML = capped.map(function (r, i) {
        var e = r.e, href = e.f + (e.a ? "#" + e.a : "");
        var ctx = e.g + (e.s ? " · " + e.p : "");
        return '<a class="dx-result' + (i === 0 ? " sel" : "") + '" href="' + href + '" data-i="' + i + '">' +
          '<span class="rg">' + esc(ctx) + '</span>' +
          '<span class="rt">' + hlTerms(e.s || e.p, terms) + '</span>' +
          '<span class="rs">' + hlTerms(snippet(e.t || "", terms), terms) + '</span></a>';
      }).join("");
      results.hidden = false;
    }
    function move(d) {
      if (!current.length) return;
      var links = results.querySelectorAll(".dx-result");
      if (sel > -1 && links[sel]) links[sel].classList.remove("sel");
      sel = (sel + d + links.length) % links.length;
      links[sel].classList.add("sel");
      links[sel].scrollIntoView({ block: "nearest" });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    });
    search.addEventListener("keydown", function (e) {
      if (results.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { var l = results.querySelectorAll(".dx-result")[sel]; if (l) { e.preventDefault(); location.href = l.getAttribute("href"); } }
      else if (e.key === "Escape") { results.hidden = true; search.blur(); }
    });
    search.addEventListener("input", run);
    search.addEventListener("focus", function () { if (search.value.trim().length >= 2) run(); });
    document.addEventListener("click", function (e) { if (!e.target.closest(".dx-search")) results.hidden = true; });
  }

  // ---------- scroll reveal (rAF; CSS transitions are frozen in some previews) ----------
  (function reveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window) || !window.requestAnimationFrame) return;
    var main = document.querySelector(".dx-main");
    if (!main) return;

    function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
    function tween(el, dur, delay) {
      el.style.opacity = "0"; el.style.transform = "translateY(22px)"; el.style.willChange = "opacity, transform";
      var done = false;
      function finish() { if (done) return; done = true; el.style.willChange = ""; el.style.transform = ""; el.style.opacity = ""; }
      setTimeout(function () {
        var s = performance.now();
        (function f(now) {
          if (done) return;
          var p = Math.min(1, (now - s) / dur), e = easeOut(p);
          el.style.opacity = e; el.style.transform = "translateY(" + (22 * (1 - e)).toFixed(2) + "px)";
          if (p < 1) requestAnimationFrame(f); else finish();
        })(performance.now());
      }, delay || 0);
      // hard safety: guarantee visible even if rAF is paused (background iframe)
      setTimeout(finish, (delay || 0) + dur + 500);
    }

    // hero group animates in on load (staggered)
    var hero = [];
    [".dx-appicon", ".crumb", ".dx-eyebrow", "h1", ".dx-lead"].forEach(function (sel) {
      var el = main.querySelector(":scope > " + sel); if (el) hero.push(el);
    });
    hero.forEach(function (el) { el.style.opacity = "0"; el.style.transform = "translateY(22px)"; });
    hero.forEach(function (el, i) { tween(el, 760, 120 + i * 90); });

    // each section reveals on scroll-enter
    var targets = [].slice.call(main.querySelectorAll(".doc-section"));
    targets.forEach(function (el) { el.style.opacity = "0"; el.style.transform = "translateY(22px)"; });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); tween(en.target, 820, 0); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  })();
})();
