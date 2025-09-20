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
  database: "Restaurantes",
  password: "postgres",
});

//npm install body-parser --save
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//rotas:

app.get("/", function (req, res) {
  res.redirect("/resultado");
});

app.get("/cadastroRestaurantes", function (req, res) {
  res.sendFile(__dirname + "/formulario.html");
});

app.post("/cadastroRestaurantes", function (req, res) {
  const { nome, endereco, telefone, email, descricao, site } = req.body;

  pool.query(
    "INSERT INTO restaurante (nome, endereco, telefone, email, descricao, site) VALUES ($1, $2, $3, $4, $5, $6)",
    [nome, endereco, telefone, email, descricao, site],
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
  pool.query("SELECT * FROM restaurante ORDER BY nome ASC", (error, result) => {
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
                <th>Site</th>
            </tr>
        `;

      result.rows.forEach((restaurantes) => {
        html += `
                <tr>
                <th>${restaurantes.id}</th>
                <th>${restaurantes.nome}</th>
                <th>${restaurantes.endereco}</th>
                <th>${restaurantes.telefone}</th>
                <th>${restaurantes.email}</th>
                <th>${restaurantes.descricao}</th>
                <th>${restaurantes.site}</th>
                </tr>
                `;
      });

      html += `
                  </table>
                  <li><a href="/cadastroRestaurantes">Cadastrar Restaurante</a></li>

                  <form id="formConsulta1">
                      <label for="id1">Consultar Restaurante por ID</label>
                      <input type="number" id="id1" name="id2" required />
                      <button type="submit">Consultar</button>
                  </form>

                  <script>
                    document.getElementById("formConsulta1").addEventListener("submit", function (e) {
                        e.preventDefault();
                        const id1 = document.getElementById("id1").value;
                        window.location.href = "/consultar-restaurante/" + id1;
                      });
                  </script>


                  <form id="formConsulta2" method="post">
                      <label for="id2">Excluir Restaurante por ID</label>
                      <input type="number" id="id2" name="id2" required />
                      <button type="submit">Excluir</button>
                  </form>

                  <script>
                    document.getElementById("formConsulta2").addEventListener("submit", function (e) {
                        e.preventDefault();
                        const id2 = document.getElementById("id2").value.trim();

                        if(!id2){
                          alert("Por favor, insira um ID válido.");
                        }
                        window.location.href = "/excluir-restaurante/" + id2;
                      });
                  </script>
        </body>
        </html>
        `;

      res.send(html);
      //res.status(200).json(result.rows);
    }
  });
});

app.get("/consultar-restaurante/:id", async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, nome, endereco, telefone, email, descricao, site FROM restaurante WHERE id = $1",
      [id]
    );

    const restaurante = result.rows;

    if (restaurante.length === 0) {
      res.status(404).send("Resgistro não encontrado");
    } else {
      const registro = restaurante[0];

      res.send(`
        <h1>Dados do Registro</h1>
        <p><b>ID:</b>${registro.id}</p>  
        <p><b>Nome do restaurante:</b>${registro.nome}</p>  
        <p><b>Endereço:</b>${registro.endereco}</p>  
        <p><b>Telefone:</b>${registro.telefone}</p>
        <p><b>Email:</b>${registro.email}</p>
        <p><b>Descrição:</b>${registro.descricao}</p>
        <p><b>Site:</b>${registro.site}</p>

        <li><a href="/resultado">Voltar</a></li>


        `);
    }
  } catch (error) {
    console.error("Erro ao executar a consulta: ", error);
    res.status(500).send("Erro ao consultar registro");
  }
});

app.get("/excluir-restaurante/:id", async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query("DELETE FROM restaurante WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).send("Registro não encontrado");
    } else {
      res.send(`Restaurante excluído com sucesso!
         <li><a href="/resultado">Voltar</a></li>
      `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao excluir o restaurante");
  }
});

app.listen(porta, ipDoServidor, function () {
  console.log(
    "\n Aplicacao web executando em http://" + ipDoServidor + ":" + porta
  );
});
