/* ===========================================================
   NOTHRIG — Produktdaten
   Zentrale Liste. Später ggf. aus einem echten Backend/CMS.
   Preise in EUR (Zahl). "mark" = handschriftliches Kürzel auf der Kachel.
   =========================================================== */

window.NOTHRIG_PRODUCTS = [
  {
    id: "boxy-tee-bone",
    name: "Boxy Tee — Bone White",
    category: "T-Shirts",
    cat: "t-shirts",
    price: 45,
    badge: "Neu",
    mark: "NTK",
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: false,
    drop: "Drop 001",
    short: "Schwerer 240 g/m² Single Jersey, kastiger oversize Schnitt, tiefe Schultern.",
    details: {
      "Material": "100% Baumwolle, 240 g/m²",
      "Passform": "Oversize / boxy, fällt eine Nummer größer aus",
      "Print": "Handgezeichnetes NTK-Kürzel, wasserbasiert gedruckt",
      "Herkunft": "Gefärbt und konfektioniert in Portugal"
    }
  },
  {
    id: "heavy-hoodie-charcoal",
    name: "Heavy Hoodie — Charcoal",
    category: "Hoodies",
    cat: "hoodies",
    price: 95,
    badge: "Neu",
    mark: "NTK",
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: false,
    drop: "Drop 001",
    short: "480 g/m² Brushed Fleece, doppellagige Kapuze, verkürzter oversize Body.",
    details: {
      "Material": "80% Baumwolle / 20% Polyester, 480 g/m²",
      "Passform": "Oversize, kurzer Body, weite Ärmel",
      "Details": "Doppellagige Kapuze, Kängurutasche, gestickter Schriftzug",
      "Herkunft": "Gestrickt und genäht in Portugal"
    }
  },
  {
    id: "oversized-tee-washed-black",
    name: "Oversized Tee — Washed Black",
    category: "T-Shirts",
    cat: "t-shirts",
    price: 49,
    badge: null,
    mark: "NTK",
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: false,
    drop: "Drop 001",
    short: "Garment-dyed für einen getragenen Look, jede Wäsche verändert die Farbe leicht.",
    details: {
      "Material": "100% Baumwolle, 220 g/m², garment-dyed",
      "Passform": "Oversize / boxy",
      "Print": "Drop-001-Rückenprint",
      "Pflege": "Kalt waschen, nicht bleichen"
    }
  },
  {
    id: "cargo-pants-sand",
    name: "Cargo Pants — Sand",
    category: "Hosen",
    cat: "hosen",
    price: 110,
    badge: "Neu",
    mark: "NTK",
    sizes: ["28", "30", "32", "34", "36"],
    soldOut: false,
    drop: "Drop 001",
    short: "Weite Cargo mit tiefem Schritt, verstärkte Knie, sechs Taschen.",
    details: {
      "Material": "Baumwoll-Ripstop, 320 g/m²",
      "Passform": "Wide / relaxed, elastischer Bund hinten",
      "Details": "6 Taschen, Riegel an Belastungspunkten, Kordelzug am Saum"
    }
  },
  {
    id: "work-jacket-ecru",
    name: "Work Jacket — Ecru",
    category: "Jacken",
    cat: "jacken",
    price: 145,
    badge: "Neu",
    mark: "NTK",
    sizes: ["S", "M", "L", "XL"],
    soldOut: false,
    drop: "Drop 002",
    short: "Boxy Chore Jacket aus schwerem Canvas, drei Fronttaschen, Corduroy-Kragen.",
    details: {
      "Material": "Baumwoll-Canvas, 400 g/m²",
      "Passform": "Boxy, über Hoodie tragbar",
      "Details": "Corduroy-Kragen, Hornknöpfe, Innentasche",
      "Status": "Teil von Drop 002 — bald verfügbar"
    }
  },
  {
    id: "zip-hoodie-stone",
    name: "Zip Hoodie — Stone",
    category: "Hoodies",
    cat: "hoodies",
    price: 105,
    badge: null,
    mark: "NTK",
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOut: true,
    drop: "Drop 001",
    short: "Full-Zip aus 460 g/m² Fleece mit YKK-Zipper. Aktuell ausverkauft.",
    details: {
      "Material": "100% Baumwolle, 460 g/m²",
      "Passform": "Oversize",
      "Details": "YKK-Metallzipper, Rippbündchen",
      "Status": "Ausverkauft — Restock mit Drop 002"
    }
  },
  {
    id: "beanie-ntk",
    name: "Cuffed Beanie — NTK",
    category: "Accessoires",
    cat: "accessoires",
    price: 29,
    badge: null,
    mark: "NTK",
    sizes: ["One Size"],
    soldOut: false,
    drop: "Drop 001",
    short: "Fein gerippte Beanie aus Merino-Mix mit gewebtem Label.",
    details: {
      "Material": "70% Merinowolle / 30% Acryl",
      "Passform": "Cuffed, mittlere Länge",
      "Details": "Gewebtes NTK-Label am Bund"
    }
  },
  {
    id: "socks-2pack",
    name: "Logo Socks — 2er Pack",
    category: "Accessoires",
    cat: "accessoires",
    price: 18,
    badge: null,
    mark: "NTK",
    sizes: ["39–42", "43–46"],
    soldOut: false,
    drop: "Drop 001",
    short: "Dick gestrickte Crew Socks mit eingestricktem Schriftzug. Zwei Paar.",
    details: {
      "Material": "80% Baumwolle / 17% Polyamid / 3% Elasthan",
      "Details": "Terry-Sohle, verstärkte Ferse und Spitze",
      "Inhalt": "2 Paar (Bone / Charcoal)"
    }
  }
];

window.NOTHRIG_getProduct = function (id) {
  return (window.NOTHRIG_PRODUCTS || []).find(function (p) { return p.id === id; }) || null;
};

/* Datum des nächsten Drops — an einer Stelle pflegen.
   Lokale Zeit. Format: YYYY, MM(0-basiert), DD, HH, MM */
window.NOTHRIG_NEXT_DROP = {
  label: "Drop 002",
  season: "Herbst / Winter 2026",
  date: new Date(2026, 8, 19, 18, 0, 0) // 19.09.2026, 18:00 Uhr
};
