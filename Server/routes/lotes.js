const express = require("express");
const router = express.Router();

const amqplib = require("amqplib");
const { v4: uuidvv4 } = require("uuid");

const uuid = uuidvv4();

// Rota para Acessar as informações de todas os lotes cadastrados
router.get("/", async (req, res, next) => {
  const request = "GET";
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET in /lotes");

  channel.sendToQueue("getLotes", Buffer.from(request.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = JSON.parse(data.content);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Lotes",
          url: "http://localhost:3000/lotes",
        },
        quantidade: recData.length,
        lotes: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para Acessar as informações de um lote cadastrado
router.get("/id_lote", async (req, res, next) => {
  const sentData = req.body.id_lote;
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET/ in /lotes/id_lote" + "\n");
  console.log("[X] Sending in queue getLotesID");
  console.log("[X] Data: ");
  console.log(sentData);

  channel.sendToQueue("getLotesID", Buffer.from(sentData.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = JSON.parse(data.content);
      console.log("[.] Data Received in /lotes/id_lote:");
      console.info(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "GET",
          descricao: "Retorna um Lote por ID",
          url: "http://localhost:3000/lotes/id_lote",
        },
        estoque: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para cadastrar um novo lote
router.post("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting POST in /lotes" + "\n");
  console.log("[X] Sending in queue postLotes");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("postLotes", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /lotes:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "POST",
          descricao: "Cadastra um Lote",
          url: "http://localhost:3000/lotes",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

module.exports = router;
