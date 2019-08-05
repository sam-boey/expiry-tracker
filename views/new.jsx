var React = require("react");

class New extends React.Component {
  render() {

    return (
      <html>
        <head />
        <body>
          <h1>Add Item</h1>
          <div>
            <form action="/exptrack/add-item" method="POST" >
            <div>Name:<input type="text" name="name" /> </div>
             <div>Expiry date:<input type="date" name="ed"/> </div>
             <div>Picture<input type="text" name="picture" /></div>
            <div><input type ="submit" value="Submit" /></div>
            </form>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = New;