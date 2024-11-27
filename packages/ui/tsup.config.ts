import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.@(ts|tsx)", "!src/**/*.test.@(ts|js)"], // Only entry points for components or packages
  format: ["cjs", "esm"], // Good for compatibility
  external: ["react"], // Externalize React if it's not used inside the package
  // treeshake: true, // Disabled because it strips 'use client'
  clean: true,
  // splitting: true,
  // minify: true,
  // dts: false,
  dts: true,
  // banner: {
  //  js: "'use client'", // Remove the 'use client' banner if not using React
  // },
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
