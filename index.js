console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

const moment = require('moment');

const sha256 = require('js-sha256');
const SALT = "NO MORE EXPIRED FOOD";

//require the url library
//this comes with node, so no need to yarn add
const url = require('url');

//check to see if we have this heroku environment variable
if( process.env.DATABASE_URL ){

  //we need to take apart the url so we can set the appropriate configs

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

    }

    else{

  //otherwise we are on the local network
  var configs = {
      user: 'sam',
      host: '127.0.0.1',
      database: 'exp_tracker',
      port: 5432
  };
}

const pool = new pg.Pool(configs);

pool.on('error', function(err) {
    console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));
var cookieParser = require('cookie-parser')
app.use(cookieParser());

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);





/**
 * ===================================
 * Function Declarations
 * ===================================
 */

homeCallback = (request, response) => {
    if (request.cookies) {
        if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) {
            let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
            let userId = request.cookies['User'];
        }

        const queryString = 'SELECT items.id, name, ed, picture FROM items INNER JOIN users ON (users.id = items.user_id) WHERE items.user_id = $1 ORDER BY ed ASC';

        const values = [parseInt(request.params.id)];

        pool.query(queryString, values, (err, result) => {

            if (err) {
                console.error('query error:', err.stack);
                response.send('query error');
            } else {
                // console.log('query result:', result);
                let data = {
                    items: result.rows || []
                }

                response.render('home', data);

            }
        });
    }
     else {
        response.redirect(`/exptrack`);
    }
};





/**
 * ===================================
 * Routes
 * ===================================
 */


//Redirect to home page
app.get('/', (request, response) => {
    response.redirect('/exptrack');
});

//Login page
app.get('/exptrack', (request, response) => {
    if (request.cookies && (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"])) {
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let userId = request.cookies['User'];

        response.redirect(`/exptrack/home/${userId}`);

    }
     else {
        response.render('login');
    }
});

//checking login POST
app.post('/exptrack/logincheck', (request, response) => {
    // hash the password
    let hashedPassword = sha256(request.body.password + SALT);
    // console.log(request.body);

    const queryString = "SELECT * FROM users WHERE username=$1 AND password=$2";

    const values = [request.body.username, hashedPassword];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);

        } else {
            if (res.rows[0] === undefined) {
                response.send("Sorry, the user name/password was incorrect.");
            } else {
                console.log("Logged in!");

                let hashedLogin = sha256("you are in" + res.rows[0].id + SALT);
                // check to see if err is null
                let queryString = "SELECT * FROM items WHERE user_id= $1 "
                pool.query(queryString, [res.rows[0].id], (err, result) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        let data = {
                            items: result.rows
                        }

                        // they have successfully registered, log them in
                        response.cookie('loggedin', hashedLogin);
                        response.cookie('User', res.rows[0].id);
                        response.render('home', data)
                        // response.redirect('/exptrack/home/' + res.rows[0].id);
                    }
                });
            }
        }
    });
});

//Home page
app.get('/exptrack/home/:id', homeCallback);

//Add items page
app.get('/exptrack/add-item', (request, response) => {
    if (request.cookies) {
        if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) {
            let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
            let cookieUserId = request.cookies['User'];
            let anylogdata = false;
            const data = {
                cookieLogin: cookieLogin,
                cookieUserId: cookieUserId,
                anylogdata: anylogdata
            }
            response.render('new', data);
        }
    } else {
        console.log('');
    }
});

//Adding items into DB
app.post('/exptrack/add-item', (request, response) => {
    var newItem = request.body;
    console.log(newItem);
    let userId = request.cookies['User'];

    const queryString = 'INSERT INTO items (name ,ed , picture,user_id ) VALUES ( $1, $2, $3 ,$4)';
    let values = [newItem.name, newItem.ed, newItem.picture, userId];
    pool.query(queryString, values, (err, result) => {

        if (err) {
            console.error('query error:', err.stack);
            response.send('query error');
        } else {
            console.log('query result:', result);
            // response.send( "New item has been created!" );
            //redirecting to home page after adding item
            response.redirect(`/exptrack/home/${userId}`);
        }
    });
});

