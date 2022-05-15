var dataProduto;
var dataPrateleiras;
var dataGondolas;

// GET inicial das Prateleiras para mostrar na tela
async function getGondolas() {
  const response = await fetch("http://localhost:3000/gondolas", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  dataGondolas = data;

  const response2 = await fetch("http://localhost:3000/produtos", {
    method: "GET",
  });
  const data2 = await response2.json();
  console.log(data2);
  dataProdutos = data2;

  mostraGondolas();
}

// Colocando a gôndola puxada pelo GET na tela
function mostraGondolas() {
  for (var i = 0; i < dataGondolas.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataGondolas.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_id = dataProdutos.produtos[j].ID_PRODUTO;
      }
    }
    var text = document.createTextNode(product_id);
    tag.appendChild(text);
    var modal_container = document.getElementById("gondolaProductID");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataGondolas.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataGondolas.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_name = dataProdutos.produtos[j].Nome;
      }
    }
    var text = document.createTextNode(product_name);
    tag.appendChild(text);
    var modal_container = document.getElementById("gondolaProductNome");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataGondolas.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    var text = document.createTextNode(dataGondolas.gondolas[i].QntTotal);
    tag.appendChild(text);
    var modal_container = document.getElementById("gondolaQntTotal");
    modal_container.appendChild(tag);
  }

  for (var i = 0; i < dataGondolas.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    for (var j = 0; j < dataProdutos.quantidade; j++) {
      if (
        dataProdutos.produtos[j].ID_PRODUTO ==
        dataGondolas.gondolas[i].fk_Produtos_ID_PRODUTO
      ) {
        product_preco = dataProdutos.produtos[j].Preco;
      }
    }
    var text = document.createTextNode("R$ " + product_preco.toFixed(2));
    tag.appendChild(text);
    var modal_container = document.getElementById("gondolaProductPreco");
    modal_container.appendChild(tag);
  }

  vendaPreco = parseFloat(0);
  for (var i = 0; i < dataGondolas.quantidade; i++) {
    var tag = document.createElement("p");
    tag.classList.add("gondElem");
    var text = document.createTextNode(
      "R$ " + dataGondolas.gondolas[i].PrecoTotal.toFixed(2)
    );
    gondolaPreco = parseFloat(dataGondolas.gondolas[i].PrecoTotal.toFixed(2));
    tag.appendChild(text);
    var modal_container = document.getElementById("gondolaPrecoTotal");
    modal_container.appendChild(tag);
    vendaPreco = vendaPreco + gondolaPreco;
    document.getElementById(
      "vendaPrecoTotal"
    ).innerHTML = `R$ ${vendaPreco.toFixed(2)}`;
  }
}

getGondolas();

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
      var text = document.createTextNode(product_preco);
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
      tag.setAttribute("onclick", `adicionaCarrinho(${i})`);
      var text = document.createTextNode("+");
      tag.appendChild(text);
      var modal_container = document.getElementById("addButton");
      modal_container.appendChild(tag);
    }
  }
}

// Removendo da tela a tabela do estoque
function fechaPrateleira() {
  var elems = document.querySelectorAll(".tag");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
  fechaCaixa();
}

// Removendo da tela a tabela de prateleiras
function fechaCaixa() {
  var elems = document.querySelectorAll(".pratContainer");
  for (var i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
}
