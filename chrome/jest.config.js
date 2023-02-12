module.exports = {
    // Add this line to your Jest config
    setupFilesAfterEnv: ['./jest.setup.js'],
    preset: "ts-jest",
    transform: { "\\.ts$": ["ts-jest"] },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globals: {
        "ts-jest": {
        tsConfig: {
            // allow js in typescript
            allowJs: true,
        },
        },
    },
  }