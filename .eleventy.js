const inspect = require("util").inspect;
module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("artworks", function (collection) {
    return collection
      .getFilteredByGlob("src/artworks/*.md")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("tags", function (collection) {
    const tags = new Set();
    collection.getFilteredByGlob("src/artworks/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => tags.add(tag));
    });
    return [...tags].sort();
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
