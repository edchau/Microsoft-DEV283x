const express  = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan('dev'))

app.use((req, res, next)  =>{
	console.log(`${req.method}:  ${req.url}`)
	next()
})

app.use((req, res, next)  =>{
	if(req.query.api_key){
		next()
	} else {
		res.status(401).send({msg: 'Not authorized'})
	}
})

app.get('/', (req, res)  => {
	res.send({msg:'hello world'})
})

app.get('/accounts', (req, res, next) => {
	console.log('accounts inline middleware') //only if applies to this route
	next(new Error('oops'))
}, (req, res)  => {
	res.send({msg:'accounts'})
})

app.post('/transactions', (req, res)  => {
	console.log(req.body)
	res.send({msg:'transactions'})
})

app.use((error, req, res, next)  => {
	res.status(500).send(error)
})

app.listen(3000)



// curl localhost:3000/transactions -i
// curl localhost:3000/accounts -i
// curl localhost:3000/ -i
// curl localhost:3000/transactions?api_key=123 -i
// curl localhost:3000/accounts?api_key=123 -i
// -H header
// curl -d '{"key":"value"}' localhost:3000/transactions?api_key=123 -i -H 'Content-Type: application/json'



