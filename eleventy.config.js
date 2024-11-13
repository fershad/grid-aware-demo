export default async function(eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.addPassthroughCopy("static");
    eleventyConfig.addWatchTarget("static/index.css");

};