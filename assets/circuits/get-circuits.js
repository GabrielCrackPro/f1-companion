import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const countries = [
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "Hungary",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Mexico",
  "Monaco",
  "Morocco",
  "Netherlands",
  "Portugal",
  "Qatar",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

const outputDir = path.resolve("assets/circuits");

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadImage(country, callback) {
  const normalized = country.toLowerCase().replace(/\s+/g, "_");
  const url = `https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${normalized}_Circuit.webp`;
  const filePath = path.join(outputDir, `${normalized}.webp`);

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }

      const dest = fs.createWriteStream(filePath);
      res.body.pipe(dest);

      res.body.on("end", () => {
        console.log(`✅ Downloaded: ${country}`);
        setTimeout(callback, 1500);
      });

      res.body.on("error", (err) => {
        console.error(`❌ Error writing ${country}:`, err.message);
        setTimeout(callback, 1500);
      });
    })
    .catch((err) => {
      console.error(`❌ Failed: ${country} - ${err.message}`);
      setTimeout(callback, 1500);
    });
}

function main() {
  ensureDirExists(outputDir);

  let i = 0;
  function next() {
    if (i >= countries.length) {
      console.log("🎉 All downloads completed.");
      return;
    }
    const country = countries[i++];
    downloadImage(country, next);
  }

  next(); // Start the process
}

main();
