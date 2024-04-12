// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const loginModule = require('./client/login');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static('assets'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'nodejs'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Set up routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle sign-up form submission
app.post("/signup", function(req, res) {
    const userName = req.body.txt;
    const email = req.body.email;
    const password = req.body.pswd;

    if (!userName || !email || !password) {
        // Show an alert if sign-up form is not filled completely

        res.send('<script>alert("Please fill in all fields."); window.location.href = "/";</script>');
    } else {

       // Here you can insert the user data into your database
        connection.query("INSERT INTO signup_user(username, email, password) VALUES (?, ?, ?)", [userName, email, password], function(error, results, fields) {
            if (error) {
                res.status(500).send('<script>alert("Error while signing up."); window.location.href = "/";</script>');
            } else {
                res.send('<script>alert("Sign up successful!"); window.location.href = "/";</script>');
            }
        });
        // query = "insert into signup_user(username,email,password) values('" + userName + "', '" + email + "','" + password + "')"


        // const userData = { username: 'vijay', email: 'vijay@gmail.com', password:'123asd'};
        // connection.query(query,(error, results, fields) => {
        
        //     if(error) throw error;
        //     console.log('Inserted new user with ID:', results.insertId);
        //   });
    }
});

// Handle login form submission
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.user_pass;

    if (!username || !password) {
        // Show an alert if login form is not filled completely
        res.send('<script>alert("Please fill in all fields."); window.location.href = "/";</script>');
    } else {
    
        // Check credentials against the database
        // var query = "select * from loginuser where username "
        connection.query("SELECT * FROM signup_user WHERE username = ? AND password = ?", [username, password], function(error, results, fields) {
            if (error) {
                res.status(500).send('<script>alert("Error while logging in."); window.location.href = "/";</script>');
            } else if (results.length > 0) {
                // Successful login
                res.send('<script>alert("Login successful!"); window.location.href = "/welcome";</script>');
            } else {
                // Invalid credentials
                res.status(400).send('<script>alert("Invalid username or password."); window.location.href = "/";</script>');
            }
        });
    }
});

// Set app port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// connection.end((err) => {
//     if (err) {
//         console.error('Error ending database connection: ' + err.stack);
//         return;
//     }
//     console.log('Database connection ended.');
// });
