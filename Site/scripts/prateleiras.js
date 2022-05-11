var estoques = [];

async function mostraEstoques() {
  const response = await fetch("http://localhost:3000/estoques", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data.estoques);
  estoques = data.estoques;
  console.log(estoques[0]);

  var tag = document.createElement("p");
  var text = document.createTextNode(estoques[0].ID_ESTOQUE);
  tag.appendChild(text);
  var modal_container = document.getElementById("estoqueID");
  modal_container.appendChild(tag);

  var tag = document.createElement("p");
  var text = document.createTextNode(estoques[0].QntTotal);
  tag.appendChild(text);
  var modal_container = document.getElementById("estoqueQntTotal");
  modal_container.appendChild(tag);

  var tag = document.createElement("p");
  var text = document.createTextNode(estoques[0].QntMin);
  tag.appendChild(text);
  var modal_container = document.getElementById("estoqueQntMin");
  modal_container.appendChild(tag);

  var tag = document.createElement("p");
  var text = document.createTextNode(estoques[0].fk_Produtos_ID_PRODUTO);
  tag.appendChild(text);
  var modal_container = document.getElementById("productID");
  modal_container.appendChild(tag);
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
