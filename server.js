
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


app.get('/', function (req, res) {
  var nom = req.params.p1
  if(res.query.nom){
    res.send("Bonjour, "+req.quey.nom)
  }
  else{
    res.send("Quel est votre nom ?")
  }
})

app.listen(PORT, function () {
  console.log('Example app listening on port ${PORT}!')
})
//67f34147
