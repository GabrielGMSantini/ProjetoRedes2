mostraProdutos = () => {
  fetch("http://localhost:3000/ongs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (!res.ok) {
        console.log("Fetch sem sucesso");
      }
      res.json();
    })
    .then((data) => console.log(data))
    .catch((err) => console.error("ERRO: ", err));

  data.body.map((val) => {
    console.log(val.body);
  });
};
