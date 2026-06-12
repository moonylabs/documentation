/* Moony — Pro motion. rAF-driven (CSS transitions are frozen in some
   embedded previews, so we tween inline styles by hand). Reveal-safe:
   if reduced-motion or no IO, everything stays visible. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !window.requestAnimationFrame) return;

  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function tween(dur, onU, onD) {
    var s = performance.now();
    (function f(now) {
      var p = Math.min(1, (now - s) / dur);
      onU(easeOut(p));
      if (p < 1) requestAnimationFrame(f); else if (onD) onD();
    })(performance.now());
  }
  function hide(el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.willChange = "opacity, transform";
  }
  function show(el, delay) {
    setTimeout(function () {
      tween(820, function (e) {
        el.style.opacity = e;
        el.style.transform = "translateY(" + (28 * (1 - e)).toFixed(2) + "px)";
      }, function () { el.style.willChange = ""; el.style.transform = ""; el.style.opacity = ""; });
    }, delay || 0);
  }

  // ---- hero: animate in on load (staggered) ----
  var hero = document.querySelector(".ap-hero .ap-wrap");
  if (hero) {
    var hk = [].slice.call(hero.children);
    hk.forEach(hide);
    hk.forEach(function (el, i) { show(el, 140 + i * 115); });
  }

  // ---- section blocks reveal on scroll ----
  var blocks = [];
  document.querySelectorAll(".ap-sec:not(.ap-hero)").forEach(function (sec) {
    sec.querySelectorAll(":scope > .ap-wrap > *, :scope > .ap-bleed").forEach(function (b) { blocks.push(b); });
  });
  blocks.forEach(hide);
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (en.isIntersecting) { io.unobserve(en.target); show(en.target, 0); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
  blocks.forEach(function (b) { io.observe(b); });

  // ---- 21,000,000 counts up ----
  var fig = document.querySelector("#uses .fig");
  if (fig) {
    var seen = false;
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && !seen) {
          seen = true; cio.disconnect();
          tween(1600, function (e) {
            fig.textContent = Math.round(21000000 * e).toLocaleString("en-US");
          }, function () { fig.textContent = "21,000,000"; });
        }
      });
    }, { threshold: 0.55 });
    cio.observe(fig);
  }

  // ---- pricing curve draws itself in ----
  var plot = document.querySelector("#reserve .rc-plot svg");
  if (plot) {
    var line = null;
    [].slice.call(plot.querySelectorAll("path")).forEach(function (n) {
      if ((n.getAttribute("style") || "").indexOf("stroke:url(#pvLine)") > -1) line = n;
    });
    if (line) {
      var len = 0; try { len = line.getTotalLength(); } catch (e) {}
      if (len) {
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        var dio = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) {
            if (en.isIntersecting) {
              dio.disconnect();
              setTimeout(function () {
                tween(1400, function (e) {
                  line.style.strokeDashoffset = (len * (1 - e)).toFixed(1);
                }, function () { line.style.strokeDasharray = ""; line.style.strokeDashoffset = ""; });
              }, 180);
            }
          });
        }, { threshold: 0.25 });
        dio.observe(plot);
      }
    }
  }
  // ---- signature flourish: hero gradient slowly breathes ----
  var grad = document.querySelector(".ap-hero-hook .ap-grad");
  if (grad) {
    var t0 = performance.now();
    (function shimmer(now) {
      var pos = 50 + 50 * Math.sin((now - t0) / 3400);
      grad.style.backgroundPosition = pos.toFixed(1) + "% 50%";
      requestAnimationFrame(shimmer);
    })(performance.now());
  }
})();
