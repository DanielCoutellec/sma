const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");

const app = express();

// --- Static files (/css, /js, /img...) ---
app.use(express.static(path.join(__dirname, "public")));

// --- EJS + Layouts ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // views/layout.ejs

// --- Forms (POST) ---
app.use(express.urlencoded({ extended: true }));

// --- Helpers ---
const monthIndex = (mois) => {
  const m = String(mois || "").toLowerCase();
  if (m.includes("jan")) return 1;
  if (m.includes("fev") || m.includes("fév")) return 2;
  if (m.includes("mar")) return 3;
  if (m.includes("avr")) return 4;
  if (m.includes("mai")) return 5;
  if (m.includes("jui") && !m.includes("juil")) return 6; // juin
  if (m.includes("juil")) return 7;
  if (m.includes("aou") || m.includes("aoû")) return 8;
  if (m.includes("sep")) return 9;
  if (m.includes("oct")) return 10;
  if (m.includes("nov")) return 11;
  if (m.includes("dec") || m.includes("déc")) return 12;
  return 99;
};

const dateKey = (d = "") => {
  // dd/mm/yyyy -> yyyy-mm-dd (tri lexicographique)
  const parts = String(d).split("/");
  if (parts.length !== 3) return "9999-99-99";
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
};

// --- Routes ---
app.get("/", (req, res) => res.render("index", { currentPath: "/" }));

app.get("/ag", (req, res) => res.render("ag", { currentPath: "/ag" }));

app.get("/participations", (req, res) =>
  res.render("participations", { currentPath: "/participations" })
);

app.get("/courses2026", (req, res) => {
  try {
    // Sur Vercel, process.cwd() est la racine du projet déployé
    const file = path.join(process.cwd(), "data", "courses2026.json");

    let courses = [];
    if (fs.existsSync(file)) {
      courses = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    const cleanCourses = (Array.isArray(courses) ? courses : []).map((c) => ({
      ...c,
      mois: c?.mois ?? "",
      date: c?.date ?? "",
      epreuve: c?.epreuve ?? "",
      lieu: c?.lieu ?? "",
      type: c?.type ?? "",
      statut: c?.statut ?? "Prévisionnel",
      photos: c?.photos ?? "",
      classement: c?.classement ?? "",
    }));

    // tri global : d’abord par mois, puis par date
    cleanCourses.sort((a, b) => {
      const ma = monthIndex(a.mois);
      const mb = monthIndex(b.mois);
      if (ma !== mb) return ma - mb;
      return dateKey(a.date).localeCompare(dateKey(b.date));
    });

    // groupBy mois
    const groupsMap = new Map();
    for (const c of cleanCourses) {
      const key = c.mois || "Autres";
      if (!groupsMap.has(key)) groupsMap.set(key, []);
      groupsMap.get(key).push(c);
    }

    const groupedCourses = Array.from(groupsMap.entries())
      .sort(([a], [b]) => monthIndex(a) - monthIndex(b))
      .map(([mois, items]) => ({ mois, items }));

    res.render("courses2026", {
      currentPath: "/courses2026",
      courses: cleanCourses,
      groupedCourses,
    });
  } catch (err) {
    console.error("ERROR /courses2026:", err);
    res.status(500).send("Erreur serveur /courses2026 : " + err.message);
  }
});

app.get("/trombinoscope", (req, res) => {
  const membres = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "membres.json"), "utf-8")
  );

  res.render("trombinoscope", {
    currentPath: "/trombinoscope",
    membres,
  });
});

app.get("/contact", (req, res) =>
  res.render("contact", { currentPath: "/contact" })
);

// POST contact (simulation)
app.post("/contact", (req, res) => {
  res.render("contact", { currentPath: "/contact" });
});

// --- Local server only (important for Vercel) ---
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`✅ Serveur démarré : http://localhost:${PORT}`)
  );
}

// --- Export for Vercel ---
module.exports = app;