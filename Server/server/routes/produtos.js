const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para Acessar as informações de todas as ONGs cadastradas
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
        ongs: result,
      });
    });
  });
});

// Rota para acessar as informações de uma ONG específica
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
          ongs: result,
        });
      }
    );
  });
});

// Rota para atualizar uma ONG
router.patch("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      `UPDATE produtos_estoque
        SET QmtTotal              = ?
      WHERE fk_produto_ID_PRODUTO = ?`,
      [
        req.body.nome,
        req.body.rua,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.nome_diretora,
        req.body.cod_ong,
      ],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(202).send({
          mensagem: "Quantidade do produto atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza a quantidade de um produto",
            url: "http://localhost:3000/produtos",
          },
        });
      }
    );
  });
});

module.exports = router;
