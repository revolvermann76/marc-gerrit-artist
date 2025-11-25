const inspect = require("util").inspect;
module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("artworks", function (collection) {
    return collection.getFilteredByGlob("src/artworks/*.md");
  });
  eleventyConfig.addFilter(
    "debug",
    (content) => `<pre>${inspect(content)}</pre>`
  );
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");
  return {
    dir: {
      input: "src",
      output: "dist",
    },
    pathPrefix: "/marc-gerrit-artist/",
  };
};
