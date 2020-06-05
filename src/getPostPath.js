module.exports = function (title) {
  const slug = encodeURIComponent(title.toLowerCase().replace(/ /g, '-'));
  return `/posts/${slug}`;
};
