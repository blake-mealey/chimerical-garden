exports.onCreatePage = ({ page, actions: { createPage, deletePage } }) => {
  const frontmatter = page.context.frontmatter;
  if (frontmatter && frontmatter.type === 'post') {
    deletePage(page);
    const slug = encodeURIComponent(
      frontmatter.title.toLowerCase().replace(/ /g, '-')
    );
    createPage({
      ...page,
      path: `/posts/${slug}`,
    });
  }
};
