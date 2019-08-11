var React = require("react");

class Home extends React.Component {
    render() {
        let items = this.props.items;

        let list = items.map(item => {

            let date = item.ed.getDate();
            let month = item.ed.getMonth() + 1;
            let year = item.ed.getFullYear();
            let editUrl = '/exptrack/edit-item/' + item.id;
            let deleteUrl = '/exptrack/delete-item/' + item.id;
            return (
                <div className= "items">
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
            <head>
             <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
            <link rel="stylesheet" href="/style.css" />
            </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="/exptrack/home">Expiry Tracker</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/exptrack/add-item">Add Item <span class="sr-only">(current)</span></a>
              </li>
                <li class="nav-item active">
                <a class="nav-link" href="/exptrack/add-spaces">Add Spaces <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Spaces
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="#">Fridge</a>
                  <a class="dropdown-item" href="#">Kitchen Cabinet 1</a>
                  <a class="dropdown-item" href="#">Kitchen Cabinet 2</a>
                </div>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
             <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Profile</button>
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
            </form>
          </div>
        </nav>
        <div class="container">
            <div class="row">
            <div class = "col-4">
              <h1>hellooooo</h1>
            </div>
            <div class= "col-8">
              {list}
            </div>
          </div>
        </div>
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
    </html>
        );
    }
}




module.exports = Home;