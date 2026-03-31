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
// HELPERS
// =========================
function loadJson(relativePath, fallback = []) {
  try {
    const fullPath = path.join(__dirname, relativePath);

    if (!fs.existsSync(fullPath)) return fallback;

    const raw = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture JSON: " + relativePath, err);
    return fallback;
  }
}

// =========================
// DATA
// =========================
function getMembres() {
  return loadJson("data/membres.json", []);
}

function getCourses() {
  return loadJson("data/courses2026.json", []);
}

// =========================
// GROUP COURSES PAR MOIS
// =========================
function groupCourses(courses) {
  const grouped = {};

  courses.forEach((c) => {
    const mois = c.mois || "Autres";

    if (!grouped[mois]) grouped[mois] = [];
    grouped[mois].push(c);
  });

  return Object.keys(grouped).map((mois) => ({
    mois: mois,
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

// =========================
// TROMBINOSCOPE
// =========================
app.get("/trombinoscope", (req, res) => {
  const membres = getMembres();

  res.render("trombinoscope", {
    currentPath: "/trombinoscope",
    membres: membres
  });
});

// =========================
// COURSES
// =========================
app.get("/courses2026", (req, res) => {
  const courses = getCourses();
  const groupedCourses = groupCourses(courses);

  res.render("courses2026", {
    currentPath: "/courses2026",
    courses: courses,
    groupedCourses: groupedCourses
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
      "Course",
      "photos",
      slug
    );

    if (!fs.existsSync(dir)) {
      return res.status(404).send("Galerie introuvable");
    }

    const files = fs.readdirSync(dir);

    const photos = files.map(function (file) {
      return "/img/Course/photos/" + slug + "/" + file;
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