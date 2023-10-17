const express = require("express");
// const firebase = require('firebase');
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const hbs = require("hbs");

const LogInCollection = require("./mongodb"); // Verify the path

const port = "https://pink-enchanting-snapper.cyclic.app";

mongoose.connect("mongodb+srv://8203sabirahman:sabi11.333@playerapp.obw1rju.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check for database connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

const currentUserName = [];

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const foundUser = await LogInCollection.findOne({ name, password }).exec();

        if (foundUser) {
            res.render("home", {
                message: `${name} has been logged in`
            });
        } else {
            res.render('login', {
                error: `User not found`
            });
        }
        currentUserName.push(name);
    } catch (err) {
        console.error(err);
        res.render('login', {
            error: `Error: ${err}`
        });
    }
});
const passwordResetTokens = {};

app.get('/forgot', (req, res) => {
    res.render('forgot-password');
});

app.post('/forgot-password', (req, res) => {
    const { name } = req.body;

    const resetToken = generateRandomToken();
    passwordResetTokens[resetToken] = name;
    res.send(`Password reset link sent. Token: ${resetToken}`);
});

app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const email = passwordResetTokens[token];
    if (email) {
        res.render('reset-password', { token, email });
    } else {
        res.send('Invalid or expired reset token.');
    }
});

app.post('/verifyToken', async (req, res) => {
    const idToken = req.body.idToken;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        console.error('Error verifying ID token:', error);
    }
});


app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

function generateRandomToken() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
}