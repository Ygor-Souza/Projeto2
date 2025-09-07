const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const porta = 8085;
const ipDoServidor = "127.0.0.1";
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "formulario",
  password: "postgres",
});

//rotas:

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", function (req, res) {
  res.redirect("/cadastroRestaurantes");
});

app.get("/cadastroRestaurantes", function (req, res) {
  res.sendFile(__dirname + "/formulario.html");
});

app.post("/cadastroRestaurantes", function (req, res) {
  const { name, endereco, telefone, email, descricao } = req.body;

  pool.query(
    "INSERT INTO store.restaurante (name, endereco, telefone, email, descricao) VALUES ($1, $2, $3, $4, $5)",
    [name, endereco, telefone, email, descricao],
    (error, result) => {
      if (error) {
        res.status(500).send("Erro ao inserir dados: " + error);
      } else {
        res.redirect("/resultado");
      }
    }
  );
});

const restaurantes = [];

app.get("/resultado", function (req, res) {
  pool.query("SELECT * FROM store.restaurante", (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      let html = `
        <html>
        <head>
            <title>Restaurantes</title>
            <style>
            table{border-collapse:  collapse; width: 100%;}
            th, td {border: 1px solid #ccc; padding: 8px; text-align: left;}
            th { background-color: #f2f2f2;}
            </style>
        </head>
        <body>
            <h1>Lista de Restaurantes</h1>
            <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Descrição</th>
            </tr>
        `;

      result.rows.forEach((restaurantes) => {
        html += `
                <tr>
                <th>${restaurantes.id}</th>
                <th>${restaurantes.name}</th>
                <th>${restaurantes.endereco}</th>
                <th>${restaurantes.telefone}</th>
                <th>${restaurantes.email}</th>
                <th>${restaurantes.descricao}</th>
                </tr>
                `;
      });

      html += `
        </table>
        </body>
        </html>
        `;

      res.send(html);
      //res.status(200).json(result.rows);
    }
  });
});

app.listen(porta, ipDoServidor, function () {
  console.log(
    "\n Aplicacao web executando em http://" + ipDoServidor + ":" + porta
  );
});
