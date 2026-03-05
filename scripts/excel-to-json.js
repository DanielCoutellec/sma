const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const xlsxPath = path.join(__dirname, "..", "data", "courses2026.xlsx");
const outPath = path.join(__dirname, "..", "data", "courses2026.json");

function fmtDate(v, fallbackYear = 2026) {
  if (v === null || v === undefined || v === "") return "";

  // 1) Nombre Excel (serial) -> conversion fiable sans timezone
  if (typeof v === "number") {
    // Arrondi au jour (corrige les 23:59:xx la veille)
    const rounded = Math.round(v);
    const d = XLSX.SSF.parse_date_code(rounded);
    if (d && d.y && d.m && d.d) {
      const dd = String(d.d).padStart(2, "0");
      const mm = String(d.m).padStart(2, "0");
      return `${dd}/${mm}/${d.y}`;
    }
  }

  // 2) Date JS (si jamais) -> on arrondit au jour
  if (v instanceof Date) {
    // si l'heure est en fin de journée, c'est quasi sûr que c'est le jour suivant
    const hours = v.getHours();
    const base = new Date(v.getFullYear(), v.getMonth(), v.getDate());
    if (hours >= 12) base.setDate(base.getDate() + 1);
    const dd = String(base.getDate()).padStart(2, "0");
    const mm = String(base.getMonth() + 1).padStart(2, "0");
    const yyyy = base.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // 3) Texte type "03-juin" / "3 juin"
  const s = String(v).trim().toLowerCase();
  const monthMap = {
    janv: 1, janvier: 1,
    fev: 2, fév: 2, fevrier: 2, février: 2,
    mars: 3,
    avr: 4, avril: 4,
    mai: 5,
    juin: 6,
    juil: 7, juillet: 7,
    aout: 8, août: 8,
    sep: 9, sept: 9, septembre: 9,
    oct: 10, octobre: 10,
    nov: 11, novembre: 11,
    dec: 12, déc: 12, decembre: 12, décembre: 12
  };
  const m = s.match(/^(\d{1,2})\s*[-\/\s]\s*([a-zéûôîàç\.]+)$/i);
  if (m) {
    const day = Number(m[1]);
    const monKey = m[2].replace(".", "");
    const month = monthMap[monKey];
    if (month && day >= 1 && day <= 31) {
      const dd = String(day).padStart(2, "0");
      const mm = String(month).padStart(2, "0");
      return `${dd}/${mm}/${fallbackYear}`;
    }
  }

  return String(v).trim();
}

function clean(v) {
  return String(v ?? "").trim();
}

const wb = XLSX.readFile(xlsxPath, { cellDates: false });

const courses = [];

for (const sheetName of wb.SheetNames) {
  const ws = wb.Sheets[sheetName];

  // Tableau brut (lignes/colonnes), en gardant les trous
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" });

  // On saute les 3 premières lignes (titre / vide / en-têtes)
  for (let r = 3; r < rows.length; r++) {
    const row = rows[r] || [];

    // Colonnes Excel (0-based) : A=0, B=1, C=2, D=3, E=4, F=5, N=13
    const epreuve = clean(row[0]);
    const dateRaw = row[1];

    // Une course = nom + date sur la même ligne
    if (!epreuve || !dateRaw) continue;

    // Filtre des lignes parasites éventuelles (au cas où)
    const low = epreuve.toLowerCase();
    if (low.startsWith("org") || low.includes("titul") || low.includes("porteur") || low.includes("remplac")) continue;

    const year = /(\d{2})$/.test(sheetName) ? 2000 + Number(sheetName.match(/(\d{2})$/)[1]) : 2026;
const date = fmtDate(dateRaw, year);
    if (!date) continue;

    const nbMotos = clean(row[2]);
    const rdv = clean(row[3]);
    const heure = clean(row[4]);
    const responsable = clean(row[5]);
    const info = clean(row[13]);

    courses.push({
      mois: sheetName,       // pratique si tu veux regrouper par mois plus tard
      date,
      epreuve,
      lieu: rdv,
      type: "",              // pas présent dans ton Excel -> à compléter si tu veux
      statut: "Prévisionnel",
      photos: "",
      classement: "",

      // bonus (optionnel)
      nb_motos: nbMotos,
      heure,
      responsable,
      info
    });
  }
}

// Tri par date dd/mm/yyyy
courses.sort((a, b) => {
  const pa = (a.date || "").split("/").reverse().join("-");
  const pb = (b.date || "").split("/").reverse().join("-");
  return pa.localeCompare(pb);
});

fs.writeFileSync(outPath, JSON.stringify(courses, null, 2), "utf8");
console.log(`✅ ${courses.length} courses importées → ${outPath}`);