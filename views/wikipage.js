const html = require("html-template-tag");
const layout = require("./layout");
const marked = require('marked');

module.exports = (page, author) => layout(html`
  <h4>by <a href="/users/${author ? author.id : '#'}">${author ? author.name : 'Anonymous (go to list of users)'}</a></h4>
  <p>Tags:</p><small>${
      page.tags
        ? page.tags.map(tag => html`<strong><a href="/wiki/search?tag=${tag}">${tag}</a></strong>` + ' |') 
        : '[no tags]'
    }</small>
  <hr/>
  <div class="page-body">$${marked(page.content)}</div>
  <hr/>

  <a href="/wiki/${page.slug}/similar" class="btn btn-info">Similar Articles</a>
  <a href="/wiki/${page.slug}/edit" class="btn btn-primary">edit this page</a>
  <a href="/wiki/${page.slug}/delete" class="btn btn-danger">delete this page</a>
`);