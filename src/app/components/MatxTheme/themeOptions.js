import { red } from "@mui/material/colors/index.js";
import { components } from "./components.js";

const themeOptions = {
  typography: {
    fontSize: 14,
    body1: { fontSize: "14px" }
  },

  status: { danger: red[500] },
  components: { ...components }
};

export default themeOptions;
