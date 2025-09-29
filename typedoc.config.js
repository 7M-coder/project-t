export default {
  // Define the entry points for TypeDoc to document
  entryPoints: ["src/**/*.{ts,tsx}"],
  // Output directory for the generated documentation
  out: "docs",
  // Specify the TypeScript configuration file
  tsconfig: "tsconfig.json",
  // Strategy for determining the entry points
  entryPointStrategy: "expand",
  // Patterns to exclude from documentation
  exclude: ["**/*.test.ts", "**/*.test.tsx", "**/node_modules/**"],
  // Exclude external modules from the documentation
  excludeExternals: true,
  // Include the project's version in the documentation
  includeVersion: true,
  // Exclude private members from the documentation
  excludePrivate: true,
  // Exclude protected members from the documentation
  excludeProtected: true,
  // Exclude members that are not documented
  excludeNotDocumented: true,
  // Set the project name
  name: "Project-T",
  // Specify the theme for the documentation
  theme: "default",
};
