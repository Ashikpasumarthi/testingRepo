import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import { sign } from "crypto";
// import { Console } from "console";

const app = express();
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client origin
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     next();
// });
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Ashik2006@RA543",
    database: "amazonclone",
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.post('/register', async (req, res) => {
//     const registerQuery = "select * from amazonregisterdetails where Username = ? or email = ?";
//     db.query(registerQuery, [req.body.Username, req.body.email], (err, result) => {
//         if (err) {
//             res.json(err);
//         } else if (result.length > 0) {
//             res.json("User already exists");
//         } else {
//             // Handle successful registration
//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(req.body.password, salt);
//             const insert = "INSERT INTO amazonregisterdetails ('Username', 'email', 'password') VALUES (?, ?, ?)";
//             const values = [req.body.Username, req.body.email, hash];

//             db.query(insert, [values], (err, result) => {
//                 if (err) {
//                     res.json(err);
//                 } else {
//                     console.log(result);
//                     return res.json("User has been Created");

//                 }

//             })
//         }
//     });
// });


app.post('/register', (req, res) => {
    const selectQuery = "SELECT * FROM amazonregisterdetails WHERE Username = ? OR email = ?";
    // const entireQuery = "SELECT * FROM userdetails";
    db.query(selectQuery, [req.body.username, req.body.email], (err, data) => {
        if (err) {
            res.json(err);
        } else if (data.length > 0) {
            return res.json("User already exists");
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);

            const insertQuery = "INSERT INTO amazonregisterdetails (`Username`, `email`, `password`) VALUES (?)";
            const values = [
                req.body.username,
                req.body.email,
                hash
            ];
            db.query(insertQuery, [values], (err, data) => {
                if (err) {
                    res.json(err);
                } else {
                    return res.status(200).json("User has been created");
                }
            });
        }

    });

})

app.post('/login', (req, res) => {
    const selectQuery = "SELECT * FROM amazonregisterdetails WHERE email = ?";
    db.query(selectQuery, [req.body.email], (err, data) => {
        const usermatch = data.find(user => user.email === req.body.email);
        if (err) {
            console.error("Database error:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }


        else if (!usermatch) {
            res.status(401).json({ error: "User not found" });
            return;
        }

        else if (!(bcrypt.compareSync(req.body.password, usermatch.password))) {
            res.status(401).json({ error: "Wrong Password" });
            return;
        }
        else {
            // User is authenticated
            const accessToken = jwt.sign({ username: usermatch.Username, id: usermatch.id }, "jwtmysecretkey");
            usermatch.accessToken = accessToken;
            usermatch.password = undefined; // Remove password from output
            res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, maxAge: 3600000, sameSite: "none", domain: ".localhost" }); // what is being sent to cookies is a string
            // res.status(200).json({ success: true, message: "User Logged In" });
            console.log(accessToken);
            res.json({ success: true, message: "User Matched", accessToken: accessToken });
        }
    });
});


// app.post('/login', (req, res) => {
//     const selectQuery = "SELECT * FROM amazonregisterdetails WHERE email = ?";
//     db.query(selectQuery, [req.body.email], (err, data) => {
//         if (err) {
//             console.error("Database error:", err);
//             res.status(500).json({ error: "Internal Server Error" });
//         } else {
//             const usermatch = data.find(user => user.email === req.body.email);
//             if (!usermatch) {
//                 res.status(401).json({ error: "User not found" });
//             } else if (!(bcrypt.compareSync(req.body.password, usermatch.password))) {
//                 res.status(401).json({ error: "Wrong Password" });
//             } else {
//                 const accessToken = jwt.sign({ username: usermatch.Username, id: usermatch.id }, "jwtmysecretkey", { expiresIn: "1h" });
//                 usermatch.accessToken = accessToken;
//                 usermatch.password = undefined; // Remove password from output
//                 res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, maxAge: 3600000 }); // what is being sent to cookies is a string
//                 // res.status(200).json({ success: true, message: "User Logged In" });
//                 res.json("User Matched");

//             }
//         }
//     });
// });

// Define the validateToken middleware function
const validateToken = (req, res, next) => {
    // Retrieve the token from the cookie
    const token = req.cookies.accessToken || (req.headers.cookie && req.headers.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1]);
    console.log("Token:", token);

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, "jwtmysecretkey");

        // If token verification passes, attach decoded username to the request object
        req.username = decoded.username;
        next(); // Call next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Authentication error" });
    }
};


// // Apply validateToken middleware to protected routes
app.get('/home', validateToken, (req, res) => {
    res.json({ success: true, message: "You have accessed a protected route", username: req.username });
});






app.listen(3000, () => {
    console.log("Server started on port 3000");
})


// import express from "express";
// import cors from "cors";
// import mysql from "mysql2";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";

// const app = express();

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Ashik2006@RA543",
//     database: "amazonclone",
// });

// app.use(cors());
// app.use(cookieParser());
// app.use(express.json());

// app.post('/register', (req, res) => {
//     const selectQuery = "SELECT * FROM amazonregisterdetails WHERE Username = ? OR email = ?";
//     db.query(selectQuery, [req.body.username, req.body.email], (err, data) => {
//         if (err) {
//             res.json(err);
//         } else if (data.length > 0) {
//             return res.json("User already exists");
//         } else {
//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(req.body.password, salt);

//             const insertQuery = "INSERT INTO amazonregisterdetails (`Username`, `email`, `password`) VALUES (?)";
//             const values = [
//                 req.body.username,
//                 req.body.email,
//                 hash
//             ];
//             db.query(insertQuery, [values], (err, data) => {
//                 if (err) {
//                     res.json(err);
//                 } else {
//                     return res.status(200).json("User has been created");
//                 }
//             });
//         }
//     });
// });

// app.post('/login', (req, res) => {
//     const selectQuery = "SELECT * FROM amazonregisterdetails WHERE email = ?";
//     db.query(selectQuery, [req.body.email], (err, data) => {
//         if (err) {
//             console.error("Database error:", err);
//             res.status(500).json({ error: "Internal Server Error" });
//         } else {
//             const usermatch = data.find(user => user.email === req.body.email);
//             if (!usermatch) {
//                 res.status(401).json({ error: "User not found" });
//             } else if (!(bcrypt.compareSync(req.body.password, usermatch.password))) {
//                 res.status(401).json({ error: "Wrong Password" });
//             } else {
//                 const accessToken = jwt.sign({ username: usermatch.Username, id: usermatch.id }, "jwtmysecretkey", { expiresIn: "1h" });
//                 usermatch.accessToken = accessToken;
//                 usermatch.password = undefined; // Remove password from output
//                 res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 }); // what is being sent to cookies is a string
//                 res.json({ accessToken}, "User Matched"); // Send the access token in response
//             }
//         }
//     });
// });

// // Define the validateToken middleware function
// const validateTokenMiddleware = (req, res, next) => {
//     const token = req.cookies.accessToken;

//     // Check if token is present
//     if (!token) {
//         return res.status(401).json({ error: "User not authenticated" });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, "jwtmysecretkey"); // Verify the token with the secret key

//         // If token verification passes
//         req.username = decoded.username; // Add the username to the request object
//         next(); // Call next middleware or route handler

//     } catch (error) {
//         // If token verification fails
//         return res.status(401).json({ error: "Authentication error" });
//     }
// };

// // Apply validateToken middleware to protected routes
// app.get('/home', validateTokenMiddleware, (req, res) => {
//     res.json({ message: "You have accessed a protected route", username: req.username });
// });

// app.listen(3000, () => {
//     console.log("Server started on port 3001");
// });
