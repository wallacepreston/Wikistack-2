const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (page) => layout(html`
  <h3>${page.title}
      <small> (<a href="${page.route}/similar">Similar</a>)</small>
  </h3>
  <h4>by <a href="/users/${page.author.id}">${page.author.name}</a></h4>
  <ul>
    ${page.tags.map(tag => html`<li>${tag}</li>`)}
  </ul>
  <hr/>
  <div class="page-body">$${page.renderedContent }</div>
  <hr/>
  <a href="${page.route}/edit" class="btn btn-primary">edit this page</a>
  <a href="${page.route}/delete" class="btn btn-danger">delete this page</a>
`);