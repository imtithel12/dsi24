const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars middleware
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'views' }));
app.set('view engine', 'hbs');

// Routes
app.get('/', (req, res) => {
    // Retrieve news articles sorted by date
    db.query('SELECT * FROM news ORDER BY date DESC', (err, results) => {
        if (err) throw err;
        res.render('index', { news: results });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/addnews', (req, res) => {
    const { titre, desc } = req.body;
    const news = { titre, desc, date: new Date() }; // Assuming you have a 'date' column in your news table

    db.query('INSERT INTO news SET ?', news, (err, results) => {
        if (err) throw err;
        console.log('News added to the database');
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
