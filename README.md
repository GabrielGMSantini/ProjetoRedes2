<h1 align="center"> Projeto de Desenvolvimento de Sistema de Controle de Estoque </h1>

<p align="center">
<img src="http://img.shields.io/static/v1?label=STATUS&message=DEPLOYED&color=BLUE&style=for-the-badge"/>
</p>

<h2> ✍ Descrição do Projeto </h2>

Projeto feito no laboratório da disciplina de Redes de Computadores A, sobre o oitavo semestre do curso de Engenharia da Computação lecionado pelo professor Leandro Alonso Xastre, na Pontifícia Universidade Católica de Campinas, no ano de 2022.

O projeto consiste em desenvolver um sistema de controle de estoque de produtos, prateleiras e caixa de um mercado. A arquitetura do sistema baseia-se em um website e um aplicativo desenvolvido em flutter como Front-end e uma REST API desenvolvida em node.js como Back-end, além da utilização de um banco relacional em MYSQL e um não-relacional no MongoDB. Como solicitado, para a conexão dos bancos e da REST API, foi aplicado um sistema de mensageria em RabbitMQ.

## :hammer: Funcionalidades do Projeto

- `Cadastro e Atualização de Estoque por QR CODE`: Ao ler um QR CODE específico para cada lote dos produtos cadastrados no estoque do sistema, é possível atualizar a quantidade de um produto ou adicionar um produto novo.
- `Movimentação de Estoque, Prateleira e Caixa`: Utilizando o Website, é possível movimentar produtos do estoque para as prateleiras, recebendo alertas para a quantidade mínima do estoque a fim de saber quando deve ser restocada, além de movimentar produtos da prateleira para o caixa, com o objetivo de finalizar uma venda.
- `Microsserviços com Mensageria`: Toda atualização feita tanto no banco de dados relacional, quanto no não-relacional é feita por uma REST API que se comunica por canais do RabbitMQ, um sistema de mensageria.
- `Análise de Dados`: Com as informações armazenadas no banco não-relacional, pode-se analisar quais produtos precisam de mais espaço na prateleira, ranquear os produtos por mais rotatividade e verificar a quantidade mínima recomendada no estoque de cada produto.

## 📁 Requisitos para Executar o Sistema

Instalados Node.js, RabbitMQ, Flutter, Jupyter.

## 📁 Acesso ao Projeto

Para executar o projeto, seguir os passos abaixo:

1. Ligar uma conexão no servidor MYSQL, rodar a query "BD.txt" na root do projeto, alocar a quantidade de produtos, prateleiras, lotes e caixa desejada e colocar as credenciais da conta que vai utilizar o sistema em /Broker/db.js

2. Ligar o servidor do RabbitMQ

3. no Terminal da Pasta root do Projeto, digitar em sequência para ligar a REST API:

cd Server

npm i

npm start

4. no Terminal da Pasta root do Projeto, digitar em sequência para ligar o corretor de mensageria:

cd Broker

npm i

npm start

5. Para ativar o site, é possível acessá-lo pela pasta Site, abrindo o arquivo "venda.html".

6. Para ligar o aplicativo, digitar em sequência:
cd App/mercado
flutter pub get
flutter run

7. Para executar a análise de dados, executar o arquivo "análiseRedesProj2.ipynb" no Jupyter.

## 🛠️ Abrir e rodar o Projeto

Ao executar o arquivo, primeiro é pedido que o usuário digite seu IP e a porta que o seu servidor usará, o que é importante para que outros usuários possam mandar mensagens nesse servidor. Desta forma, um menu irá aparecer com opções de envio e resposta. A opção de resposta apenas funcionará se houver alguma mensagem recebida pelo servidor.
Escolhida a opção de envio, primeiro o sistema irá perguntar o IP e a porta do destinatário da mensagem e por fim, pedirá que o usuário escreva a mensagem, o que fará com que o servidor espere uma mensagem de ACK.
Caso o ACK seja positivo, o sistema irá esperar uma resposta do destinatário, mas caso não seja, irá notificar o recebimento negativo do ACK e voltará ao menu.

Para responder uma mensagem após recebê-la, o usuário deverá escolher a opção de resposta e logo após, teclar ENTER por medida de segurança a fim da limpeza de buffer, mandando assim a resposta que será notificada na tela de quem mandou a mensagem inicial.

## ✅ Tecnologias Usadas

<h5>Node.js</h5>
<h5>HTML CSS JS</h5>
<h5>Flutter</h5>
<h5>Jupyter Nootebook</h5>
<h5>MongoDB</h5>
<h5>MySQL</h5>
<h5>RabbitMQ</h5>

<h2> 👥 Integrantes do Projeto </h2>

<h4>Gabriel Gonçalves Mattos Santini</h4>
<h4>Gustavo Campos Dias</h4>
<h4>Gustavo Melo Cacau</h4>
<h4>João Lucas Fernandes da Silva</h4>
<h4>Lucas Rodrigues São João Miguel</h4>
