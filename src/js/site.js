/* ===========================================================
   NOTHRIG — gemeinsame Seitenlogik (Verhalten, kein Markup)
   Header/Footer/Sections kommen als Eleventy-Includes aus
   src/_includes/sections/. Diese Datei verdrahtet nur:
   Mobile-Nav · Warenkorb-Zähler · Countdown · Newsletter.
   =========================================================== */

(function () {

  /* ---------- Mobile-Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  }
  // Desktop: Nav immer sichtbar; unterhalb 820px steuert der Button.
  var mq = window.matchMedia("(max-width: 820px)");
  function syncNav() { setNav(!mq.matches ? true : false); }
  syncNav();
  mq.addEventListener("change", syncNav);
  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(nav.hidden);
    });
  }

  /* ---------- Warenkorb-Zähler ---------- */
  function renderCount() {
    var n = window.NOTHRIG_Cart ? window.NOTHRIG_Cart.count() : 0;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
    });
  }
  renderCount();
  document.addEventListener("cart:change", renderCount);

  /* ---------- Countdown ---------- */
  var cdEls = document.querySelectorAll("[data-countdown]");
  if (cdEls.length && window.NOTHRIG_NEXT_DROP) {
    var target = window.NOTHRIG_NEXT_DROP.date.getTime();

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var diff = target - Date.now();
      cdEls.forEach(function (root) {
        if (diff <= 0) {
          root.classList.add("countdown--live");
          root.innerHTML =
            '<div class="countdown__unit"><div class="countdown__num">LIVE</div>' +
            '<div class="countdown__label">Drop ist da</div></div>';
          return;
        }
        var s = Math.floor(diff / 1000);
        var d = Math.floor(s / 86400);
        var h = Math.floor((s % 86400) / 3600);
        var m = Math.floor((s % 3600) / 60);
        var sec = s % 60;
        var parts = [
          [d, "Tage"],
          [pad(h), "Std"],
          [pad(m), "Min"],
          [pad(sec), "Sek"]
        ];
        root.innerHTML = parts.map(function (p) {
          return '<div class="countdown__unit"><div class="countdown__num">' + p[0] +
                 '</div><div class="countdown__label">' + p[1] + "</div></div>";
        }).join("");
      });
      if (diff > 0) requestAnimationFrame(function () {});
    }
    tick();
    setInterval(tick, 1000);
  }

  /* Drop-Label / Saison in Text einsetzen */
  document.querySelectorAll("[data-drop-label]").forEach(function (el) {
    el.textContent = window.NOTHRIG_NEXT_DROP ? window.NOTHRIG_NEXT_DROP.label : "";
  });
  document.querySelectorAll("[data-drop-date]").forEach(function (el) {
    if (!window.NOTHRIG_NEXT_DROP) return;
    el.textContent = window.NOTHRIG_NEXT_DROP.date.toLocaleDateString("de-DE", {
      day: "2-digit", month: "long", year: "numeric"
    }) + ", " + window.NOTHRIG_NEXT_DROP.date.toLocaleTimeString("de-DE", {
      hour: "2-digit", minute: "2-digit"
    }) + " Uhr";
  });

  /* ---------- Newsletter (Fake-Submit) ---------- */
  document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.parentElement.querySelector(".msg");
      var input = form.querySelector("input");
      if (input && input.value.indexOf("@") > 0) {
        if (msg) msg.textContent = "Danke — du bist auf der Liste. Wir melden uns vor dem nächsten Drop.";
        form.reset();
      } else if (msg) {
        msg.textContent = "Bitte gib eine gültige E-Mail-Adresse ein.";
      }
    });
  });
})();
