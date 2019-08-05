console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

var moment = require('moment');

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
}




/**
 * ===================================
 * Routes
 * ===================================
 */


//Redirect to home page
app.get('/', (request,response) => {
    response.redirect('/exptrack');
});

//Home page
app.get('/exptrack', homeCallback);

//Add items page
app.get ('/exptrack/add-item' , (request ,response) => {
    response.render('new')
});

//Adding items into DB
app.post('/exptrack/add-item' , ( request,response) => {
    var newItem = request.body;
    console.log(newItem);
    let now= moment().format('L');
    console.log(now)

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
                    response.redirect('/exptrack');
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
                    response.redirect('/exptrack');
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
        let now = moment().format('LL');
        let expiryDate = moment(newItem.ed).format('LL')
               now = Date.parse(now);
        expiryDate = Date.parse(newItem.ed);

        // query string to input values to table
        const queryString = 'UPDATE items SET name= $1, ed =$2, picture=$3 WHERE id = $4';
        let values = [newItem.name, newItem.ed, newItem.picture , id];
                pool.query(queryString, values, (err, result) => {

                  if (err) {
                    console.error('query error:', err.stack);
                    response.send( 'query error' );
                  } else {
                    console.log('query result:', result);
                    response.redirect('/exptrack');
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