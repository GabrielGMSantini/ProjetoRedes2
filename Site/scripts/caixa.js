var dataProduto;
var dataPrateleiras;
var dataCaixa;

// GET inicial do Caixa para mostrar na tela
async function getCaixa() {
  const response = await fetch("http://localhost:3000/gondolas", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  dataCaixa = data;

  const response2 = await fetch("http://localhost:3000/produtos", {
    method: "GET",
  });
  const data2 = await response2.json();
  console.log(data2);
  dataProdutos = data2;

  mostraCaixa();
}

// Colocando a gôndola puxada pelo GET na tela
function mostraCaixa() {
  for (var i = 0; i < dataCaixa.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataCaixa.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_id = dataProdutos.produtos[j].ID_PRODUTO;
      }
    }
    var text = document.createTextNode(product_id);
    tag.appendChild(text);
    var modal_container = document.getElementById("caixaProductID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataCaixa.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataCaixa.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_name = dataProdutos.produtos[j].Nome;
      }
    }
    var text = document.createTextNode(product_name);
    tag.appendChild(text);
    var modal_container = document.getElementById("caixaProductNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataCaixa.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    var text = document.createTextNode(dataCaixa.gondolas[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("caixaQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataCaixa.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataCaixa.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_preco = dataProdutos.produtos[j].Preco;
      }
    }
    var text = document.createTextNode("R$ " + product_preco.toFixed(2));
    tag.appendChild(text);
    var modal_container = document.getElementById("caixaProductPreco");
    modal_container.appendChild(tag);
  }

  vendaPreco = parseFloat(0);
  for (var i = 0; i < dataCaixa.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    var text = document.createTextNode(
      "R$ " + dataCaixa.gondolas[i].PrecoTotal.toFixed(2)
    );
    caixaPreco = parseFloat(dataCaixa.gondolas[i].PrecoTotal.toFixed(2));
    tag.appendChild(text);
    var modal_container = document.getElementById("caixaPrecoTotal");
    modal_container.appendChild(tag);
    vendaPreco = vendaPreco + caixaPreco;
    document.getElementById(
      "vendaPrecoTotal"
    ).innerHTML = `R$ ${vendaPreco.toFixed(2)}`;
  }
}

getCaixa();

// Colocando as prateleiras na tela ao clicar no botão
async function mostraPrateleiras() {
  const response3 = await fetch("http://localhost:3000/prateleiras", {
    method: "GET",
  });
  const data3 = await response3.json();
  console.log(data3);
  dataPrateleiras = data3;

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(
      dataPrateleiras.prateleiras[i].ID_PRATELEIRA
    );
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataPrateleiras.prateleiras[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataPrateleiras.prateleiras[i].QntMax);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraQntMax");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      for (var j = 0; j < dataProdutos.quantidade; j++) {
        if (
          dataProdutos.produtos[j].ID_PRODUTO ==
          dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
        ) {
          product_nome = dataProdutos.produtos[j].Nome;
        }
      }
      var text = document.createTextNode(product_nome);
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("productNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      for (var j = 0; j < dataProdutos.quantidade; j++) {
        if (
          dataProdutos.produtos[j].ID_PRODUTO ==
          dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
        ) {
          product_id = dataProdutos.produtos[j].ID_PRODUTO;
        }
      }
      var text = document.createTextNode(product_id);
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("productID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      for (var j = 0; j < dataProdutos.quantidade; j++) {
        if (
          dataProdutos.produtos[j].ID_PRODUTO ==
          dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
        ) {
          product_preco = dataProdutos.produtos[j].Preco;
        }
      }
      var text = document.createTextNode("R$ " + product_preco);
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("productPreco");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var tag = document.createElement("h3");
      tag.classList.add("tag");
      tag.classList.add("modalVoidButton");
      var text = document.createTextNode(" ");
      tag.appendChild(text);
      var modal_container = document.getElementById("addButton");
      modal_container.appendChild(tag);
    } else {
      var tag = document.createElement("h3");
      tag.classList.add("tag");
      tag.classList.add("modalAddButton");
      tag.setAttribute("onclick", `escolhePrateleira(${i})`);
      var text = document.createTextNode("+");
      tag.appendChild(text);
      var modal_container = document.getElementById("addButton");
      modal_container.appendChild(tag);
    }
  }
}

