const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());

// Rotas usadas na aplicação
const rotaProdutos = require("./routes/produtos");
const rotaLotes = require("./routes/lotes");
const rotaPrateleiras = require("./routes/prateleiras");
const rotaGondolas = require("./routes/gondolas");

// Uso do Morgan para monitoramento de requisições
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Para dados simples
app.use(bodyParser.json()); // Para dados JSON

// Permissão de origem e cabeçalho para todos os servidores
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

// Chamada das rotas da aplicação
app.use("/produtos", rotaProdutos);
app.use("/lotes", rotaLotes);
app.use("/prateleiras", rotaPrateleiras);
app.use("/gondolas", rotaGondolas);

// Tratamento de erro ao não encontrar uma Rota válida
app.use((req, res, next) => {
  const erro = new Error("Rota não encontrada.");
  erro.status = 404;
  next(erro);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;
