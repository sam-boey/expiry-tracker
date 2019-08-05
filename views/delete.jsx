var React = require("react");

class Delete extends React.Component {
  render() {
    // let items = this.props.items;

    let url = '/exptrack/delete-items?_method=DELETE';


    return (
      <html>
        <head />
        <body>
          <h1>Delete Item</h1>
          <div>
            <form action= {url} method="DELETE" >

>
            <div><input type ="submit" value="Submit" /></div>
            </form>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Delete;