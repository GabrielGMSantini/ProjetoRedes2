const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./db").pool;

const amqplib = require("amqplib");

const cors = require("cors");
app.use(cors());

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

// Requisição GET para /produtos
const getProdutos = async () => {
  const queueName = "produtos";
  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      var estoques;

      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM estoques", (err, result, field) => {
          conn.release();
          channel.sendToQueue(
            data.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            {
              correlationId: data.properties.correlationId,
            }
          );
        });
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

getProdutos();

module.exports = app;
