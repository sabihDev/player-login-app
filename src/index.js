const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const hbs = require("hbs");
const bodyParser = require('body-parser'); // Add this line

const LogInCollection = require("./mongodb"); // Verify the path

const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://8203sabirahman:sabi11.333@playerapp.obw1rju.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

// Check for database connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    const logInCollection = new LogInCollection({
        name,
        password
    });

    await logInCollection.save();
    res.render('home', {
        name
    });
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    LogInCollection.findOne({ name, password }, (err, foundUser) => { // Simplified query
        if (err) {
            console.log(err);
            res.render('login');
        } else {
            if (foundUser) {
                res.render("home", {
                    name: foundUser.name
                });
            } else {
                res.render('signup');
            }
        }
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
