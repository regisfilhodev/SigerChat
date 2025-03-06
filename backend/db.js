const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.localhost,
  user: process.env.root,
  password: "master",
  database: process.env.sigerchat,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao banco de dados!");
  }
});

module.exports = connection;
