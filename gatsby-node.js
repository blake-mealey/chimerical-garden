const getPostPath = require('./src/getPostPath');

exports.onCreatePage = ({ page, actions: { createPage, deletePage } }) => {
  const frontmatter = page.context.frontmatter;
  if (frontmatter && frontmatter.type === 'post') {
    deletePage(page);
    createPage({
      ...page,
      path: getPostPath(frontmatter.title),
    });
  }
};
