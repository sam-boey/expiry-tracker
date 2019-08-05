var React = require("react");

class Edit extends React.Component {
  render() {
    let item = this.props.item;
    console.log(item);
    let url = `/exptrack/edit-item/${item.id}?_method=PUT`;

    return (
      <html>
        <head />
        <body>
          <h1>Edit Item</h1>
          <div>
            <form action={url} method="POST" >
            <div>Name:<input type="text" name="name" defaultValue = {item.name}/> </div>
             <div>Expiry date:<input type="date" name="ed" defaultValue = {item.ed}/> </div>
             <div>Picture<input type="text" name="picture" d defaultValue ={item.picture}/></div>
            <div><input type ="submit" value="Submit" /></div>
            </form>
          </div>
        </body>
      </html>
    );
};
}

module.exports = Edit;