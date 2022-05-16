const express = require("express");
const router = express.Router();

const amqplib = require("amqplib");
const { v4: uuidvv4 } = require("uuid");

const uuid = uuidvv4();

// Rota para Acessar as informações de todas as gondolas cadastradas
router.get("/", async (req, res, next) => {
  const request = "GET";
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET in /gondolas");

  channel.sendToQueue("getGondolas", Buffer.from(request.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = JSON.parse(data.content);
      console.log("[.] Data Received in /gondolas:");
      console.info(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas as Gondolas",
          url: "http://localhost:3000/gondolas",
        },
        quantidade: recData.length,
        gondolas: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para cadastrar uma nova sessão do caixa
router.post("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting POST in /gondolas" + "\n");
  console.log("[X] Sending in queue postGondolas");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("postGondolas", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /gondolas:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "POST",
          descricao: "Cadastra uma sessão da Gondola",
          url: "http://localhost:3000/gondolas",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para Atualizar informações do caixa
router.patch("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting PATCH in /gondolas" + "\n");
  console.log("[X] Sending in queue patchGondolas");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("patchGondolas", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /gondolas:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "PATCH",
          descricao: "Atualiza uma sessão de Gondola",
          url: "http://localhost:3000/gondolas",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para deletar uma sessão do caixa
router.delete("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting DELETE in /gondolas" + "\n");
  console.log("[X] Sending in queue deleteGondolas");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("deleteGondolas", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /gondolas:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "DELETE",
          descricao: "Deleta uma sessão de Gondola",
          url: "http://localhost:3000/gondolas",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

module.exports = router;
