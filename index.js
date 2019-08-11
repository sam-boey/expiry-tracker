console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

const moment = require('moment');

const sha256 = require('js-sha256');
const SALT = "NO MORE EXPIRED FOOD";


// Initialise postgres client
const configs = {
  user: 'sam',
  host: '127.0.0.1',
  database: 'exp_tracker',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
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
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        var cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        var cookieUserId = request.cookies['User'];
        console.log("get cookies user id: "+ cookieUserId);
        //console.log(response.body);

    const queryString = 'SELECT * from items ORDER BY ed ASC';

    pool.query(queryString, (err, result) => {

        if (err) {
            console.error('query error:', err.stack);
            response.send( 'query error' );
        } else {
            console.log('query result:', result);

            // redirect to home page
            let data = {
                items: result.rows
            }

            response.render('home', data);
        };
    })
};
}




/**
 * ===================================
 * Routes
 * ===================================
 */


//Redirect to home page
app.get('/', (request,response) => {
    response.redirect('/exptrack/home');
});

//Home page
app.get('/exptrack/home', homeCallback);

//Add items page
app.get ('/exptrack/add-item' , (request ,response) => {
    response.render('new')
});

//Adding items into DB
app.post('/exptrack/add-item' , ( request,response) => {
    var newItem = request.body;
    console.log(newItem);

        const queryString = 'INSERT INTO items (name ,ed , picture ) VALUES ( $1, $2, $3)';
        let values = [newItem.name, newItem.ed, newItem.picture];
                pool.query(queryString,values, (err, result) => {

                  if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                  } else {
                    console.log('query result:', result);
                    // response.send( "New item has been created!" );
                    //redirecting to home page after adding item
                    response.redirect('/exptrack/home');
                  }
        });
});

//Deleting an item
app.get ('/exptrack/delete-item/:id' , (request ,response) => {
        let id = request.params.id;
        const queryString = 'SELECT * FROM items WHERE id= $1';
        let value = [id];

            pool.query(queryString, value, (err, result) => {

                if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                } else {
                    console.log('query result:', result);
                    let data = {
                        item: result.rows[0]
                    }
                    response.render('delete',data);
                    }
             });
});

//Deleting an item POST
app.delete('/exptrack/delete-item/:id', (request, response) => {
        let id = request.params.id;
        var newItem = request.body;

        // query string to input values to table
        const queryString = 'DELETE FROM items WHERE id = $1';
        let value = [id]
                pool.query(queryString, value, (err, result) => {

                  if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                  } else {
                    console.log('query result:', result);
                    response.redirect('/exptrack/home');
                    }
            });
});

//Editing an item
app.get ('/exptrack/edit-item/:id' , (request ,response) => {
        let id = request.params.id;
        const queryString = 'SELECT * FROM items WHERE id= $1';
        let value = [id];

            pool.query(queryString, value, (err, result) => {

                if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                } else {
                    console.log('query result:', result);
                    let data = {
                        item: result.rows[0]
                    }
                    response.render('edit', data);
                    }
             });
    });

//Editing an item POST
app.put('/exptrack/edit-item/:id' , ( request,response) => {
        let id = request.params.id;
        var newItem = request.body;

        // query string to input values to table
        const queryString = 'UPDATE items SET name= $1, ed =$2, picture=$3 WHERE id = $4';
        let values = [newItem.name, newItem.ed, newItem.picture , id];
                pool.query(queryString, values, (err, result) => {

                  if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                  } else {
                    console.log('query result:', result);
                    response.redirect('/exptrack/home');
                    }
            });
    });

Logout
app.get('/exptrack/logout', (request, response) => {
    response.clearCookie('loggedin');
    response.clearCookie('User');
    response.redirect('/exptrack');
});

//Register
app.get('/exptrack/register', (request, response) => {
    response.render('register');
});

//Registering user POST
app.post('/exptrack/register', (request, response) => {
    // hash the password
    let hashedPassword = sha256( request.body.password + SALT );

    const queryString = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";

    const values = [request.body.username, hashedPassword];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log("YAY");
            // console.log(res.rows[0] );

            let hashedLogin = sha256("you are in" + res.rows[0].id + SALT);


            // check to see if err is null

            // they have successfully registered, log them in
            response.cookie('loggedin', hashedLogin);
            response.cookie('User', res.rows[0].id);
            // response.send('worked');
            response.redirect('/exptrack/home' + res.rows[0].id);
        }
    });
});



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);