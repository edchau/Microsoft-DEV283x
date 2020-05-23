const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
let app = express()

let store = {}
store.accounts = []
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorhandler())

app.get('/accounts', (req, res) => {
  res.status(200).send(store.accounts)
})

app.post('/accounts', (req, res) => {
  let newAccount = req.body
  let id = store.accounts.length
  store.accounts.push(newAccount)
  res.status(201).send({id: id})
})

app.put('/accounts/:id', (req, res) => {
  store.accounts[req.params.id] = req.body
  res.status(200).send(store.accounts[req.params.id])

})

app.delete('/accounts/:id', (req, res) => {
  store.accounts.splice(req.params.id, 1)
  res.status(204).send()
})

app.listen(3000)


// test.sh
// //posts account data
// curl -H "Content-Type: application/json" -X POST -d '{"balance": 100, "name":"checking"}'  "http://localhost:3000/accounts" 

// //updates account data at a specified id
// curl -H 'Content-Type: application/json' -X PUT -d '{"balance": 200, "name": "savings"}'  "http://localhost:3000/accounts/0" 

// //gets account data
// curl "http://localhost:3000/accounts" 

// //deletes account data and a specified id
// curl -X DELETE "http://localhost:3000/accounts/0" 