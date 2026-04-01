const express = require("express");
const path = require("path");
const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// CONFIG
// =========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =========================
// DATA
// =========================
const membres = require("./data/membres.json");
const courses2026 = require("./data/courses2026.json");

// =========================
// HELPERS
// =========================
function monthOrder(label) {
  const v = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  if (v.includes("JAN")) return 1;
  if (v.includes("FEV")) return 2;
  if (v.includes("MAR")) return 3;
  if (v.includes("AVR")) return 4;
  if (v.includes("MAI")) return 5;
  if (v.includes("JUIN")) return 6;
  if (v.includes("JUIL")) return 7;
  if (v.includes("AOU")) return 8;
  if (v.includes("SEP")) return 9;
  if (v.includes("OCT")) return 10;
  if (v.includes("NOV")) return 11;
  if (v.includes("DEC")) return 12;

  return 99;
}

function extractDay(dateStr) {
  const match = String(dateStr || "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 99;
}

function groupCourses(courses) {
  const grouped = {};

  courses.forEach((c) => {
    const mois = c.mois || "Autres";
    if (!grouped[mois]) grouped[mois] = [];
    grouped[mois].push(c);
  });

  return Object.keys(grouped)
    .sort((a, b) => monthOrder(a) - monthOrder(b))
    .map((mois) => ({
      mois: mois,
      items: grouped[mois].sort((a, b) => extractDay(a.date) - extractDay(b.date))
    }));
}

// =========================
// ROUTES
// =========================
app.get("/", (req, res) => {
  res.render("index", {
    currentPath: "/"
  });
});

app.get("/ag", (req, res) => {
  res.render("ag", {
    currentPath: "/ag"
  });
});

app.get("/participations", (req, res) => {
  res.render("participations", {
    currentPath: "/participations"
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    currentPath: "/contact"
  });
});

// =========================
// TROMBINOSCOPE
// =========================
app.get("/trombinoscope", (req, res) => {
  res.render("trombinoscope", {
    currentPath: "/trombinoscope",
    membres: membres
  });
});

// =========================
// COURSES 2026
// =========================
app.get("/courses2026", (req, res) => {
  res.render("courses2026", {
    currentPath: "/courses2026",
    courses: courses2026,
    groupedCourses: groupCourses(courses2026)
  });
});

// =========================
// GALERIE PHOTOS
// =========================
app.get("/photos/:slug", (req, res) => {
  try {
    const slug = req.params.slug;

    const dir = path.join(
      __dirname,
      "public",
      "img",
      "course",
      "photos",
      slug
    );

    if (!fs.existsSync(dir)) {
      return res.status(404).send("Galerie introuvable");
    }

    const files = fs.readdirSync(dir).filter((file) => {
      const lower = file.toLowerCase();
      return (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".webp")
      );
    });

    const photos = files.map((file) => {
      return "/img/course/photos/" + slug + "/" + file;
    });

    res.render("photos", {
      currentPath: "",
      slug: slug,
      photos: photos
    });
  } catch (err) {
    console.error("Erreur galerie", err);
    res.status(500).send("Erreur serveur");
  }
});

// =========================
// 404
// =========================
app.use((req, res) => {
  res.status(404).send("Page introuvable");
});

// =========================
// START
// =========================
app.listen(PORT, () => {
  console.log("Serveur démarré : http://localhost:" + PORT);
});