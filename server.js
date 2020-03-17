
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


app.get('/', function(req,res){
  res.send("Hello world")
})

app.get('/hello', function (req, res) {
  var nom = req.query.nom
  if(nom){
    res.send("Bonjour, "+nom)
  }
  else{
    res.send("Quel est votre nom ?")
  }
})


app.post('/chat', function (req, res) {
  if (req.body.msg === 'ville') {
    res.send('Nous sommes à Paris')
  } else if (req.body.msg === 'météo') {
    res.send('Il fait beau')
  } else {
    res.send(req.body.msg)
  }
})

app.listen(PORT, function () {
  console.log('Example app listening on port ${PORT}!')
})
//67f34147