//Deleting an item
app.get('/exptrack/delete-item/:id', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) {
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];
        let inputId = parseInt(request.params.id);
        const queryString = 'SELECT * FROM items WHERE id= $1';
        let value = [inputId];

        pool.query(queryString, value, (err, result) => {

            if (err) {
                console.error('query error:', err.stack);
                response.send('query error');
            } else {
                console.log('query result:', result);
                let data = {
                    item: result.rows[0],
                    cookieLogin: cookieLogin,
                    cookieUserId: cookieUserId
                }
                response.render('delete', data);
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/exptrack');
    }
});

//Deleting an item POST
app.delete('/exptrack/delete-item/:id', (request, response) => {
    let id = parseInt(request.params.id);
    var newItem = request.body;
    // query string to input values to table
    const queryString = 'DELETE FROM items WHERE id = $1';
    let value = [id]
    pool.query(queryString, value, (err, result) => {

        if (err) {
            console.error('query error:', err.stack);
            response.send('query error');
        } else {
            console.log('query result:', result);
            response.redirect('/exptrack/home/' + request.cookies['User']);
        }
    });
});

//Editing an item
app.get('/exptrack/edit-item/:id', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) {
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];
        let anylogdata = false;
        let id = parseInt(request.params.id);
        const queryString = 'SELECT * FROM items WHERE id= $1';
        let value = [id];

        pool.query(queryString, value, (err, result) => {

            if (err) {
                console.error('query error:', err.stack);
                response.send('query error');
            } else if (false) {
                if (res.rows[0] === undefined) {
                    response.send("Please add items before trying to use this function");
                }
            } else {
                console.log('query result:', result);
                let data = {
                    item: result.rows[0],
                    cookieLogin: cookieLogin,
                    cookieUserId: cookieUserId,
                    anylogdata: anylogdata
                }
                response.render('edit', data);
            }

        });
    };
});

//Editing an item POST
app.put('/exptrack/edit-item/:id', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) {
        let id = parseInt(request.params.id);
        var newItem = request.body;
        console.log("newItem", newItem);

        // query string to input values to table
        const queryString = 'UPDATE items SET name= $1, ed =$2, picture=$3 WHERE id = $4';
        let values = [newItem.name, newItem.ed, newItem.picture, id];
        console.log("gonna save edit");
        pool.query(queryString, values, (err, result) => {
            console.log(err);
            if (err) {
                console.error('query error:', err.stack);
                response.send('query error');
            } else {
                console.log('query result:', result);
                response.redirect('/exptrack/home/' + request.cookies['User']);
            }
        });
    }
});

//Logout
app.get('/exptrack/logout', (request, response) => {
    response.clearCookie('loggedin');
    response.clearCookie('User');
    response.render('login');
    // response.redirect('/exptrack');
});

//Register
app.get('/exptrack/register', (request, response) => {
    response.render('register');
});

//Registering user POST
app.post('/exptrack/register', (request, response) => {
    // hash the password
    let hashedPassword = sha256(request.body.password + SALT);

    const queryString = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";

    const values = [request.body.username, hashedPassword];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log("User signed up!");
            // console.log(res.rows[0] );

            let hashedLogin = sha256("you are in" + res.rows[0].id + SALT);


            // check to see if err is null

            // they have successfully registered, log them in
            response.cookie('loggedin', hashedLogin);
            response.cookie('User', res.rows[0].id);
            // response.send('worked');
            response.redirect('/exptrack/home/' + res.rows[0].id);
        }
    });
});



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function() {

    console.log("closing");

    server.close(() => {

        console.log('Process terminated');

        pool.end(() => console.log('Shut down db connection pool'));
    })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);