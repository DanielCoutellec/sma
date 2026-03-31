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
// DATA DIRECTE (robuste Vercel)
// =========================
const membres = require("./data/membres.json");
const courses2026 = require("./data/courses2026.json");

// =========================
// HELPERS
// =========================
function groupCourses(courses) {
  const grouped = {};

  courses.forEach((c) => {
    const mois = c.mois || "Autres";
    if (!grouped[mois]) grouped[mois] = [];
    grouped[mois].push(c);
  });

  return Object.keys(grouped).map((mois) => ({
    mois,
    items: grouped[mois]
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

app.get("/trombinoscope", (req, res) => {
  res.render("trombinoscope", {
    currentPath: "/trombinoscope",
    membres: membres
  });
});

app.get("/courses2026", (req, res) => {
  res.render("courses2026", {
    currentPath: "/courses2026",
    courses: courses2026,
    groupedCourses: groupCourses(courses2026)
  });
});

app.get("/photos/:slug", (req, res) => {
  try {
    const slug = req.params.slug;
    const dir = path.join(__dirname, "public", "img", "course", "photos", slug);

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

    const photos = files.map((file) => "/img/course/photos/" + slug + "/" + file);

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

app.use((req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(PORT, () => {
  console.log("Serveur démarré : http://localhost:" + PORT);
});