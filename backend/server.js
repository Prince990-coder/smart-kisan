const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Smart Kisan Backend is running successfully!",
        status: "OK"
    });
});

app.get("/api/farmers", (req, res) => {

    const sql = "SELECT id, name, mobile, location, crop, created_at FROM farmers";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Database error:", err.message);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});
// Farmer Registration API
app.post("/api/register", (req, res) => {

    const { name, mobile, location, crop, password } = req.body;

    if (!name || !mobile || !password) {
        return res.status(400).json({
            message: "Name, mobile and password are required"
        });
    }

    const sql = `
        INSERT INTO farmers (name, mobile, location, crop, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, mobile, location, crop, password],
        (err, result) => {

            if (err) {
                console.error("Registration error:", err.message);

                return res.status(500).json({
                    message: "Registration failed"
                });
            }

            res.status(201).json({
                message: "Farmer registered successfully!",
                farmerId: result.insertId
            });
        }
    );
});
// Farmer Login API
app.post("/api/login", (req, res) => {

    const { mobile, password } = req.body;

    if (!mobile || !password) {
        return res.status(400).json({
            message: "Mobile number and password are required"
        });
    }

    const sql = `
        SELECT id, name, mobile, location, crop
        FROM farmers
        WHERE mobile = ? AND password = ?
    `;

    db.query(sql, [mobile, password], (err, results) => {

        if (err) {
            console.error("Login error:", err.message);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid mobile number or password"
            });
        }

        res.json({
            message: "Login successful!",
            farmer: results[0]
        });
    });
});
app.listen(PORT, () => {
    console.log(`Smart Kisan Backend running at http://localhost:${PORT}`);
});