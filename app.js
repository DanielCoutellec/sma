const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

// moteur de vues
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// layouts
app.use(expressLayouts);
app.set("layout", "layout");

// fichiers statiques (CSS, images, JS front)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// middleware pour savoir sur quel onglet on est
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// routes
app.get("/", (req, res) => {
  res.render("index", { title: "Accueil" });
});

app.get("/ag", (req, res) => {
  res.render("ag", { title: "Assemblée Générale" });
});

app.get("/courses-2025", (req, res) => {
  res.render("courses2025", { title: "Courses 2025" });
});

app.get("/courses-2026", (req, res) => {
  res.render("courses2026", { title: "Courses 2026" });
});

app.get("/trombinoscope", (req, res) => {
  res.render("trombinoscope", { title: "Trombinoscope" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// formulaire de contact
app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Nouveau message :", { name, email, subject, message });

  res.render("contact", {
    title: "Contact",
    success: "Votre message a bien été envoyé."
  });
});

// seulement en local
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}

// export pour Vercel éventuel
module.exports = app;
