const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const porta = 8085
const ipDoServidor = '127.0.0.1'

//rotas:


app.use(bodyParser.urlencoded({
    extended:false
}))

app.get('/', function(req, res){
    res.redirect("/cadastroRestaurantes")
});

app.get('/cadastroRestaurantes', function(req,res){
    res.sendFile(__dirname + "/formulario.html");
});

const restaurantes = [];

app.get('/resultado', function(req,res){
    const nome = req.query.nome;
    const end = req.query.end;
    const telefone = req.query.telefone;
    const email = req.query.email;
    const descricao = req.query.descricao;
    const tabela = req.query.tabela;
    restaurantes.push({nome, end, telefone, email, descricao});

    let tabelaHTML = `
    <h1>Restaurantes Cadastrados</h1>
        <table border name="tabela">
            <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Descrição</th>
            </tr>
    `;

    for(const r of restaurantes){
        tabelaHTML+=`
            <tr>
            <th>${r.nome}</th>
            <th>${r.telefone}</th>
            <th>${r.end}</th>
            <th>${r.end}</th>
            <th>${r.descricao}</th>
            </tr>
            `;
    }

    tabelaHTML += `</table>`;
    res.send(tabelaHTML);
});

app.listen(porta, ipDoServidor, function(){
console.log('\n Aplicacao web executando em http://'+ipDoServidor+':'+porta);
})