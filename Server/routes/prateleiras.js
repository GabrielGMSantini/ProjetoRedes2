const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para Acessar as informações de todas as prateleiras cadastradas
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM prateleiras", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas as Prateleiras",
          url: "http://localhost:3000/prateleiras",
        },
        quantidade: result.length,
        prateleiras: result,
      });
    });
  });
});

// Rota para atualizar um estoque
router.patch("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      `UPDATE prateleiras
        SET QntTotal                = ?,
            fk_Produtos_ID_PRODUTO  = ?
       WHERE ID_PRATELEIRA          = ?`,
      [req.body.qntTotal, req.body.codbarras, req.body.id_prateleira],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(202).send({
          mensagem:
            "Quantidade na prateleira do produto atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza a quantidade de um produto na prateleira",
            url: "http://localhost:3000/prateleiras",
          },
        });
      }
    );
  });
});

module.exports = router;
