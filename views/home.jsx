var React = require("react");

class Home extends React.Component {
  render() {
    let items = this.props.items;

    let list = items.map(item => {

        let date = item.ed.getDate();
        let month = item.ed.getMonth() + 1;
        let year = item.ed.getFullYear();
        let editUrl = '/exptrack/edit-item/' + item.id;
        let deleteUrl = '/exptrack/delete-item/' +item.id;
        return (
            <div>
                <p>{item.name}</p>
                <p>{date}/{month}/{year}</p>
                <img src={item.picture} />
                <a href = {editUrl}>Edit</a>
                <a href = {deleteUrl}>Delete</a>
            </div>
        )
    });

    return (
      <html>
        <head />
        <body>
          <h1>Expiry Tracker</h1>
            <form action="/exptrack/add-item">
                <input type="submit" value="Add item" />
            </form>
          <div></div>
          <div>
              {list}
          </div>
        </body>
    </html>
    );
  }
}




module.exports = Home;