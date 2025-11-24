module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("artworks", function (collection) {
    return collection.getFilteredByGlob("src/artworks/*.md");
  });
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
