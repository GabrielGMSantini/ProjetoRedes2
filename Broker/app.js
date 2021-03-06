const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./db").pool;
const { MongoClient, ServerApiVersion } = require("mongodb");
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

// Requisição GET para /produtos/:id_produto
const getProdutosID = async () => {
  const queueName = "getProdutosID";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: GET in /produtos/:id_produto");
      recData = data.content.toString();
      console.log("[.] Data Received: ");
      console.info(recData);
      db.getConnection((err, conn) => {
        conn.query(
          "SELECT * FROM produtos WHERE ID_PRODUTO = ?",
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

// Requisição GET para /lotes
const getLotes = async () => {
  const queueName = "getLotes";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: " + data.content + " in /lotes");
      db.getConnection((err, conn) => {
        conn.query("SELECT * FROM lotes", (err, result, field) => {
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

// Requisição GET para /lotes/:id_lote
const getLotesID = async () => {
  const queueName = "getLotesID";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: GET in /lotes/:id_lote");
      recData = data.content.toString();
      console.log("[.] Data Received: ");
      console.info(recData);
      db.getConnection((err, conn) => {
        conn.query(
          "SELECT * FROM lotes WHERE ID_Lote = ?",
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
          "INSERT INTO produtos (ID_PRODUTO, Nome, Preco, QntTotal, QntMin) VALUES (?,?,?,?,?)",
          [
            recData.id_produto,
            recData.nome,
            recData.preco,
            recData.qntTotal,
            recData.qntMin,
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

// Requisição POST para /lotes
const postLotes = async () => {
  const queueName = "postLotes";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: POST in /lotes");
      recData = JSON.parse(data.content);
      console.log("[.] Data Received: ");
      console.info(recData);
      sentData = "Request of POST in /lotess: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `INSERT INTO lotes (ID_LOTE, Data_Fabricacao, Data_Validade, Origem, fk_Produtos_ID_PRODUTO)
          VALUES (?,?,?,?,?)`,
          [
            recData.id_lote,
            recData.data_fabricacao,
            recData.data_validade,
            recData.origem,
            recData.id_produto,
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
          `INSERT INTO gondolas (fk_Produtos_ID_PRODUTO, QntTotal, PrecoTotal)
          VALUES (?,?,?)`,
          [recData.id_produto, recData.qntTotal, recData.precoTotal],
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

// Requisição PATCH para /produtos
const patchProdutos = async () => {
  const queueName = "patchProdutos";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: PATCH in /produtos");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /produtos: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `UPDATE produtos
            SET QntTotal   = ?
          WHERE ID_PRODUTO = ?`,
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
            SET QntTotal         = ?
          WHERE ID_PRATELEIRA    = ?`,
          [recData.qntTotal, recData.id_prateleira],
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
            SET QntTotal               = ?,
                PrecoTotal             = ?
          WHERE ID_GONDOLA             = ?`,
          [recData.qntTotal, recData.precoTotal, recData.id_gondola],
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

// Requisição DELETE para /gondolas
const deleteGondolas = async () => {
  const queueName = "deleteGondolas";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  channel.consume(
    queueName,
    (data) => {
      console.log("[.] Request Received: DELETE in /gondolas");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of DELETE in /gondolas: Successful";
      db.getConnection((err, conn) => {
        conn.query(
          `DELETE FROM gondolas
          WHERE ID_GONDOLA = ?`,
          [recData.id_gondola],
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

//Requisição GET do MongoDB
const getMongo = async () => {
  const queueName = "getMongo";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);
  channel.consume(
    queueName,
    async (data) => {
      databasesList = await client.db("Redes2").collection("Redes2");
      documento = await databasesList.find({}).toArray();
      console.log("[.] Request Received: " + data.content + " in /Mongodb");
      console.log("Documentos Encontrados =>", documento);

      console.log("[X] Replying in queue " + queueName);
      console.log("[X] Data: ");
      console.info(documento);
      channel.sendToQueue(
        data.properties.replyTo,
        Buffer.from(JSON.stringify(documento)),
        {
          correlationId: data.properties.correlationId,
        }
      );

      channel.ack(data);
    },
    { noAck: false }
  );
};

// Requisição PATCH para /Mongodb/rotatividade
const patchMongoReposicoesPlusOne = async () => {
  const queueName = "patchMongoReposicoesPlusOne";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: PATCH in /Mongodb/reposicoesplusone");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /Mongodb/reposicoesplusone: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      documento = await databasesList.findOne({ nome: recData.Nome });
      console.log(documento);
      reposicoes = documento.reposições + 1;
      const updateResult = await databasesList.updateOne(
        { nome: recData.Nome },
        { $set: { reposições: reposicoes } }
      );
      console.log("Updated documents =>", updateResult);

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

      channel.ack(data);
    },
    { noAck: false }
  );
};

const getMongoNome = async () => {
  const queueName = "getMongoNome";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: GET in /Mongodb/:nome");
      recData = data.content.toString();
      console.log("[.] Data Received: ");
      console.info(recData);
      databasesList = await client.db("Redes2").collection("Redes2");
      result = await databasesList.findOne({ nome: recData });
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

      channel.ack(data);
    },
    { noAck: false }
  );
};

const patchMongoreposicoes = async () => {
  const queueName = "patchMongoreposicoes";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: PATCH in /Mongodb/reposicoes");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /Mongodb/reposicoes: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      const updateResult = await databasesList.updateOne(
        { nome: recData.Nome },
        { $set: { reposições: recData.reposições } }
      );
      console.log("Updated documents =>", updateResult);

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

      channel.ack(data);
    },
    { noAck: false }
  );
};

const postMongo = async () => {
  const queueName = "postMongo";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: POST in /Mongodb");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of POST in /Mongodb: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      const updateResult = await databasesList.insertOne(recData);
      console.log("Updated documents =>", updateResult);

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

      channel.ack(data);
    },
    { noAck: false }
  );
};

const patchMongoAbastecimentosPlusOne = async()=>{
  const queueName = "patchMongoAbastecimentosPlusOne";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: PATCH in /Mongodb/abastecimentosplusone");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /Mongodb/abastecimentosplusone: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      documento = await databasesList.findOne({ nome: recData.Nome });
      console.log(documento);
      abastecimentos = documento.abastecimentos + 1;
      const updateResult = await databasesList.updateOne(
        { nome: recData.Nome },
        { $set: { abastecimentos: abastecimentos } }
      );
      console.log("Updated documents =>", updateResult);

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

      channel.ack(data);
    },
    { noAck: false }
  );
}

const patchQuantidadePrateleiras = async()=>{
  const queueName = "patchQuantidadePrateleiras";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: PATCH in /Mongodb/quantidadeprateleiras");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /Mongodb/quantidadeprateleiras: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      const updateResult = await databasesList.updateOne(
        { nome: recData.Nome },
        { $set: { qtddmaximaprateleira: recData.qtddmaximaprateleira,
                  qtddminimaprateleira: recData.qtddminimaprateleira } }
      );
      console.log("Updated documents =>", updateResult);

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

      channel.ack(data);
    },
    { noAck: false }
  );
}
const patchSomaVendas = async()=>{
  const queueName = "patchSomaVendas";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  const uri =
    "mongodb+srv://root:1234@cluster0.tn6hl.mongodb.net/Redes2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  channel.prefetch(1);

  channel.consume(
    queueName,
    async (data) => {
      console.log("[.] Request Received: PATCH in /Mongodb/somavendas");
      recData = JSON.parse(data.content);
      console.log("[.] Received Data: ");
      console.info(recData);
      sentData = "Request of PATCH in /Mongodb/somavendas: Successful";
      databasesList = await client.db("Redes2").collection("Redes2");
      console.log("length:");
      console.log(recData.length);
      for(i=0;i<recData.length;i++){
        console.log(i);
        documento = await databasesList.findOne({nome: recData[i].Nome});
        console.log(documento);
        const updateResult = await databasesList.updateOne(
          { nome: recData[i].Nome },
          { $set: { vendas: recData[i].vendas + documento.vendas }}
        );
        console.log("Updated documents =>", updateResult);
      }
      

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

      channel.ack(data);
    },
    { noAck: false }
  );
}

getProdutos(); //OK
getProdutosID(); //OK
getLotes(); //OK
getLotesID(); //OK
getPrateleiras(); //OK
getGondolas(); //OK
postProdutos(); //OK
postLotes(); //OK
postGondolas(); //OK
patchProdutos(); //OK
patchPrateleiras(); //OK
patchGondolas(); //OK
deleteGondolas(); //OK
getMongo(); //OK
getMongoNome(); //OK
patchMongoReposicoesPlusOne(); //OK
patchMongoreposicoes(); //OK
postMongo(); //OK
patchMongoAbastecimentosPlusOne(); //OK
patchQuantidadePrateleiras(); //OK
patchSomaVendas(); //OK
module.exports = app;
