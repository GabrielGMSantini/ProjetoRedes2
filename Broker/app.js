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
  const queueName = "getProdutos";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: " + data.content + " in /produtos");
      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM produtos", (err, result, field) => {
          conn.release();
          console.log("[X] Replying in queue " + queueName);
          console.log("[X] Data: ");
          console.info(result);
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

// Requisição GET para /produtos/lote
const getProdutosLote = async () => {
  const queueName = "getProdutosLote";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: GET in /produtos/lote");
      recData = data.content.toString();
      console.log("[.] Data Received: ");
      console.info(recData);
      db.getConnection((err, conn) => {
        conn.query(
          "SELECT * FROM produtos WHERE Lote = ?",
          [recData],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.info(result);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(JSON.stringify(result)),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição GET para /estoques
const getEstoques = async () => {
  const queueName = "getEstoques";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: " + data.content + " in /estoques");
      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM estoques", (err, result, field) => {
          conn.release();
          console.log("[X] Replying in queue " + queueName);
          console.log("[X] Data: ");
          console.info(result);
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

// Requisição GET para /produtos/lote
const getEstoquesIdProduto = async () => {
  const queueName = "getEstoquesIdProduto";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: GET in /estoques/id_produto");
      recData = data.content.toString();
      console.log("[.] Data Received: ");
      console.info(recData);
      db.getConnection((err, conn) => {
        conn.query(
          "SELECT * FROM estoques WHERE fk_Produtos_ID_PRODUTO = ?",
          [recData],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.info(result);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(JSON.stringify(result)),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição GET para /prateleiras
const getPrateleiras = async () => {
  const queueName = "getPrateleiras";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: " + data.content + " in /prateleiras");
      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM prateleiras", (err, result, field) => {
          conn.release();
          console.log("[X] Replying in queue " + queueName);
          console.log("[X] Data: ");
          console.info(result);
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

// Requisição GET para /gondolas
const getGondolas = async () => {
  const queueName = "getGondolas";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: " + data.content + " in /gondolas");
      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM gondolas", (err, result, field) => {
          conn.release();
          console.log("[X] Replying in queue " + queueName);
          console.log("[X] Data: ");
          console.info(result);
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

// Requisição POST para /produtos
const postProdutos = async () => {
  const queueName = "postProdutos";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: POST in /produtos");
      recData = JSON.parse(data.content);
      console.log("[.] Data Received: ");
      console.info(recData);
      sentData = "Request of POST in /produtos: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          "INSERT INTO produtos (Lote, ID_PRODUTO, Nome, Preco, Data_Fabricacao, Data_Validade, Origem) VALUES (?,?,?,?,?,?,?)",
          [
            recData.lote,
            recData.id_produto,
            recData.nome,
            recData.preco,
            recData.data_fabricacao,
            recData.data_validade,
            recData.origem,
          ],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição POST para /gondolas
const postEstoques = async () => {
  const queueName = "postEstoques";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: POST in /estoques");
      recData = JSON.parse(data.content);
      console.log("[.] Data Received: ");
      console.info(recData);
      sentData = "Request of POST in /estoques: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `INSERT INTO estoques (QntTotal, QntMin, fk_Produtos_ID_PRODUTO)
          VALUES (?,?,?)`,
          [recData.qntTotal, recData.qntMin, recData.id_produto],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição POST para /gondolas
const postGondolas = async () => {
  const queueName = "postGondolas";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: POST in /gondolas");
      recData = JSON.parse(data.content);
      console.log("[.] Data Received: ");
      console.info(recData);
      sentData = "Request of POST in /gondolas: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `INSERT INTO gondolas (ID_GONDOLA, fk_Produtos_Lote, QntTotal, PrecoTotal)
          VALUES (?,?,?,?)`,
          [
            recData.id_gondola,
            recData.lote,
            recData.qntTotal,
            recData.precoTotal,
          ],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição PATCH para /estoques
const patchEstoques = async () => {
  const queueName = "patchEstoques";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: PATCH in /estoques");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /estoques: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `UPDATE estoques
            SET QntTotal         = ?
          WHERE fk_Produtos_ID_PRODUTO = ?`,
          [recData.qntTotal, recData.id_produto],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição PATCH para /prateleiras
const patchPrateleiras = async () => {
  const queueName = "patchPrateleiras";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: PATCH in /prateleiras");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /prateleiras: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `UPDATE prateleiras
            SET QntTotal         = ?,
                fk_Produtos_Lote = ?
          WHERE ID_PRATELEIRA    = ?`,
          [recData.qntTotal, recData.lote, recData.id_prateleira],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição PATCH para /gondolas
const patchGondolas = async () => {
  const queueName = "patchGondolas";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: PATCH in /gondolas");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /gondolas: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `UPDATE gondolas
            SET fk_Produtos_Lote = ?,
                QntTotal         = ?,
                PrecoTotal       = ?
          WHERE ID_GONDOLA = ?`,
          [
            recData.lote,
            recData.qntTotal,
            recData.precoTotal,
            recData.id_gondola,
          ],
          (err, result, field) => {
            conn.release();
            console.log("[X] Replying in queue " + queueName);
            console.log("[X] Data: ");
            console.log(sentData);
            channel.sendToQueue(
              data.properties.replyTo,
              Buffer.from(sentData.toString()),
              {
                correlationId: data.properties.correlationId,
              }
            );
          }
        );
      });

      channel.ack(data);
    },
    { noAck: false }
  );
};

getProdutos();
getProdutosLote();
getEstoques();
getEstoquesIdProduto();
getPrateleiras();
getGondolas();
postProdutos();
postEstoques();
postGondolas();
patchEstoques();
patchPrateleiras();
patchGondolas();

module.exports = app;
