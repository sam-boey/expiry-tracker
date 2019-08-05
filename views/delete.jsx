var React = require("react");

class Delete extends React.Component {
  render() {
    let item = this.props.item;
    console.log(item);
    let url = `/exptrack/delete-item/${item.id}?_method=DELETE`;

    return (
      <html>
        <head />
        <body>
          <h1>Delete Item</h1>
          <h2>Are you sure?</h2>
          <div>
            <form action={url} method="POST" >
            <div><input type ="submit" value="Delete" /></div>
            </form>
          </div>
        </body>
      </html>
    );
};
}

module.exports = Delete;