// Genere CV_Garoche_Clementine_fr.pdf et CV_Garoche_Clementine_en.pdf
// a partir de fr.html et en.html (A4, une page, liens cliquables).
// Usage : node tools/make-pdf.cjs <dossier du site>
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = path.resolve(process.argv[2] || ".");

(async () => {
  const browser = await chromium.launch();
  for (const lang of ["fr", "en"]) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    const url = pathToFileURL(path.join(root, `${lang}.html`)).href;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    const out = path.join(root, `CV_Garoche_Clementine_${lang}.pdf`);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log("PDF genere :", out);
    await page.close();
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
