/* ===========================================================
   NOTHRIG — seitenspezifisches Rendering
   Shop-Grid · Produktdetail · Warenkorb/Checkout · Startseite-Teaser
   =========================================================== */

(function () {
  var fmt = window.NOTHRIG_fmt;
  var Cart = window.NOTHRIG_Cart;
  var PRODUCTS = window.NOTHRIG_PRODUCTS || [];

  function cardHTML(p) {
    var badge = p.badge ? '<span class="card__badge">' + p.badge + "</span>" : "";
    var soldout = p.soldOut ? " card__media--soldout" : "";
    return (
      '<a class="card" href="/product/?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="card__media' + soldout + '">' +
          badge +
          '<span class="mark">' + p.mark + "</span>" +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__cat">' + p.category + "</div>" +
          '<div class="card__name">' + p.name + "</div>" +
          '<div class="card__price">' + fmt(p.price) + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function toast(text) {
    var t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------------------------------------------------------
     Startseite — "Neu im Shop" (erste 4)
     --------------------------------------------------------- */
  var featured = document.querySelector("[data-featured-grid]");
  if (featured) {
    featured.innerHTML = PRODUCTS.slice(0, 4).map(cardHTML).join("");
  }

  /* ---------------------------------------------------------
     Shop-Grid + Filter
     --------------------------------------------------------- */
  var grid = document.querySelector("[data-shop-grid]");
  if (grid) {
    var tabsWrap = document.querySelector("[data-shop-tabs]");
    var cats = ["alle"].concat(
      PRODUCTS.reduce(function (acc, p) {
        if (acc.indexOf(p.cat) === -1) acc.push(p.cat);
        return acc;
      }, [])
    );
    var labels = {
      alle: "Alle", "t-shirts": "T-Shirts", hoodies: "Hoodies",
      hosen: "Hosen", jacken: "Jacken", accessoires: "Accessoires"
    };

    var params = new URLSearchParams(location.search);
    var active = params.get("cat") || "alle";
    if (cats.indexOf(active) === -1) active = "alle";

    if (tabsWrap) {
      tabsWrap.innerHTML = cats.map(function (c) {
        return '<button class="tab" data-cat="' + c + '" aria-pressed="' +
          (c === active) + '">' + (labels[c] || c) + "</button>";
      }).join("");
      tabsWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab");
        if (!btn) return;
        active = btn.dataset.cat;
        tabsWrap.querySelectorAll(".tab").forEach(function (t) {
          t.setAttribute("aria-pressed", String(t.dataset.cat === active));
        });
        var u = new URL(location);
        if (active === "alle") u.searchParams.delete("cat");
        else u.searchParams.set("cat", active);
        history.replaceState(null, "", u);
        render();
      });
    }

    function render() {
      var list = active === "alle"
        ? PRODUCTS
        : PRODUCTS.filter(function (p) { return p.cat === active; });
      grid.innerHTML = list.map(cardHTML).join("") ||
        '<p style="color:var(--ink-soft)">Keine Artikel in dieser Kategorie.</p>';
    }
    render();
  }

  /* ---------------------------------------------------------
     Produktdetail
     --------------------------------------------------------- */
  var pdp = document.querySelector("[data-pdp]");
  if (pdp) {
    var id = new URLSearchParams(location.search).get("id");
    var p = window.NOTHRIG_getProduct(id);

    if (!p) {
      pdp.innerHTML =
        '<div style="padding:80px 0;text-align:center">' +
          "<h1>Artikel nicht gefunden</h1>" +
          '<p style="color:var(--ink-soft)">Dieser Artikel existiert nicht mehr.</p>' +
          '<a class="btn btn--ghost" href="/shop/">Zum Shop</a>' +
        "</div>";
    } else {
      document.title = p.name + " — Nothrig";
      var state = { size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };

      var detailRows = Object.keys(p.details).map(function (k) {
        return "<dt>" + k + "</dt><dd>" + p.details[k] + "</dd>";
      }).join("");

      pdp.innerHTML =
        '<div class="pdp">' +
          '<div class="pdp__media' + (p.soldOut ? " card__media--soldout" : "") + '">' +
            '<span class="mark">' + p.mark + "</span>" +
          "</div>" +
          "<div>" +
            '<a href="/shop/" class="eyebrow" style="display:inline-block;margin-bottom:14px">← Zurück zum Shop</a>' +
            '<div class="card__cat">' + p.category + " · " + p.drop + "</div>" +
            "<h1>" + p.name + "</h1>" +
            '<div class="pdp__price">' + fmt(p.price) + "</div>" +
            "<p>" + p.short + "</p>" +
            '<div class="field">' +
              "<span>Größe</span>" +
              '<div class="sizes" data-sizes>' +
                p.sizes.map(function (s) {
                  return '<button class="size" data-size="' + s + '" aria-pressed="' +
                    (state.size === s) + '">' + s + "</button>";
                }).join("") +
              "</div>" +
            "</div>" +
            '<div class="field">' +
              "<span>Menge</span>" +
              '<div class="qty">' +
                '<button data-step="-1" aria-label="weniger">−</button>' +
                '<input data-qty value="1" inputmode="numeric" aria-label="Menge">' +
                '<button data-step="1" aria-label="mehr">+</button>' +
              "</div>" +
            "</div>" +
            '<button class="btn" data-add style="min-width:240px">' +
              (p.soldOut ? "Ausverkauft" : "In den Warenkorb") +
            "</button>" +
            (p.soldOut ? "" : '<p style="font-size:12px;color:var(--ink-soft);margin-top:12px">Versandkostenfrei ab 80&nbsp;€ · 30 Tage Rückgabe</p>') +
            '<dl class="pdp__meta">' + detailRows + "</dl>" +
          "</div>" +
        "</div>";

      if (p.soldOut) {
        pdp.querySelector("[data-add]").setAttribute("disabled", "");
      }

      var sizesWrap = pdp.querySelector("[data-sizes]");
      sizesWrap.addEventListener("click", function (e) {
        var b = e.target.closest(".size");
        if (!b) return;
        state.size = b.dataset.size;
        sizesWrap.querySelectorAll(".size").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x.dataset.size === state.size));
        });
      });

      var qtyInput = pdp.querySelector("[data-qty]");
      pdp.querySelectorAll("[data-step]").forEach(function (b) {
        b.addEventListener("click", function () {
          state.qty = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + parseInt(b.dataset.step, 10));
          qtyInput.value = state.qty;
        });
      });
      qtyInput.addEventListener("change", function () {
        state.qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        qtyInput.value = state.qty;
      });

      pdp.querySelector("[data-add]").addEventListener("click", function () {
        if (p.soldOut) return;
        if (!state.size) { toast("Bitte Größe wählen"); return; }
        Cart.add(p.id, state.size, state.qty);
        toast("Zum Warenkorb hinzugefügt");
      });
    }
  }

  /* ---------------------------------------------------------
     Warenkorb + Checkout
     --------------------------------------------------------- */
  var cartRoot = document.querySelector("[data-cart-root]");
  if (cartRoot) {
    var checkedOut = false;

    function lineHTML(l) {
      return (
        '<div class="line">' +
          '<div class="line__media"><span class="mark">' + l.mark + "</span></div>" +
          "<div>" +
            '<div class="line__name">' + l.name + "</div>" +
            '<div class="line__opt">Größe: ' + l.size + "</div>" +
            '<div class="qty" style="margin-top:10px">' +
              '<button data-cq="-1" data-id="' + l.id + '" data-size="' + l.size + '" aria-label="weniger">−</button>' +
              '<input value="' + l.qty + '" data-cqi data-id="' + l.id + '" data-size="' + l.size + '" inputmode="numeric" aria-label="Menge">' +
              '<button data-cq="1" data-id="' + l.id + '" data-size="' + l.size + '" aria-label="mehr">+</button>' +
            "</div>" +
            '<button class="line__remove" data-remove data-id="' + l.id + '" data-size="' + l.size + '">Entfernen</button>' +
          "</div>" +
          '<div class="line__price">' + fmt(l.lineTotal) + "</div>" +
        "</div>"
      );
    }

    function render() {
      if (checkedOut) return;
      var d = Cart.detailed();

      if (!d.lines.length) {
        cartRoot.innerHTML =
          '<div class="cart-empty">' +
            "<h1>Dein Warenkorb ist leer</h1>" +
            "<p>Noch nichts drin. Der erste Drop ist live.</p>" +
            '<a class="btn" href="/shop/" style="margin-top:20px">Zum Shop</a>' +
          "</div>";
        return;
      }

      var progress = d.freeShippingRemaining > 0
        ? "Noch " + fmt(d.freeShippingRemaining) + " bis zum kostenlosen Versand."
        : "Kostenloser Versand ist freigeschaltet.";

      cartRoot.innerHTML =
        '<h1 style="font-size:clamp(30px,6vw,52px);margin-bottom:8px">Warenkorb</h1>' +
        '<p style="color:var(--ink-soft);margin-bottom:30px">' + progress + "</p>" +
        '<div class="cart-layout">' +
          "<div>" + d.lines.map(lineHTML).join("") + "</div>" +
          '<aside class="summary">' +
            "<h2>Zusammenfassung</h2>" +
            '<div class="summary__row"><span>Zwischensumme</span><span>' + fmt(d.subtotal) + "</span></div>" +
            '<div class="summary__row"><span>Versand</span><span>' + (d.shipping === 0 ? "Kostenlos" : fmt(d.shipping)) + "</span></div>" +
            '<div class="summary__row summary__row--total"><span>Gesamt</span><span>' + fmt(d.total) + "</span></div>" +
            '<button class="btn" data-open-checkout>Zur Kasse</button>' +
            '<p class="summary__note">Inkl. MwSt. Zahlung &amp; Bestellung werden in dieser Demo simuliert.</p>' +
          "</aside>" +
        "</div>" +
        '<section class="checkout" data-checkout hidden>' +
          '<h2 style="font-size:20px;margin-bottom:18px">Kasse</h2>' +
          '<form data-checkout-form>' +
            '<div class="form-grid">' +
              '<div class="full"><label for="co-email">E-Mail</label><input id="co-email" type="email" required></div>' +
              '<div><label for="co-first">Vorname</label><input id="co-first" required></div>' +
              '<div><label for="co-last">Nachname</label><input id="co-last" required></div>' +
              '<div class="full"><label for="co-street">Straße &amp; Nr.</label><input id="co-street" required></div>' +
              '<div><label for="co-zip">PLZ</label><input id="co-zip" required></div>' +
              '<div><label for="co-city">Stadt</label><input id="co-city" required></div>' +
              '<div class="full"><label for="co-card">Kartennummer (Demo — beliebig)</label><input id="co-card" inputmode="numeric" placeholder="4242 4242 4242 4242" required></div>' +
            "</div>" +
            '<button class="btn" type="submit" style="margin-top:22px;min-width:260px">Jetzt kaufen · ' + fmt(d.total) + "</button>" +
          "</form>" +
        "</section>";
    }

    cartRoot.addEventListener("click", function (e) {
      var step = e.target.closest("[data-cq]");
      var rem = e.target.closest("[data-remove]");
      var openCo = e.target.closest("[data-open-checkout]");

      if (step) {
        var cur = Cart.detailed().lines.find(function (l) {
          return l.id === step.dataset.id && l.size === step.dataset.size;
        });
        if (cur) Cart.setQty(step.dataset.id, step.dataset.size, cur.qty + parseInt(step.dataset.cq, 10));
      }
      if (rem) Cart.remove(rem.dataset.id, rem.dataset.size);
      if (openCo) {
        var co = cartRoot.querySelector("[data-checkout]");
        if (co) { co.hidden = false; co.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    });

    cartRoot.addEventListener("change", function (e) {
      var inp = e.target.closest("[data-cqi]");
      if (!inp) return;
      Cart.setQty(inp.dataset.id, inp.dataset.size, Math.max(1, parseInt(inp.value, 10) || 1));
    });

    cartRoot.addEventListener("submit", function (e) {
      if (!e.target.matches("[data-checkout-form]")) return;
      e.preventDefault();
      var d = Cart.detailed();
      var order = "NTK-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      checkedOut = true;
      Cart.clear();
      cartRoot.innerHTML =
        '<div class="confirm">' +
          '<div class="logo">Nothrig</div>' +
          "<h1>Danke für deine Bestellung</h1>" +
          '<p style="color:var(--ink-soft);max-width:40ch;margin:12px auto 0">' +
            "Bestellnummer <strong>" + order + "</strong> · Gesamt " + fmt(d.total) + ".<br>" +
            "Eine Bestätigung ist an deine E-Mail unterwegs. (Demo — es wird nichts wirklich versendet.)" +
          "</p>" +
          '<a class="btn" href="/shop/" style="margin-top:24px">Weiter shoppen</a>' +
        "</div>";
    });

    document.addEventListener("cart:change", render);
    render();
  }
})();
