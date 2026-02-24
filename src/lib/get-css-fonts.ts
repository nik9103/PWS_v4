import fs from "fs";
import path from "path";

const FONT_VARS = ["--font-sans", "--font-serif", "--font-mono"] as const;

/**
 * Reads :root { --font-sans/serif/mono } from globals.css and returns
 * unique font family names. Called at server-render time so that when
 * you paste a new :root from Figma, the correct Google Font loads
 * without any changes to layout.tsx.
 */
export function getFontNamesFromCss(): string[] {
  const cssPath = path.join(process.cwd(), "src/app/globals.css");
  let css: string;
  try {
    css = fs.readFileSync(cssPath, "utf-8");
  } catch (err) {
    console.log("[get-css-fonts] globals.css не прочитан:", err);
    return [];
  }

  const snippet = css.slice(0, 300).replace(/\n/g, " ");
  console.log("[get-css-fonts] Прочитан файл:", cssPath);
  console.log("[get-css-fonts] Начало содержимого (300 символов):", snippet);

  const names: string[] = [];
  for (const varName of FONT_VARS) {
    // Matches:
    //   --font-sans: Montserrat;
    //   --font-sans: 'Playfair Display', serif;
    //   --font-sans: "Source Code Pro";
    const re = new RegExp(
      `${varName}\\s*:\\s*['""]?([A-Za-z][\\w ]+?)['""]?\\s*[,;]`,
      "m"
    );
    const m = css.match(re);
    if (m) names.push(m[1].trim());
  }

  const unique = [...new Set(names)];
  console.log("[get-css-fonts] Найденные шрифты:", unique);
  return unique;
}

/**
 * Builds a Google Fonts URL that loads all weights/styles for each font.
 * Returns null if no fonts were found.
 */
export function buildGoogleFontsUrl(fontNames: string[]): string | null {
  if (!fontNames.length) {
    console.log("[get-css-fonts] URL не сформирован: список шрифтов пуст");
    return null;
  }

  const families = fontNames
    .map((n) => `family=${n.replace(/ /g, "+")}:ital,wght@0,100..900;1,100..900`)
    .join("&");

  const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  console.log("[get-css-fonts] Сформирован URL Google Fonts:", url);
  return url;
}
