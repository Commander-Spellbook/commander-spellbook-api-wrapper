const path = require("path");

module.exports = {
  mode: "production",
  entry: "./docs/src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [require("tailwindcss"), require("autoprefixer")],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "docs"),
    environment: {
      arrowFunction: false,
    },
  },
};
