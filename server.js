const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

const db = new sqlite3.Database("fuel.db");

/* =========================
   CREATE TABLES
========================= */

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS fuel_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_fuel INTEGER,
      available_fuel INTEGER,
      temperature REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vehicle_count (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

});

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   UPDATE FUEL
========================= */

app.get("/update_fuel", (req, res) => {

  const total = parseInt(req.query.total_fuel || "1000");
  const available = parseInt(req.query.available_fuel || "0");
  const temperature = parseFloat(req.query.temperature || "0");

  db.run(
    `INSERT INTO fuel_status
    (total_fuel, available_fuel, temperature)
    VALUES (?, ?, ?)`,
    [total, available, temperature],
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
        available_fuel: available,
        temperature: temperature
      });

    }
  );

});

/* =========================
   GET FUEL
========================= */

app.get("/get_fuel", (req, res) => {

  db.get(
    `SELECT
      total_fuel,
      available_fuel,
      temperature,
      created_at
     FROM fuel_status
     ORDER BY id DESC
     LIMIT 1`,
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
          available_fuel: 0,
          temperature: 0
        });
      }

      res.json({
        status: "success",
        total_fuel: row.total_fuel,
        available_fuel: row.available_fuel,
        temperature: row.temperature,
        created_at: row.created_at
      });

    }
  );

});

/* =========================
   UPDATE VEHICLE
========================= */

app.get("/update_vehicle", (req, res) => {

  const vehicle_type = req.query.vehicle_type || "Unknown";

  db.run(
    "INSERT INTO vehicle_count(vehicle_type) VALUES(?)",
    [vehicle_type],
    function (err) {

      if (err) {
        return res.json({
          status: "error",
          message: err.message
        });
      }

      res.json({
        status: "success",
        vehicle_type: vehicle_type
      });

    }
  );

});

/* =========================
   VEHICLE STATS
========================= */

app.get("/vehicle_stats", (req, res) => {

  db.all(
    `SELECT vehicle_type,
            COUNT(*) AS total
     FROM vehicle_count
     GROUP BY vehicle_type`,
    [],
    (err, rows) => {

      if (err) {
        return res.json({
          status: "error",
          message: err.message
        });
      }

      let result = {
        Car: 0,
        Bike: 0,
        Bus: 0,
        Truck: 0
      };

      rows.forEach(row => {
        result[row.vehicle_type] = row.total;
      });

      res.json(result);

    }
  );

});

/* =========================
   RESET VEHICLE
========================= */

app.get("/reset_vehicle", (req, res) => {

  db.run(
    "DELETE FROM vehicle_count",
    [],
    function (err) {

      if (err) {
        return res.json({
          status: "error",
          message: err.message
        });
      }

      res.json({
        status: "success",
        message: "Vehicle data reset"
      });

    }
  );

});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
