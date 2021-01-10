/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const checkES5 = require("check-ecmascript-version-compatibility");
/* eslint-enable @typescript-eslint/no-var-requires */

import path = require("path");
import fs = require("fs");

const outputPath = path.resolve(__dirname, "..", "..", "publishing-test-dist");
const config = {
  mode: "production",
  entry: path.resolve(__dirname, "..", "..", "src", "index.ts"),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
  output: {
    filename: "browser.js",
    path: outputPath,
    environment: {
      arrowFunction: false,
    },
  },
};

describe("built file (be patient, this can take a while)", () => {
  let pathToBuild: string;

  beforeAll((done) => {
    fs.rmdirSync(outputPath, { recursive: true });
    fs.mkdirSync(outputPath);

    pathToBuild = path.resolve(config.output.path, config.output.filename);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack(config, (err: Error, stats: any) => {
      if (err || stats.hasErrors()) {
        console.log(err.message);
        console.log(stats && stats.toJson("minimal"));
        done(new Error("something went wrong"));

        return;
      }

      done();
    });
  }, 20000);

  it("is es5 compliant", (done) => {
    checkES5(pathToBuild, done);
  }, 20000);

  it("is less then 90 KiB unminified", (done) => {
    fs.stat(pathToBuild, (err, stats) => {
      if (err) {
        done(err);

        return;
      }

      expect(stats.size).toBeLessThan(90000);

      done();
    });
  });
});
