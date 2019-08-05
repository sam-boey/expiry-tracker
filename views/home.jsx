var React = require("react");

class Home extends React.Component {
  render() {
    let items = this.props.items;

    let list = items.map(item => {

        let date = item.ed.getDate();
        let month = item.ed.getMonth() + 1;
        let year = item.ed.getFullYear();
        let url = '/exptrack/edit-item/' + item.id;
        return (
            <div>
                <p>{item.name}</p>
                <p>{date}/{month}/{year}</p>
                <img src={item.picture} />
                <a href = {url}>Edit</a>
            </div>
        )
    });

    return (
      <html>
        <head />
        <body>
          <h1>Welcome!</h1>
            <form action="/exptrack/add-item">
                <input type="submit" value="Go to add item" />
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