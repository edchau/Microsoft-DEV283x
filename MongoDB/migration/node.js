const mongodb= require('mongodb')
const customers = require('./m3-customer-data.json')
const customerAddresses = require('./m3-customer-address-data.json')
const async = require('async')

let tasks = []
const limit = parseInt(process.argv[2], 10) || 1000

const url = 'mongodb://localhost:27017/migration'
const dbName = 'migrate-data'

mongodb.MongoClient.connect(url, {useUnifiedTopology: true}, (error, client) => {
	if (error) return process.exit(1)
	const db = client.db(dbName)
	
	customers.forEach((customer, index) => {
		customers[index] = Object.assign(customer, customerAddresses[index])

		if (index % limit == 0) {
			const start = index
			const end = (start+limit > customers.length) ? customers.length-1:start+limit
			tasks.push((done) => {
				// depends on number of parallel tasks (limit)
				console.log(`Processing ${start}-${end} out of ${customers.length}`)
				db.collection('customers').insertMany(customers.slice(start, end), (error, results) => {
					//signal completion b/c parallel
					done(error)
				})
			})
		}
	})

	console.log(`Launching ${tasks.length} parallel task(s)`)
	const startTime = Date.now()
	async.parallel(tasks, (error, results) => {
		if (error) console.error(error)
		const endTime = Date.now()
		console.log(`Execution time: ${endTime-startTime}`)
		client.close()
	})
})