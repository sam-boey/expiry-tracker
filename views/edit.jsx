var React = require("react");

class Edit extends React.Component {
  render() {
    let item = this.props.item;
    console.log(item);
    let url = `/exptrack/edit-item/${item.id}?_method=PUT`;

    return (
      <html>
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
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
              <a href="/exptrack/logout"> <button class="btn btn-outline-success my-2 my-sm-0" type="submit" >Logout</button> </a>
            </form>
          </div>
        </nav>
          <h1>Edit Item</h1>
          <div>
            <form action={url} method="POST" >
            <div>Name:<input type="text" name="name" defaultValue = {item.name}/> </div>
             <div>Expiry date:<input type="date" name="ed" defaultValue = {item.ed}/> </div>
             <div>Picture<input type="text" name="picture" d defaultValue ={item.picture}/></div>
            <div><input type ="submit" value="Submit" /></div>
            </form>
          </div>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
      </html>
    );
};
}

module.exports = Edit;