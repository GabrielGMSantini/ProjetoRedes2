const express = require("express");
const router = express.Router();

const amqplib = require("amqplib");
const { v4: uuidvv4 } = require("uuid");

const uuid = uuidvv4();

// Rota para Acessar as informações de todos os produtos cadastrados
router.get("/", async (req, res, next) => {
  const request = "GET";
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET in /produtos" + "\n");

  channel.sendToQueue("getProdutos", Buffer.from(request.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = JSON.parse(data.content);
      console.log("[.] Data Received in /produtos:");
      console.info(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Produtos",
          url: "http://localhost:3000/produtos",
        },
        quantidade: recData.length,
        produtos: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para Acessar as informações de um produto cadastrado
router.get("/:id_produto", async (req, res, next) => {
  const sentData = req.params.id_produto;
  var recData;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting GET/ in /produtos/:id_produto" + "\n");
  console.log("[X] Sending in queue getProdutosID");
  console.log("[X] Data: ");
  console.log(sentData);

  channel.sendToQueue("getProdutosID", Buffer.from(sentData.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = JSON.parse(data.content);
      console.log("[.] Data Received in /produtos/:id_produto:");
      console.info(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "GET",
          descricao: "Retorna um Produto por ID",
          url: "http://localhost:3000/produtos/:id_produto",
        },
        produto: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para cadastrar um novo produto
router.post("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting POST in /produtos" + "\n");
  console.log("[X] Sending in queue postProdutos");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("postProdutos", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /produtos:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "POST",
          descricao: "Cadastra um Produtos",
          url: "http://localhost:3000/produtos",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

// Rota para Atualizar informações de um produto
router.patch("/", async (req, res, next) => {
  var recData;
  var sentData = req.body;

  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[X] Requesting PATCH in /produtos" + "\n");
  console.log("[X] Sending in queue patchProdutos");
  console.log("[X] Data: ");
  console.info(sentData);

  channel.sendToQueue("patchProdutos", Buffer.from(JSON.stringify(sentData)), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(
    q.queue,
    (data) => {
      recData = data.content.toString();
      console.log("[.] Data Received in /produtos:");
      console.log(recData);
      if (data.properties.correlationId == uuid) {
      }
      return res.send({
        request: {
          tipo: "PATCH",
          descricao: "Atualiza um Produto",
          url: "http://localhost:3000/produtos",
        },
        response: recData,
      });
    },
    { noAck: true }
  );
});

module.exports = router;
