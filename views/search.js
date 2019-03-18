const html = require("html-template-tag");
const layout = require("./layout");

module.exports = () => layout(html`
  <h3>Search by Tag</h3>
  <hr>
  <form method="GET" action="/wiki/search/">
    <div class="form-group">
      <label for="tag" class="col-sm-2 control-label">Tags to Search By</label>
      <div class="col-sm-10">
        <input name="tag" type="text" class="form-control"/>
      </div>
    </div>

    <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-primary">submit</button>
    </div>
  </form>
`);
