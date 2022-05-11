const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para Acessar as informações de todas os estoques cadastrados
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM estoques", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
		request: {
          tipo: "GET",
          descricao: "Retorna todos os estoques",
          url: "http://localhost:3000/estoques",
        },
		quantidade: result.length,
        estoques: result,
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
      `UPDATE estoques
        SET QntTotal              = ?
      WHERE fk_Produtos_ID_PRODUTO = ?`,
      [req.body.qntTotal, req.body.codbarras],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(202).send({
          mensagem: "Quantidade no estoque do produto atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza a quantidade de um produto no estoque",
            url: "http://localhost:3000/estoques",
          },
        });
      }
    );
  });
});

module.exports = router;
