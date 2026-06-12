/* Moony — page behaviour: nav, copy, smooth scroll.
   Note: time-based CSS animation does not run in some embedded
   preview contexts, so all content rests in its final visible
   state and motion is treated as non-essential. */
(function () {
  "use strict";

  // sticky nav border on scroll
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // copy-to-clipboard
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const txt = btn.getAttribute("data-copy");
      const done = () => {
        const orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("ok");
        setTimeout(() => { btn.textContent = orig; btn.classList.remove("ok"); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done).catch(done);
      else done();
    });
  });

  // smooth-scroll for in-page anchors (respects sticky nav)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });

  // binary theme — faint field behind the hero. The ⍜ mark is just
  // another character in the stream (⍜ ≈ a 1 and 0 rotated together),
  // rendered identically to the bits so only its rotation sets it apart.
  document.querySelectorAll(".hero-binary").forEach((bin) => {
    const cols = 88, rows = 34;
    let html = "";
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        const roll = Math.random();
        const ch = roll < 0.05 ? "⍜" : (Math.random() < 0.5 ? "0" : "1");
        // same highlight chance for every character, glyph included
        line += Math.random() < 0.05 ? '<span class="on">' + ch + "</span>" : ch;
      }
      html += line + "\n";
    }
    bin.innerHTML = html;
  });
})();
