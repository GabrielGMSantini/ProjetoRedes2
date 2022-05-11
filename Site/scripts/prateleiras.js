var dataEstoques;
var dataProdutos;
var dataPrateleiras;

async function getPrateleiras() {
  const response = await fetch("http://localhost:3000/prateleiras", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  dataPrateleiras = data;

  const response2 = await fetch("http://localhost:3000/produtos", {
    method: "GET",
  });
  const data2 = await response2.json();
  console.log(data2);
  dataProdutos = data2;

  mostraPrateleiras();
}

function mostraPrateleiras() {
  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    var text = document.createTextNode(
      dataPrateleiras.prateleiras[i].ID_PRATELEIRA
    );
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    var text = document.createTextNode(dataPrateleiras.prateleiras[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    var text = document.createTextNode(dataPrateleiras.prateleiras[i].QntMax);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraQntMax");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      for (var j = 0; j < dataProdutos.quantidade; j++) {
        if (
          dataProdutos.produtos[j].ID_PRODUTO ==
          dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
        ) {
          product_name = dataProdutos.produtos[j].Nome;
        }
      }
      var text = document.createTextNode(product_name);
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      var text = document.createTextNode(
        dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
      );
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    if (dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO == null) {
      var text = document.createTextNode("Nenhum");
    } else {
      for (var j = 0; j < dataProdutos.quantidade; j++) {
        if (
          dataProdutos.produtos[j].ID_PRODUTO ==
          dataPrateleiras.prateleiras[i].fk_Produtos_ID_PRODUTO
        ) {
          product_preco = dataProdutos.produtos[j].preco;
        }
      }
      var text = document.createTextNode("R$" + product_preco.toFixed(2));
    }
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductPreco");
    modal_container.appendChild(tag);
  }
}

getPrateleiras();

async function mostraEstoques() {
  const response3 = await fetch("http://localhost:3000/estoques", {
    method: "GET",
  });
  const data3 = await response3.json();
  console.log(data3);
  dataEstoques = data3;

  const response4 = await fetch("http://localhost:3000/produtos", {
    method: "GET",
  });
  const data4 = await response4.json();
  console.log(data4);
  dataProdutos = data4;

  for (var i = 0; i < dataEstoques.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataEstoques.estoques[i].ID_ESTOQUE);
    tag.appendChild(text);
    var modal_container = document.getElementById("estoqueID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataEstoques.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataEstoques.estoques[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("estoqueQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataEstoques.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataEstoques.estoques[i].QntMin);
    tag.appendChild(text);
    var modal_container = document.getElementById("estoqueQntMin");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataProdutos.produtos[i].Nome);
    tag.appendChild(text);
    var modal_container = document.getElementById("productNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataEstoques.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(
      dataEstoques.estoques[i].fk_Produtos_ID_PRODUTO
    );
    tag.appendChild(text);
    var modal_container = document.getElementById("productID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataEstoques.quantidade; i++) {
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

function escolhePrateleira(i) {
  fechaPrateleiras();
  var container = document.createElement("div");
  container.classList.add("pratContainer");
  var text0 = document.createTextNode(
    `Passando do Estoque ${dataEstoques.estoques[i].ID_ESTOQUE}`
  );
  container.appendChild(text0);
  var br = document.createElement("br");
  var form = document.createElement("form");
  var label1 = document.createElement("label");
  var text1 = document.createTextNode("ID da Prateleira destino");
  var input1 = document.createElement("input");
  input1.type = "text";
  input1.name = "prat_id";
  input1.setAttribute("id", "input1");
  label1.appendChild(text1);
  form.appendChild(label1);
  form.appendChild(input1);
  form.appendChild(br);
  var label2 = document.createElement("label");
  var text2 = document.createTextNode("Número de produtos");
  var input2 = document.createElement("input");
  input2.type = "text";
  input2.name = "prat_qtde";
  input2.setAttribute("id", "input2");
  label2.appendChild(text2);
  form.appendChild(label2);
  form.appendChild(input2);
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.name = "Submit";
  submit.value = "Mover";
  submit.setAttribute("onclick", `adicionaPrateleira(${i})`);
  form.appendChild(submit);
  container.appendChild(form);
  var modal_container = document.getElementById("pratAddContainer");
  modal_container.appendChild(container);
}

async function adicionaPrateleira(i) {
  var indexPrat;
  var id_prat = document.getElementById("input1").value;
  var qtde = document.getElementById("input2").value;

  for (var j = 0; j < dataPrateleiras.quantidade; j++) {
    if (dataPrateleiras.prateleiras[j].ID_PRATELEIRA == id_prat) {
      indexPrat = j;
    }
  }

  if (
    dataPrateleiras.prateleiras[indexPrat].fk_Produtos_ID_PRODUTO !=
      dataEstoques.estoques[i].fk_Produtos_ID_PRODUTO &&
    dataPrateleiras.prateleiras[indexPrat].fk_Produtos_ID_PRODUTO != null
  ) {
    alert("Essa prateleira possui um tipo diferente de produto!!");
    escolhePrateleira(i);
    return;
  }
  if (id_prat > 12 || id_prat < 1) {
    alert("Essa prateleira não existe!!");
    escolhePrateleira(i);
    return;
  }
  if (qtde > dataEstoques.estoques[i].QntTotal) {
    alert("Esse número de produtos excede a quantidade no estoque!!");
    escolhePrateleira(i);
    return;
  }
  if (qtde == 0) {
    alert("Para completar a ação, é necessário mover pelo menos 1 produto!!");
    escolhePrateleira(i);
    return;
  }
  if (qtde < 0) {
    alert("Número de produtos impossível!!");
    escolhePrateleira(i);
    return;
  }

  var aux1 = parseInt(dataPrateleiras.prateleiras[indexPrat].QntTotal);
  var aux2 = parseInt(qtde);
  var qtdePrat = aux1 + aux2;

  var aux3 = parseInt(dataEstoques.estoques[i].QntTotal);
  var qtdeNova = aux3 - aux2;

  if (qtdeNova < dataEstoques.estoques[i].QntMin) {
    alert(
      "ATENÇÃO: Quantidade no estoque abaixo da esperada, favor reestocá-lo!!"
    );
  }

  console.log(dataEstoques.estoques[i]);
  var id_produto = dataEstoques.estoques[i].fk_Produtos_ID_PRODUTO;

  await fetch("http://localhost:3000/prateleiras", {
    method: "PATCH",
    body: JSON.stringify({
      qntTotal: qtdePrat,
      codbarras: id_produto,
      id_prateleira: id_prat,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

  console.log(qtdeNova);
  await fetch("http://localhost:3000/estoques", {
    method: "PATCH",
    body: JSON.stringify({
      qntTotal: qtdeNova,
      codbarras: id_produto,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

  fechaEstoques();
  window.location = "#closeModal";
}

function fechaEstoques() {
  var elems = document.querySelectorAll(".tag");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
  fechaPrateleiras();
}

function fechaPrateleiras() {
  var elems = document.querySelectorAll(".pratContainer");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
}

atualizaEstoque = () => {
  fetch("http://localhost:3000/estoques", {
    method: "PATCH",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      qntTotal: "",
      codbarras: "",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.log("Fetch sem sucesso.");
      }
      res.json();
    })
    .then((data) => console.log(data));
};
