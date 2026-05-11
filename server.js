const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve HTML, CSS, JS files
app.use(express.static(__dirname));

const db = new sqlite3.Database("fuel.db");

db.run(`
CREATE TABLE IF NOT EXISTS fuel_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_fuel INTEGER,
  available_fuel INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.get("/update_fuel", (req, res) => {
  const total = parseInt(req.query.total_fuel || "1000");
  const available = parseInt(req.query.available_fuel || "0");

  db.run(
    "INSERT INTO fuel_status(total_fuel, available_fuel) VALUES(?, ?)",
    [total, available],
    function (err) {
      if (err) {
        return res.json({
          status: "error",
          message: err.message
        });
      }

      res.json({
        status: "success",
        total_fuel: total,
        available_fuel: available
      });
    }
  );
});

app.get("/get_fuel", (req, res) => {
  db.get(
    "SELECT total_fuel, available_fuel, created_at FROM fuel_status ORDER BY id DESC LIMIT 1",
    [],
    (err, row) => {
      if (err) {
        return res.json({
          status: "error",
          message: err.message
        });
      }

      if (!row) {
        return res.json({
          status: "success",
          total_fuel: 1000,
          available_fuel: 0
        });
      }

      res.json({
        status: "success",
        total_fuel: row.total_fuel,
        available_fuel: row.available_fuel,
        created_at: row.created_at
      });
    }
  );
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