function escolhePrateleira(i) {
  fechaForm();
  var container = document.createElement("div");
  container.classList.add("formContainer");
  var text0 = document.createTextNode(`Tirando da Prateleira ${i + 1}`);
  container.appendChild(text0);
  var form = document.createElement("form");
  var label = document.createElement("label");
  var text = document.createTextNode("Número de produtos");
  var input = document.createElement("input");
  input.type = "text";
  input.name = "prat_qtde";
  input.setAttribute("id", "input");
  label.appendChild(text);
  form.appendChild(label);
  form.appendChild(input);
  var submit = document.createElement("input");
  submit.type = "a";
  submit.name = "Submit";
  submit.value = "Adicionar";
  submit.setAttribute("href", "caixa.html");
  submit.setAttribute("style", "text-align: center");
  submit.setAttribute("onclick", `adicionaCarrinho(${i})`);
  form.appendChild(submit);
  container.appendChild(form);
  var modal_container = document.getElementById("gondAddContainer");
  modal_container.appendChild(container);
}

// PATCHs, POSTs e Validações necessárias (Prateleira -> Caixa)
async function adicionaCarrinho(i) {
  var qtde = document.getElementById("input").value;
  var id_produto;
  var id_prat = i + 1;
  var preco_produto;

  if (qtde > dataPrateleiras.prateleiras[i].QntTotal) {
    alert("Esse número de produtos excede a quantidade na prateleira!!");
    history.go(-1);
    return;
  }
  if (qtde == 0) {
    alert("Para completar a ação, é necessário mover pelo menos 1 produto!!");
    history.go(-1);
    return;
  }
  if (qtde < 0) {
    alert("Número de produtos impossível!!");
    history.go(-1);
    return;
  }

  var aux1 = parseInt(dataPrateleiras.prateleiras[i].QntTotal);
  var aux2 = parseInt(qtde);
  var qtdePrat = aux1 - aux2;
  console.log(qtdePrat);

  if (qtdePrat < 1) {
    alert("Essa prateleira agora está vazia.");
    id_produto = null;
    fetch("http://localhost:3000/prateleiras", {
      method: "PATCH",
      body: JSON.stringify({
        qntTotal: qtdePrat,
        id_produto: id_produto,
        id_prateleira: id_prat,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  } else {
    id_produto =
      dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO.toString();
    fetch("http://localhost:3000/prateleiras", {
      method: "PATCH",
      body: JSON.stringify({
        qntTotal: qtdePrat,
        id_produto: id_produto,
        id_prateleira: id_prat,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  id_produto = dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO.toString();

  for (var j = 0; j < dataProdutos.quantidade; j++) {
    if (
      dataProdutos.produtos[j].ID_PRODUTO ==
      dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
    ) {
      preco_produto = dataProdutos.produtos[j].Preco;
    }
  }

  var aux3 = parseFloat(preco_produto);
  var aux4 = parseInt(qtde);
  var preco_total = aux3 * aux4;
  console.log(qtdePrat);

  for (var k = 0; k < dataCaixa.quantidade; k++) {
    if (
      dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO ==
      dataCaixa.gondolas[k].fk_Produtos_ID_PRODUTO
    ) {
      var aux5 = parseInt(dataCaixa.gondolas[k].QntTotal);
      var qnt_total = aux5 + aux4;

      var aux6 = parseFloat(dataCaixa.gondolas[k].PrecoTotal);
      var preco_total = parseFloat(preco_total) + aux6;

      var id_gondola = dataCaixa.gondolas[k].ID_GONDOLA;

      fetch("http://localhost:3000/gondolas", {
        method: "PATCH",
        body: JSON.stringify({
          qntTotal: qnt_total,
          precoTotal: preco_total,
          id_gondola: id_gondola,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      window.location.href = "./caixa.html";
      return;
    }
  }

  fetch("http://localhost:3000/gondolas", {
    method: "POST",
    body: JSON.stringify({
      id_produto: id_produto,
      qntTotal: qtde,
      precoTotal: preco_total,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  window.location.href = "./caixa.html";
}

// Removendo da tela a tabela da prateleira
function fechaPrateleiras() {
  var elems = document.querySelectorAll(".tag");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
  fechaForm();
}

// Removendo da tela a form para mover ao caixa
function fechaForm() {
  var elems = document.querySelectorAll(".formContainer");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
}

function finalizaVenda() {
  if (confirm("Tem certeza que deseja finalizar a venda?")) {
  } else {
    history.go(0);
  }
}
