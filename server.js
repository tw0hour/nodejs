const fs = require('fs')
const util = require('util')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'chat-bot';
const COLLECTION_NAME = 'messages';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readValuesFromFile() {
  const reponses = await readFile('réponses.json', { encoding: 'utf8' })
  return JSON.parse(reponses)
}

let collection
const app = express();
app.use(express.json()) // for parsing application/json

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello', function (req, res) {
  const nom = req.query.nom
  if (nom) {
    res.send('Bonjour, ' + nom + ' !')
  } else {
    res.send('Quel est votre nom ?')
  }
})

app.get('/messages/all', async function (req, res) {
  const messages = await collection.find({}).toArray();
  res.send(messages)
})

app.delete('/messages/last', async function (req, res) {
  const lastTwoDocuments = await collection.find({}).sort({ _id: -1 }).limit(2).toArray()
  const [ botReply, userMsg ] = lastTwoDocuments
  await collection.deleteOne(userMsg)
  await collection.deleteOne(botReply)
  res.send('ok')
})

app.post('/chat', async function (req, res) {

  async function sendReply(reply) {
    await collection.insertOne({ from: 'user', msg: req.body.msg })
    await collection.insertOne({ from: 'bot', msg: reply })
    res.send(reply)
  }

  if (req.body.msg === 'ville') {
    sendReply('Nous sommes à Paris')
  } else if (req.body.msg === 'météo') {
    sendReply('Il fait beau')
  } else {
    if (/ = /.test(req.body.msg)) {
      const [ cle, valeur ] = req.body.msg.split(' = ')
      let valeursExistantes
      try {
        valeursExistantes = await readValuesFromFile();
      } catch (err) {
        sendReply('error while reading réponses.json', err)
        return
      }
      const data = JSON.stringify({
        ...valeursExistantes,
        [cle]: valeur
      })
      try {
        await writeFile('réponses.json', data)
        sendReply('Merci pour cette information !')
      } catch (err) {
        console.error('error while saving réponses.json', err)
        sendReply('Il y a eu une erreur lors de l\'enregistrement')
      }
    } else {
      const cle = req.body.msg
      try {
        const values = await readValuesFromFile()
        const reponse = values[cle]
        sendReply(cle + ': ' + reponse)
      } catch (err) {
        sendReply('error while reading réponses.json', err)
      }
    }
  }
})

;(async () => {
  console.log(`Connecting to ${DATABASE_NAME}...`)
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  await client.connect()
  collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME)
  console.log(`Successfully connected to ${DATABASE_NAME}`)
  app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT)
  })
  // await client.close() // should be done when the server is going down
})()
