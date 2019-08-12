var React = require("react");

class Login extends React.Component {
    render() {
        return (
      <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />


            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"/>
            <link rel="stylesheet" href="/style.css"></link>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <a class="navbar-brand" href="/exptrack">Expiry Tracker</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                  </li>
                </ul>
              </div>
            </nav>
                <div class="logindiv">
                    <form method="POST" action="/exptrack/logincheck">
                    <div class="loginTitle">
                        <h2>Login to your account</h2>
                    </div>
                        <div class="form-row align-items-center justify-content-center">
                            <div class="col-1">
                                <label>Username:</label>
                            </div>
                            <div class="col-2">
                                <input class="form-control"  name="username" />
                            </div>
                        </div>
                        <div class="form-row align-items-center justify-content-center">
                            <div class="col-1">
                                <label>Password:</label>
                            </div>
                            <div class="col-2">
                                <input class="form-control"  type="password" name="password" />
                            </div>
                        </div>
                    <div class= "submitBtn">
                        <div class="form-row align-items-center justify-content-center">
                            <input id="loginSubmit" type="submit" value="Login" class="btn btn-primary btn-lg active"/>
                        </div>
                    </div>
                    </form>
                </div>
                <div class = "buttonsCol">
                </div>
                <div class="form-row align-items-center justify-content-center">
                    <a href="/exptrack/register"><button class="btn btn-primary btn-lg active">Register for an account</button></a>
                </div>

             <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        </body>
      </html>
        );
    }
}

module.exports = Login;