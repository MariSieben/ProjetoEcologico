/*utilização express*/
const express = require("express") /*começar o servidor*/
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache:true //salvando coisas na memoria pra ser rapido
})


//configurar caminhos da minha aplicação
//pagina inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título"})
})

server.get("/create-point", (req, res) => {
    //pegar o que tem na url, req.query: Query Strings da url
    //console.log(req.query)



    return res.render("create-point.html")
})
//salvar as respostas do cadastro em outro lugar
server.post("/savepoint", (req, res) => {

    //req.body: O corpo do nosso formulário
    //console.log(req.body) 

    //inserir dados no banco de dados
    const query = `
        INSERT INTO places(
         image,
         name,
         address,
         address2,
         state,
         city,
         items
        ) VALUES (?,?,?,?,?,?,?);
   `

  const values = [
     req.body.image,
     req.body.name,
     req.body.address,
     req.body.address2,
     req.body.state,
     req.body.city,
     req.body.items  
  ]

  function afterInsertData(err) {
    if(err) {
       console.log(err)
       return res.send("Erro no cadastro!")
    }

    console.log("Cadastrado com sucesso")
    console.log(this)

    return res.render("create-point.html", { saved: true})
    
  }

  db.run(query, values, afterInsertData)
     
})

server.get("/search", (req, res) => {

    //quando o usuario apertar pesquisar sem pesquisar nada, não mostrar nada:
    const search = req.query.search

    if(search == "") {
        //pesquisa vazia

        return res.render("search-results.html", {total: 0})

    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        console.log(rows)

        const total = rows.length //quantos elementos tem no array
        
        //mostrar a página html com os dados  do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    })

})


//ligar o servidor
server.listen(3000)