import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",

  output: {
    file: "dist/react-global-event-listener.js",
    format: "es"
  },

  external: ["lodash", "react"],

  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve()
  ]
};
