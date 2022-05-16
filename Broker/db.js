const db = require("mysql2");

const pool = db.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "redes",
});

exports.pool = pool;
