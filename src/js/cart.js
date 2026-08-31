/* ===========================================================
   NOTHRIG — Warenkorb (clientseitig, localStorage)
   Bestellung wird simuliert. Später an echtes Payment anbindbar.
   =========================================================== */

(function () {
  var KEY = "nothrig_cart_v1";
  var FREE_SHIPPING_FROM = 80;
  var SHIPPING_FLAT = 4.9;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("cart:change", { detail: { items: items } }));
  }

  var Cart = {
    items: function () { return read(); },

    count: function () {
      return read().reduce(function (n, i) { return n + i.qty; }, 0);
    },

    add: function (id, size, qty) {
      qty = qty || 1;
      var items = read();
      var line = items.find(function (i) { return i.id === id && i.size === size; });
      if (line) {
        line.qty += qty;
      } else {
        items.push({ id: id, size: size, qty: qty });
      }
      write(items);
    },

    setQty: function (id, size, qty) {
      var items = read();
      var line = items.find(function (i) { return i.id === id && i.size === size; });
      if (!line) return;
      line.qty = Math.max(1, qty);
      write(items);
    },

    remove: function (id, size) {
      write(read().filter(function (i) { return !(i.id === id && i.size === size); }));
    },

    clear: function () { write([]); },

    /* liefert angereicherte Zeilen inkl. Produktdaten + Summen */
    detailed: function () {
      var lines = read().map(function (i) {
        var p = window.NOTHRIG_getProduct(i.id);
        return {
          id: i.id,
          size: i.size,
          qty: i.qty,
          name: p ? p.name : i.id,
          category: p ? p.category : "",
          mark: p ? p.mark : "NTK",
          price: p ? p.price : 0,
          lineTotal: (p ? p.price : 0) * i.qty
        };
      });
      var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
      var shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
      return {
        lines: lines,
        subtotal: subtotal,
        shipping: shipping,
        total: subtotal + shipping,
        freeShippingFrom: FREE_SHIPPING_FROM,
        freeShippingRemaining: Math.max(0, FREE_SHIPPING_FROM - subtotal)
      };
    }
  };

  window.NOTHRIG_Cart = Cart;
  window.NOTHRIG_fmt = function (n) {
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  };
})();
