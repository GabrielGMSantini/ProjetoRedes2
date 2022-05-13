const express = require("express");
const router = express.Router();

const amqplib = require("amqplib");
const { v4: uuidvv4 } = require("uuid");

const uuid = uuidvv4();

// Rota para Acessar as informações de todas os estoques cadastrados
router.get("/", async (req, res, next) => {
  const request = "GET";
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET in /estoques");

  channel.sendToQueue("getEstoques", Buffer.from(request.toString()), {
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
          descricao: "Retorna todas os Estoques",
          url: "http://localhost:3000/estoques",
        },
        quantidade: recData.length,
        estoques: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para Atualizar informações de um estoque
router.patch("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting POST in /estoques" + "\n");
  console.log("[X] Sending in queue patchEstoques");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("patchEstoques", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /estoques:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "PATCH",
          descricao: "Atualiza um Estoque",
          url: "http://localhost:3000/estoques",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

module.exports = router;
