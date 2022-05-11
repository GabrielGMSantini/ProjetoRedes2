const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para Acessar as informações de todas os produtos cadastrados
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM produtos", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Produtos",
          url: "http://localhost:3000/produtos",
        },
        quantidade: result.length,
        produtos: result,
      });
    });
  });
});

// Rota para acessar as informações de um produto específico
router.get("/:codbarras", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "SELECT * FROM produtos WHERE ID_PRODUTO = ?",
      [req.params.codbarras],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        if (result.length == 0) {
          return res.status(404).send({
            erro: "Não foi encontrado nenhuma produto com esse código de barras",
          });
        }
        return res.status(200).send({
          request: {
            tipo: "GET",
            descricao: "Retorna um Produto",
            url: "http://localhost:3000/produtos",
          },
          produtos: result,
        });
      }
    );
  });
});

module.exports = router;
