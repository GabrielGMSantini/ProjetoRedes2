var dataProdutos;
var dataPrateleiras;

// GET inicial das Prateleiras para mostrar na tela
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

// Colocando as prateleiras puxadas pelo GET na tela
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
    var text = document.createTextNode(dataProdutos.produtos[i].Nome);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    var text = document.createTextNode(dataProdutos.produtos[i].ID_PRODUTO);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataPrateleiras.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("pratElem");
    var text = document.createTextNode(dataProdutos.produtos[i].Preco);
    tag.appendChild(text);
    var modal_container = document.getElementById("prateleiraProductPreco");
    modal_container.appendChild(tag);
  }
}

getPrateleiras();

// Colocando o estoque dos produtos na tela ao clicar no botão
async function mostraProdutos() {
  const response3 = await fetch("http://localhost:3000/produtos", {
    method: "GET",
  });
  const data3 = await response3.json();
  console.log(data3);
  dataProdutos = data3;

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataProdutos.produtos[i].ID_PRODUTO);
    tag.appendChild(text);
    var modal_container = document.getElementById("produtoID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataProdutos.produtos[i].Nome);
    tag.appendChild(text);
    var modal_container = document.getElementById("produtoNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(
      "R$ " + dataProdutos.produtos[i].Preco.toFixed(2)
    );
    tag.appendChild(text);
    var modal_container = document.getElementById("produtoPreco");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataProdutos.produtos[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("produtoQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("tag");
    var text = document.createTextNode(dataProdutos.produtos[i].QntMin);
    tag.appendChild(text);
    var modal_container = document.getElementById("produtoQntMin");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataProdutos.quantidade; i++) {
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

// Colocando na tela a form para escolher quantos produtos mandar para qual prateleira
function escolhePrateleira(i) {
  fechaForm();
  var container = document.createElement("div");
  container.classList.add("formContainer");
  var text0 = document.createTextNode(
    `Tirando do Estoque  de ${dataProdutos.produtos[i].Nome}`
  );
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
  submit.value = "Mover";
  submit.setAttribute("href", "prateleiras.html");
  submit.setAttribute("style", "text-align: center");
  submit.setAttribute("onclick", `adicionaPrateleira(${i})`);
  form.appendChild(submit);
  container.appendChild(form);
  var modal_container = document.getElementById("pratAddContainer");
  modal_container.appendChild(container);
}

// PATCHs e Validações necessárias (Estoque -> Prateleira)
async function adicionaPrateleira(i) {
  var id_prat = i+1;
  var qtde = document.getElementById("input").value;
  
  if (qtde > dataProdutos.produtos[i].QntTotal) {
    alert("Esse número de produtos excede a quantidade no estoque!!");
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
  var qtdePrat = aux1 + aux2;
  console.log(qtdePrat);

  if (qtdePrat > dataPrateleiras.prateleiras[i].QntMax) {
    alert("Esse número de produtos excede a quantidade máxima da prateleira!!");
    history.go(-1);
    return;
  }

  var aux3 = parseInt(dataProdutos.produtos[i].QntTotal);
  var qtdeNova = aux3 - aux2;
  console.log(qtdeNova);

  if (qtdeNova < dataProdutos.produtos[i].QntMin) {
    alert(
      "ATENÇÃO: Quantidade no estoque abaixo da esperada, favor reestocá-lo!!"
    );
    //CONEXÃO COM MONGO NECESSÁRIA
  }

  var id_produto = dataProdutos.produtos[i].ID_PRODUTO.toString();

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

  fetch("http://localhost:3000/produtos", {
    method: "PATCH",
    body: JSON.stringify({
      qntTotal: qtdeNova,
      id_produto: id_produto,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  window.location.href = "./prateleiras.html";
}

// Removendo da tela a tabela do estoque
function fechaEstoque() {
  var elems = document.querySelectorAll(".tag");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
  fechaForm();
}

// Removendo da tela a form para mover à prateleira
function fechaForm() {
  var elems = document.querySelectorAll(".formContainer");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
}
