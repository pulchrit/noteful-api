const app = require('./app');
const { PORT, DB_URL } = require('./config');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: DB_URL
});

// Sets the knex instance (db) on the express app instance. 
// So wherever we use app, we can access the db.
app.set('db', db);

app.listen(PORT, () => {
    console.log(`noteful server is listening at ${PORT}`);
});