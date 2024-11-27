import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.@(ts|tsx)", "!src/**/*.test.@(ts|js)"],
  external: ["react"],
  clean: true,
  dts: {
    sequential: true,
    resolve: true,
    // // Only generate .d.ts files for the entry points
    // entry: {
    //   index: "src/index.ts"
    // }
  },
  format: ["cjs", "esm"],
  splitting: false, // Disable code splitting to reduce complexity
  outDir: "dist",
  sourcemap: false, // Disable sourcemaps if not needed
  ...options,
}));

// import { defineConfig, type Options } from "tsup";

// export default defineConfig((options: Options) => ({
//   clean: true,
//   entry: ["./src/**/*/.tsx", "./src/index.ts", "./tailwind.config.ts"],
//   format: ["cjs", "esm"],
//   external: ["react"],
//   banner: {
//     js: "'use client'",
//   },
//   ...options,
// }));
