const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database("fuel.db");

db.run(`
CREATE TABLE IF NOT EXISTS fuel_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_fuel INTEGER,
  available_fuel INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.get("/", (req, res) => {
  res.send("Fuel Tank Monitor Running");
});

app.get("/update_fuel", (req, res) => {

  const total = parseInt(req.query.total_fuel || 1000);
  const available = parseInt(req.query.available_fuel || 0);

  db.run(
    "INSERT INTO fuel_status(total_fuel, available_fuel) VALUES(?, ?)",
    [total, available],
    function(err) {

      if(err){
        return res.json({
          status: "error"
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
    "SELECT * FROM fuel_status ORDER BY id DESC LIMIT 1",
    [],
    (err, row) => {

      if(err){
        return res.json({
          status: "error"
        });
      }

      res.json(row);

    }
  );

});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});