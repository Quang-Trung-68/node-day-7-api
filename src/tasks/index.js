const { readdirSync } = require("node:fs");

const tasks = readdirSync(__dirname)
  .filter((fileName) => fileName !== "index.js")
  .reduce((obj, fileName) => {
    const type = fileName.replace(".js", "");
    return {
      ...obj,
      [type]: require(`./${fileName}`),
    };
  }, {});

module.exports = tasks;
