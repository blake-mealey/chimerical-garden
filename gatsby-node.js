const getPostPath = require('./src/getPostPath');

exports.onCreatePage = ({ page, actions: { createPage, deletePage } }) => {
  const frontmatter = page.context.frontmatter;
  let newPage = { ...page };
  if (frontmatter && frontmatter.type === 'post') {
    const path = getPostPath(frontmatter.title);
    newPage.path = path;
  }
  newPage.context = {
    ...newPage.context,
    slug: newPage.path,
  };
  deletePage(page);
  createPage(newPage);
};
