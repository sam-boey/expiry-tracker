console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

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
    const queryString = 'SELECT * from items'

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

// app.get('/', (request, response) => {
//   // query database for all pokemon

//   // respond with HTML page displaying all pokemon
//   response.render('home');
// });

// app.get('/new', (request, response) => {
//   // respond with HTML page with form to create new pokemon
//   response.send('new');
// });


app.get('/', homeCallback);



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