import { createTheme } from "@mui/material";
import { forEach, merge } from "lodash";
import { themeColors } from "./themeColors.js";
import themeOptions from "./themeOptions.js";

function createMatxThemes() {
  let themes = {};

  forEach(themeColors, (value, key) => {
    themes[key] = createTheme(merge({}, themeOptions, value));
  });

  return themes;
}

export const themes = createMatxThemes();
