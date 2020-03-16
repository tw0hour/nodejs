
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


app.get('/hello', function (req, res) {
  var nom = req.params.nom
  if(res.query.nom){
    res.send("Bonjour, "+req.query.nom)
  }
  else{
    res.send("Quel est votre nom ?")
  }
})

app.listen(PORT, function () {
  console.log('Example app listening on port ${PORT}!')
})
//67f34147
